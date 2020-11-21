import React, { Component } from 'react';
import Web3 from 'web3';
import NavBar from "./navbar";
import Home from "./Home";
import Auction from '../abis/Auction.json'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

class PlaceBid extends Component{
    
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
        this.createBid = this.createBid.bind(this)
    }

    createBid( _productId, _amount, _name, _contact ){
        this.state.auction.methods.bid(_productId, _amount, _name, _contact)
        .send({ from: this.state.account })
        .once('receipt', (receipt) => {
        this.setState({ loading: false })
        })
    }

    render() {
        return(
            <div className="container">
            <div className="" id="addProduct">
                <h2 className="form-head">Place Bids</h2>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    const productId = this.productId.value
                    const bid = window.web3.utils.toWei(this.bid.value.toString(), 'Ether') || 0
                    const name = this.name.value
                    const contactNumber = this.contactNumber.value

                    console.log(productId, bid, name, contactNumber);
                
                    this.createBid(productId, bid, name, contactNumber)
                }} className="main-form">
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Product Id</Label>
                    <Input type="text" id="productId" name="name"
                        innerRef={(input) => this.productId = input} placeholder="Enter the object id"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Bid</Label>
                    <Input type="text" id="bid" name="name"
                        innerRef={(input) => this.bid = input} placeholder="Enter your Bid here"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Name</Label>
                    <Input type="text" id="name" name="name"
                        innerRef={(input) => this.name = input} placeholder="Enter your name"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Contact Number</Label>
                    <Input type="text" id="contactNumber" name="name"
                        innerRef={(input) => this.contactNumber = input} placeholder="Enter your contact number"
                    />
                </FormGroup>
                <Button className="form-btn" type="submit" value="submit" color="primary">Submit</Button>
                </Form>
            </div>
            </div>
        )
    }
}

export default withRouter(PlaceBid);
