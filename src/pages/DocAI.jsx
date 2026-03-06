import React, { useState, useRef, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const DocAI = () => {
  const { token } = useContext(AppContext);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your AI Medical Assistant. I can help you with:\n\n• Finding available doctors by specialty\n• Checking doctor availability\n• Booking appointments\n• Medical information and queries\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isInitialMount = useRef(true);

  const API_BASE_URL =
    import.meta.env.VITE_LANGCHAIN_URL || "http://localhost:8001";

  // Auto-scroll to bottom when new messages arrive (but not on initial mount)
  const scrollToBottom = () => {
    if (!isInitialMount.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, streamingContent]);

  // Focus input on mount and mark initial mount as complete
  useEffect(() => {
    inputRef.current?.focus();
    // Set initial mount to false after a short delay to allow page to settle
    setTimeout(() => {
      isInitialMount.current = false;
    }, 100);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setLoading(true);
    setStreamingContent("");

    try {
      // Prepare chat history (excluding the current message)
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${API_BASE_URL}/booking/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          input: {
            input: currentInput,
            chat_history: chatHistory,
            user_token: token || "", // Send user authentication token
          },
          config: {},
          kwargs: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines from buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6).trim();

              // Skip empty data or [DONE] marker
              if (!jsonStr || jsonStr === "[DONE]") continue;

              const data = JSON.parse(jsonStr);

              // LangServe streaming format handling
              // The response comes in chunks, accumulate the content
              let token = "";

              if (typeof data === "string") {
                token = data;
              } else if (data.content) {
                token = data.content;
              } else if (data.output) {
                token = data.output;
              } else if (data.token) {
                token = data.token;
              } else if (data.ops && Array.isArray(data.ops)) {
                // Handle operational transform format from LangChain
                for (const op of data.ops) {
                  if (op.op === "add" && op.value) {
                    token +=
                      typeof op.value === "string"
                        ? op.value
                        : op.value.content || "";
                  }
                }
              }

              if (token) {
                accumulatedContent += token;
                setStreamingContent(accumulatedContent);
              }
            } catch (parseError) {
              console.warn("Failed to parse SSE chunk:", line, parseError);
            }
          } else if (line.startsWith("event: ")) {
            // LangServe sends event types like 'data', 'end', 'error'
            const eventType = line.slice(7).trim();
            if (eventType === "end") {
              break;
            }
          }
        }
      }

      // Add the complete message to the messages array
      const assistantMessage = {
        role: "assistant",
        content:
          accumulatedContent ||
          "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        "Failed to get response. Please check if the AI server is running."
      );

      const errorMessage = {
        role: "assistant",
        content:
          "⚠️ I'm sorry, I'm having trouble connecting to the AI server. Please make sure the LangChain server is running on port 8000.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingContent("");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "👋 Hello! I'm your AI Medical Assistant. I can help you with:\n\n• Finding available doctors by specialty\n• Checking doctor availability\n• Booking appointments\n• Medical information and queries\n\nHow can I assist you today?",
        timestamp: new Date(),
      },
    ]);
    toast.success("Chat cleared successfully!");
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const formatContent = (content) => {
    if (!content) return null;

    try {
      // Split content into sections
      const sections = content.split("\n");
      const formatted = [];
      let inCodeBlock = false;
      let codeBlockContent = [];
      let listItems = [];
      let listType = null;

      sections.forEach((section, idx) => {
        const trimmedSection = section.trim();

        // Handle code blocks
        if (trimmedSection.startsWith("```")) {
          if (inCodeBlock) {
            formatted.push(
              <pre
                key={`code-${idx}-${formatted.length}`}
                className="bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-300 p-5 rounded-xl overflow-x-auto my-4 text-sm border border-slate-700 shadow-lg"
              >
                <code className="font-mono">{codeBlockContent.join("\n")}</code>
              </pre>
            );
            codeBlockContent = [];
            inCodeBlock = false;
          } else {
            inCodeBlock = true;
          }
          return;
        }

        if (inCodeBlock) {
          codeBlockContent.push(section);
          return;
        }

        // Handle inline code
        const processInlineCode = (text) => {
          const parts = text.split(/(`[^`]+`)/g);
          return parts.map((part, i) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <code
                  key={`inline-${i}`}
                  className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-sm font-mono border border-blue-200"
                >
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          });
        };

        // Handle bold text
        const processBold = (text) => {
          const parts =
            typeof text === "string" ? text.split(/(\*\*[^*]+\*\*)/g) : [text];
          return parts.map((part, i) => {
            if (
              typeof part === "string" &&
              part.startsWith("**") &&
              part.endsWith("**")
            ) {
              return (
                <strong key={`bold-${i}`} className="font-bold text-gray-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });
        };

        // Process text formatting
        const formatText = (text) => {
          try {
            const withCode = processInlineCode(text);
            return withCode.map((part, i) => {
              if (typeof part === "string") {
                return <span key={`text-${i}`}>{processBold(part)}</span>;
              }
              return part;
            });
          } catch (error) {
            return text;
          }
        };

        // Flush list if we're no longer in a list
        const flushList = () => {
          if (listItems.length > 0) {
            const ListTag = listType === "ordered" ? "ol" : "ul";
            formatted.push(
              <ListTag
                key={`list-${idx}-${formatted.length}`}
                className={`my-4 space-y-2.5 ${
                  listType === "ordered"
                    ? "list-decimal list-inside"
                    : "space-y-2"
                }`}
              >
                {listItems.map((item, i) => (
                  <li
                    key={`item-${i}`}
                    className="text-gray-700 leading-relaxed flex items-start gap-2.5"
                  >
                    {listType === "unordered" && (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mt-2"></span>
                    )}
                    <span className="flex-1">{formatText(item)}</span>
                  </li>
                ))}
              </ListTag>
            );
            listItems = [];
            listType = null;
          }
        };

        // Handle bullet points (•, -, *)
        if (trimmedSection.match(/^[•\-*]\s+(.+)/)) {
          const content = trimmedSection.replace(/^[•\-*]\s+/, "");
          if (listType !== "unordered") {
            flushList();
            listType = "unordered";
          }
          listItems.push(content);
          return;
        }

        // Handle numbered lists
        if (trimmedSection.match(/^\d+\.\s+(.+)/)) {
          const content = trimmedSection.replace(/^\d+\.\s+/, "");
          if (listType !== "ordered") {
            flushList();
            listType = "ordered";
          }
          listItems.push(content);
          return;
        }

        flushList();

        // Handle headers (# ## ###)
        if (trimmedSection.startsWith("###")) {
          formatted.push(
            <h3
              key={`h3-${idx}`}
              className="text-lg font-bold text-gray-900 mt-5 mb-3 border-b border-gray-200 pb-2"
            >
              {trimmedSection.replace(/^###\s*/, "")}
            </h3>
          );
          return;
        }

        if (trimmedSection.startsWith("##")) {
          formatted.push(
            <h2
              key={`h2-${idx}`}
              className="text-xl font-bold text-gray-900 mt-6 mb-3 border-b-2 border-blue-200 pb-2"
            >
              {trimmedSection.replace(/^##\s*/, "")}
            </h2>
          );
          return;
        }

        if (trimmedSection.startsWith("#")) {
          formatted.push(
            <h1
              key={`h1-${idx}`}
              className="text-2xl font-bold text-gray-900 mt-6 mb-4 border-b-2 border-blue-300 pb-3"
            >
              {trimmedSection.replace(/^#\s*/, "")}
            </h1>
          );
          return;
        }

        // Handle horizontal rules
        if (trimmedSection.match(/^[-*_]{3,}$/)) {
          formatted.push(
            <hr key={`hr-${idx}`} className="my-6 border-t-2 border-gray-200" />
          );
          return;
        }

        // Handle blockquotes
        if (trimmedSection.startsWith(">")) {
          formatted.push(
            <blockquote
              key={`quote-${idx}`}
              className="border-l-4 border-blue-500 bg-blue-50 pl-5 py-3 pr-4 italic text-gray-700 my-4 rounded-r-lg"
            >
              {formatText(trimmedSection.replace(/^>\s*/, ""))}
            </blockquote>
          );
          return;
        }

        // Regular paragraphs
        if (trimmedSection) {
          formatted.push(
            <p key={`p-${idx}`} className="mb-3 leading-relaxed text-gray-800">
              {formatText(section)}
            </p>
          );
        } else {
          formatted.push(<div key={`br-${idx}`} className="h-2" />);
        }
      });

      // Flush any remaining list
      if (listItems.length > 0) {
        const ListTag = listType === "ordered" ? "ol" : "ul";
        formatted.push(
          <ListTag
            key="list-final"
            className={`my-4 space-y-2.5 ${
              listType === "ordered" ? "list-decimal list-inside" : "space-y-2"
            }`}
          >
            {listItems.map((item, i) => (
              <li
                key={`final-item-${i}`}
                className="text-gray-700 leading-relaxed flex items-start gap-2.5"
              >
                {listType === "unordered" && (
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mt-2"></span>
                )}
                <span className="flex-1">{formatText(item)}</span>
              </li>
            ))}
          </ListTag>
        );
      }

      return <div className="formatted-content">{formatted}</div>;
    } catch (error) {
      console.error("Error in formatContent:", error);
      // Fallback to simple text rendering
      return <div className="whitespace-pre-wrap break-words">{content}</div>;
    }
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === "user";

    return (
      <div
        key={index}
        className={`flex gap-2 sm:gap-3 mb-3 sm:mb-4 ${
          isUser ? "justify-end" : "justify-start"
        } animate-[slideIn_0.3s_ease-out]`}
      >
        {!isUser && (
          <div className="flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5f6fff] flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        )}

        <div
          className={`flex flex-col max-w-[80%] sm:max-w-[75%] md:max-w-[70%] ${
            isUser ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`px-3 py-2 sm:px-4 sm:py-2.5 ${
              isUser
                ? "bg-[#5f6fff] text-white rounded-t-2xl rounded-bl-2xl"
                : "bg-gray-50 text-gray-800 rounded-t-2xl rounded-br-2xl border border-gray-200"
            }`}
          >
            <div className="text-[13px] sm:text-sm leading-relaxed">
              {isUser ? (
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              ) : (
                formatContent(message.content)
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1 px-1">
            <span className="text-[10px] sm:text-xs text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            {!isUser && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                  toast.success("Copied!");
                }}
                className="text-gray-400 hover:text-[#5f6fff] transition-colors p-0.5"
                title="Copy"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Professional Medical Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Medical Cross Icon */}
              <div className="flex-shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#5f6fff] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    AI Medical Assistant
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Get instant medical advice • 24/7 Available
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              title="Clear conversation"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-hidden bg-gray-50/30">
        <div
          ref={messagesContainerRef}
          className="h-full overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e5e7eb transparent",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 min-h-full flex flex-col">
            <div className="flex-1 space-y-3 sm:space-y-4">
              {messages.map((message, index) => renderMessage(message, index))}

              {/* Streaming Message */}
              {loading && streamingContent && (
                <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 justify-start animate-[slideIn_0.3s_ease-out]">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5f6fff] flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex flex-col max-w-[80%] sm:max-w-[75%] md:max-w-[70%]">
                    <div className="bg-gray-50 text-gray-800 rounded-t-2xl rounded-br-2xl border border-gray-200 px-3 py-2 sm:px-4 sm:py-2.5">
                      <div className="text-[13px] sm:text-sm leading-relaxed">
                        <div className="whitespace-pre-wrap break-words">
                          {streamingContent}
                        </div>
                        <span className="inline-block w-0.5 h-4 bg-[#5f6fff] ml-1 animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {loading && !streamingContent && (
                <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5f6fff] flex items-center justify-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col max-w-[80%] sm:max-w-[75%] md:max-w-[70%]">
                    <div className="bg-gray-50 rounded-t-2xl rounded-br-2xl border border-gray-200 px-3 py-2 sm:px-4 sm:py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-[#5f6fff] rounded-full animate-bounce"></span>
                          <span
                            className="w-2 h-2 bg-[#5f6fff] rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-[#5f6fff] rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">
                          Analyzing...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Area - Sticks to bottom, scrolls up with page end */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 mt-6 sm:mt-8">
              <form onSubmit={handleSendMessage} className="relative">
                {/* Quick Action Pills */}
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-full whitespace-nowrap transition-colors"
                    onClick={() => setInputValue("Find doctors by specialty")}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Find Doctors
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-full whitespace-nowrap transition-colors"
                    onClick={() => setInputValue("Book an appointment")}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-full whitespace-nowrap transition-colors"
                    onClick={() => setInputValue("Check symptoms")}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Symptoms
                  </button>
                </div>

                {/* Input Box */}
                <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-xl p-2 focus-within:border-[#5f6fff] focus-within:ring-1 focus-within:ring-[#5f6fff] transition-all">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Describe your symptoms or ask a medical question..."
                    className="flex-1 resize-none border-none outline-none bg-transparent px-2 py-2 max-h-24 min-h-[40px] text-sm text-gray-800 placeholder-gray-400"
                    rows="1"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || loading}
                    className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                      inputValue.trim() && !loading
                        ? "bg-[#5f6fff] text-white hover:bg-[#4f5fef] active:scale-95"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>

                {/* Helper Text */}
                <div className="flex items-center justify-between mt-2 px-1">
                  <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                    <svg
                      className="w-3 h-3 text-[#5f6fff]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Press Enter to send • Shift+Enter for new line
                  </p>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secure
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .h-full.overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .h-full.overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .h-full.overflow-y-auto::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 2px;
        }
        .h-full.overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 640px) {
          button {
            min-width: 36px;
            min-height: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default DocAI;
