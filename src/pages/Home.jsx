import React from 'react'
import Header from '../components/Header'
import SpecialilityMenu from '../components/SpecialilityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <SpecialilityMenu/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home