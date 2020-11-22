import React, { Component } from 'react';
import Web3 from 'web3';
import NavBar from "./navbar";
import Home from "./Home";
import Auction from '../abis/Auction.json'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardImg, CardSubtitle, CardText, Row, Col, CardBody, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

class AllProducts extends Component{

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

          const productCount = await auction.methods.productsCount().call()

          this.setState({ productCount })

          for(var i = 1; i <= productCount; i++){
            const product = await auction.methods.products(i).call()
            console.log('products', product);
            this.setState({
              products: [...this.state.products, product]
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
          productCount: 0,
          products: [],
          loading: true
        }

        this.loadWeb3 = this.loadWeb3.bind(this)
    }

    render() {
        return(
            <div className="container">
                <h2>All Products</h2>
                <div className="row tabs-main-container">
                    {
                    this.state.products.map((request, key) => {
                        console.log('listing',request);
                        let donator

                        // if(request.owner === request.donator){
                        // donator = "No Donator"
                        // } else {
                        // donator = request.donator
                        // }
                        return(
                        <Col sm="12" md="6">
                            <div className="custom-card">
                            <div className="header-card">
                                <img width="130px" height="130px" src={ request.id === '1' ? 'https://images-na.ssl-images-amazon.com/images/I/31Yyz9t8GBL.jpg' : request.productImage } alt="Card cap" className="card-image"/>
                                <div className="header-card-content">
                                <p className="name">Product id: {request.id}</p>
                                <p className="name">Name: { request.id === '1' ? 'Cricket bat' : request.productName }</p>
                                <p className="price">Current Bid Price: { window.web3.utils.fromWei(request.currentPrice.toString(), 'Ether') } Matic</p>

                                    {
                                    !request.sold
                                    ? <Button
                                        color="info"
                                        className="donate-btn"
                                        id={request.id}
                                        value={request.currentPrice}
                                        onClick={(event) => {
                                            this.props.history.push({ pathname: "/placeBid",state: { id : request.id }})
                                        }}
                                        >
                                    Bid</Button>
                                    : null
                                    }
                                </div>
                            </div>
                                {/* <div className="body-card">
                                <CardText>Description: { request.shortDescription }</CardText>
                                </div> */}
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

export default withRouter(AllProducts);
