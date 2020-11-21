import React from 'react';
import banner from '../images/banner.png'

function Home (){
    return(
        <div>
            <div>
                <img src={banner} className='banner'/>
            </div>
            <div className='welcome'>
                <div className='welcome-container'>
                    <p className='welcome-msg'>Welcome to Smart Auction</p>
                    <button className='start-bidding'>Start Bidding</button>
                </div>

            </div>
            <div className='container'>

            </div>
        </div>

    )
}

export default Home;
