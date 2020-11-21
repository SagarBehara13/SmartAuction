import React, { Component } from 'react';
import Web3 from 'web3';
import NavBar from "./navbar";
import Home from "./Home";
import Auction from '../abis/Auction.json'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';

class ProductRequest extends Component{
    
    async componentWillMount(){
        await this.loadWeb3()
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
          const auction = web3.eth.Contract(Auction.abi, networkData.address)
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
        this.createProduct = this.createProduct.bind(this)
    }

    createProduct(
        _initialSellPrice, 
        _productName, 
        _ownerName,  
        _initialOwnerContact, 
        _productImage, 
        _startDate, 
        _endDate, 
        _category, 
        _description,
        _shortDescription
    ) {
        this.setState({ loading: true })
        this.state.auction.methods.createProduct(
            _initialSellPrice, 
            _productName, 
            _ownerName,  
            _initialOwnerContact, 
            _productImage, 
            _startDate, 
            _endDate, 
            _category, 
            _description,
            _shortDescription
        ).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          this.setState({ loading: false })
        })
    }

    render() {
        return(
            <div className="container">
            <div className="" id="addProduct">
                <h2 className="form-head">Add Object for auctioning</h2>
                <Form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.requestName.value
                    const price = window.web3.utils.toWei(this.requestPrice.value.toString(), 'Ether') || 0
                    const category = this.requestCategory.value
                    const story = this.requestStory.value
                    const image = this.requestImage.value

                    //this.createRequest(name, price, category, story, image)
                }} className="main-form">
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Object Name</Label>
                    <Input type="text" id="productName" name="name"
                        innerRef={(input) => this.productName = input} placeholder="Enter the object name here"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Owner Name</Label>
                    <Input type="text" id="ownerName" name="name"
                        innerRef={(input) => this.ownerName = input} placeholder="Enter your name"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Contact Number</Label>
                    <Input type="text" id="contactNumber" name="name"
                        innerRef={(input) => this.contactNumber = input} placeholder="Enter your contact number"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Object Image</Label>
                    <Input type="text" id="objectImage" name="name"
                        innerRef={(input) => this.objectImage = input} placeholder="Insert Image"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Starting Period for Bids</Label>
                    <Input type="text" id="startDate" name="name"
                        innerRef={(input) => this.startDate = input} placeholder="Date form when the auction begins"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Ending Period for Bids</Label>
                    <Input type="text" id="endDate" name="name"
                        innerRef={(input) => this.productName = input} placeholder="Date when the auction halts"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Category</Label>
                    <Input type="text" id="category" name="name"
                        innerRef={(input) => this.category = input} placeholder="Enter the object related to sports, antique, real-estate"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Description</Label>
                    <Input type="text" id="description" name="name"
                        innerRef={(input) => this.description = input} placeholder="Enter the some info related to object"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="name" className="form-label">Short Description</Label>
                    <Input type="text" id="shortDescription" name="name"
                        innerRef={(input) => this.shortDescription = input} placeholder="Enter some catchy pharse related to object"
                    />
                </FormGroup>
                <Button className="form-btn" type="submit" value="submit" color="primary">Submit</Button>
                </Form>
            </div>
            </div>
        )
    }
}

export default withRouter(ProductRequest);
