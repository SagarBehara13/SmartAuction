import React, { Component } from 'react';
import Web3 from 'web3';
import NavigationBar from "./NavigationBar";
import Home from "./Home";
import Auction from '../abis/Auction.json'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardImg, CardSubtitle, CardText, Row, Col, CardBody, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

class AllBids extends Component{

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

    render() {
        return(
            <div className="container">
                <h2>All Bids</h2>
                <div className="row tabs-main-container">
                    {
                    this.state.bids.map((request, key) => {
                        console.log('listing',request);
                        return(
                        <Col sm="12" md="6">
                            <div className="custom-card">
                                <div className="header-card-content">
                                <p className="name">Product Id: { request.productId }</p>
                                <p className="name">Bid Id: { request.bidId }</p>
                                <p className="price">amount: { window.web3.utils.fromWei(request.amount.toString(), 'Ether') } Matic</p>
                                <p className="price">auctioner Address: { request.sellerAddress }</p>
                                <p className="price">bidder Address: { request.bidderAddress } </p>
                                </div>
                            </div>
                            </Col>
                        )
                    })
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(AllBids);
