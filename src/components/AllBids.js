import Web3 from 'web3';
import React, { Component } from 'react';
import { Table, Spinner } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import Auction from '../abis/Auction.json'


class AllBids extends Component{

  constructor(props){
    super(props)
    this.state = {
      account : '',
      bidsCount: 0,
      bids: [],
      loading: true
    }

    this.loadWeb3 = this.loadWeb3.bind(this)
  }

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Auction.networks[networkId]

    if(networkData){
      const auction = new web3.eth.Contract(Auction.abi, networkData.address)
      this.setState({ auction })

      const bidsCount = await auction.methods.bidsCount().call()

      this.setState({ bidsCount })

      for(var i = 1; i <= bidsCount; i++){
        const allBid = await auction.methods.allbids(i).call()
        console.log('allbids', allBid);
        this.setState({
          bids: [...this.state.bids, allBid]
        })
      }

      this.setState({ loading: false })

    } else {
      window.alert("Auction contract is not deployed to detected network")
    }
  }

  render() {
    return(
      <div className="container-fluid">
        <div className="row view-bids align-items-center justify-content-center">
          <h2 className="col-12">All Bids</h2>
          {
            this.state.loading ? (
              <Spinner className="spinner" />
            ) : (
              <div className="col-12 view-bids-container">
                <Table striped bordered responsive hover>
                  <thead>
                    <tr>
                      <th>Product id</th>
                      <th>Bid id</th>
                      <th>Seller address</th>
                      <th>Bidder address</th>
                      <th>Bid amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.bids.map(bid => {
                        return (
                          <tr key={bid.bidId}>
                            <td>{bid.productId}</td>
                            <td>{bid.bidId}</td>
                            <td>{bid.sellerAddress}</td>
                            <td>{bid.bidderAddress}</td>
                            <td>{ window.web3.utils.fromWei(bid.amount.toString(), 'Ether') }</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}


export default withRouter(AllBids);
