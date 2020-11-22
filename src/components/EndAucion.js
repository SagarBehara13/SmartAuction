import Web3 from 'web3';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Spinner, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import Auction from '../abis/Auction.json'


class EndAuction extends Component{

  constructor(props){
    super(props)
    this.state = {
      account : '',
      productCount: 0,
      products: [],
      loading: true
    }

    this.loadWeb3 = this.loadWeb3.bind(this)
    this.finishAuction = this.finishAuction.bind(this)
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

  finishAuction( _productId){
    this.state.auction.methods.finishAuction(_productId)
    .send({ from: this.state.account })
    .once('receipt', (receipt) => {
    this.setState({ loading: false })
    })
  }

  render() {
    return(
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center close-auction" id="addProduct">
            <h2 className="col-12">Transfer funds to claim your prize</h2>
            {
            this.state.loading ? (
              <Spinner className="spinner" />
            ) : (
              <div className="col-12 hault-auction-container table-bordered">
              <Form onSubmit={(event) => {
                  event.preventDefault()
                  const productId = this.productId.value
                  this.finishAuction(productId)
              }} className="main-form">
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Product Id</Label>
                    <Input type="text" id="productId" name="name"
                        innerRef={(input) => this.productId = input} placeholder="Enter the object id"
                    />
                </FormGroup>
                <br />
                <Button className="close-auction-button" type="submit" value="submit" color="primary">Claim prize</Button>
              </Form>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}


export default withRouter(EndAuction);
