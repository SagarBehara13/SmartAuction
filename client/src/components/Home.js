import React from 'react';


function Home (){
  return(
    <div className='container-fluid'>
      <div className='row header align-items-center justify-content-center'>
        <div className='.d-sm-none .d-md-block col-md-6 header-img'>
        </div>
        <div className='col-sm-12 offset-md-1 col-md-5'>
          <div className="col-12">
            <h4>Welcome,</h4>
            <h2>Smart Auction</h2>
            <h4>Utlizing blockchain for an secure and decentralized auction</h4>
            <br />
            <a href='/listing' className='start-bidding-button'>Start Bidding</a>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Home;
