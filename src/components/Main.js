import React, { Component } from 'react';
import Web3 from 'web3';
import NavBar from "./navbar";
import Home from "./Home";
import Auction from '../abis/Auction.json'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import PlaceBid from "./PlaceABid";
import ProductRequest from "./addProduct"
import AllProducts from "./listing"
import AllBids from "./allBids"
import HaltAuction from "./haltAuction"
import FinishAuction from "./endAucion"


class Main extends Component{
    
    async componentWillMount(){
        await this.loadWeb3()
        //await this.loadBlockchainData()
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
            const productDetails = await auction.methods.productDetails(i).call()
            
            this.setState({
              products: [...this.state.products, product],
              productDetails: [...this.state.productDetails, productDetails]
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
          productDetails: [],
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
        <div>
            <NavBar/>
            <Switch>
                <Route path="/home" component={Home} />
                <Route
                    path="/host"
                    component={ProductRequest}
                />
                <Route
                    path="/listing"
                    component={AllProducts}
                />
                <Route
                    path="/allBids"
                    component={AllBids}
                />
                <Route
                    path="/haltAuction"
                    component={HaltAuction}
                />
                <Route
                    path="/finishAuction"
                    component={FinishAuction}
                />
                {/* <Route*/}
                {/*    path="/explore"*/}
                {/*    render={ props => (*/}
                {/*        <Explore requests={this.state.requests}*/}
                {/*                 fullFillRequest={this.fullFillRequest}*/}
                {/*                 charityRequests={this.state.charityRequests}*/}
                {/*        />)}*/}
                {/*/>*/}
                <Route
                    path="/PlaceBid"
                    component={PlaceBid}
                />
                {/*<Route*/}
                {/*    path="/approve"*/}
                {/*    component={Approve}*/}
                {/*/> */}
                <Redirect to="/home" />
            </Switch>
        </div>
        )
    }
}

export default withRouter(Main);
