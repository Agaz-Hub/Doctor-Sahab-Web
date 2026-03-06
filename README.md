# Doctor Sahab - Frontend

A modern React-based frontend application for the Doctor Sahab healthcare platform, built with Vite for optimal performance and developer experience.

## Overview

Doctor Sahab is a comprehensive healthcare management system that connects patients with healthcare providers. This frontend application provides an intuitive interface for appointment booking, patient management, and healthcare services.

## Tech Stack

- **React** - UI library for building interactive user interfaces
- **Vite** - Next-generation frontend build tool for fast development
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **CSS/Tailwind** - Styling (adjust based on your actual setup)

## Features

- User authentication (Patient/Doctor/Admin)
- Appointment booking and management
- Doctor profile and availability management
- Patient dashboard
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd "Doctor Sahab/Code/frontend"
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── context/        # React context providers
│   ├── utils/          # Utility functions
│   ├── assets/         # Images, icons, etc.
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── public/             # Static assets
└── index.html          # HTML template
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
