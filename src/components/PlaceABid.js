import Web3 from 'web3';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Spinner, Button, Form, FormGroup, Label, Input  } from 'reactstrap';

import Auction from '../abis/Auction.json'


class PlaceBid extends Component{

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

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()

    this.props.location.state && this.props.location.state.id ? this.setState({id: this.props.location.state.id}) : console.log()
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

  createBid( _productId, _amount, _name, _contact ){
    this.state.auction.methods.bid(_productId, _amount, _name, _contact)
    .send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return(
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center place-bid" id="addProduct">
            <h2 className="col-12">Place bid on you product</h2>
            {
            this.state.loading ? (
              <Spinner className="spinner" />
            ) : (
              <div className="col-12 place-bid-container table-bordered">
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    const productId = this.productId.value
                    const bid = window.web3.utils.toWei(this.bid.value.toString(), 'Ether') || 0
                    const name = this.name.value
                    const contactNumber = this.contactNumber.value

                    this.createBid(productId, bid, name, contactNumber)
                }} className="main-form">
                  <FormGroup>
                      <Label htmlFor="name" className="form-label">Product Id</Label>
                      <Input type="text" id="productId" name="name"
                          value = {this.state.id}
                          disabled={this.props.location.state && this.props.location.state.id ? true : false}
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
                  <br />
                  <Button className="place-bid-button" type="submit" value="submit">Bid now! </Button>
                </Form>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}


export default withRouter(PlaceBid);
