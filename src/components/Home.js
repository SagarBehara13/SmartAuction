import React from 'react';
import banner from '../images/banner.png'

function Home (){
  return(
    <div className='home-container'>
      <div className="home-image-container">
        <img src={banner} className='banner'/>
      </div>
      <div className='welcome'>
        <div className='welcome-container'>
            <p className='welcome-msg'>Welcome to Smart Auction</p>
            <a href='/listing' className='start-bidding'>Start Bidding</a>
        </div>
      </div>
    </div>
  )
}

export default Home;
