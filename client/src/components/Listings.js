import React, { Component } from 'react';
import Web3 from 'web3';
import { withRouter } from 'react-router-dom';
import { UncontrolledCollapse, Media, Badge, Button, Spinner,
  Card, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';

import * as _ from 'underscore'
import moment from 'moment'

import Auction from '../abis/Auction.json'


class Listings extends Component{

  constructor(props){
    super(props)
    this.state = {
      account : '',
      productCount: 0,
      products: [],
      bidsCount: 0,
      bids: [],
      loading: true
    }

    this.loadWeb3 = this.loadWeb3.bind(this)
    this.checkAuctionStatus = this.checkAuctionStatus.bind(this)
    this.convertWeiToEth = this.convertWeiToEth.bind(this)
    this.convertDate = this.convertDate.bind(this)
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

      for(let i = 1; i <= productCount; i++){
        const product = await auction.methods.products(i).call()
        const productDetail = await auction.methods.productDetails(i).call()

        this.setState({
          products: [...this.state.products, { ...product, ...productDetail }]
        })
      }

      const bidsCount = await auction.methods.bidsCount().call()

      this.setState({ bidsCount })

      for(var i = 1; i <= bidsCount; i++){
        const allBid = await auction.methods.allbids(i).call()

        this.setState({
          bids: [...this.state.bids, allBid]
        })
      }

      this.setState({ loading: false })

    } else {
      window.alert("Auction contract is not deployed to detected network")
    }
  }

  convertWeiToEth = weiAmount => {
    return Number(Number(Number(weiAmount) / 1000000000000000000).toFixed(4))
  }

  convertDate = date => moment(new Date(Date.parse(`${date}`)).toUTCString()).format('MMM Do YY')

  checkAuctionStatus = (startDate, endDate, sold) => {
    const currentDateTime = Date.now()

    if (sold) return 'Already sold'
    if (Date.parse(`${startDate}`) > currentDateTime) return 'Bidding not started'
    if (Date.parse(`${endDate}`) < currentDateTime) return 'Bidding ended'
    if (Date.parse(`${startDate}`) <= currentDateTime && currentDateTime <= Date.parse(`${endDate}`)) return 'Bidding ongoing'

    return 'Currently trending'
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row listings align-items-center justify-content-center">
          <h2 className="col-12">
            Auctions for all products
            &nbsp;
            <Badge className="badge" href="#" color="success">
              Total {this.state.bidsCount} bids !!
            </Badge>
          </h2>
          {
            this.state.loading ? (
              <Spinner className="spinner" />
            ) : (
              <div className="col-12 listings-list">
                {
                  _.sortBy(this.state.products.map((product, key) => {
                    return(
                      <>
                        <Media className='media justify-content-center align-items-center' key={product.id}>
                          <Media left className="media-img-container">
                            <Media
                              object
                              src={product.productImage}
                              alt="Product image"
                              className="media-img img-fluid"
                            />
                          </Media>
                          <Media body>
                            <Media heading>
                              { product.productName }
                              &nbsp;
                              <Badge className="badge" href="#" color="success">
                                {this.checkAuctionStatus(product.startDate, product.endDate, product.sold)}
                              </Badge>
                            </Media>
                            <br />
                            {product.description}
                          </Media>
                          <Media right>
                            <Button id={`toggler${product.id}`} className="start-bidding-button">View more</Button>
                          </Media>
                        </Media>
                        <UncontrolledCollapse className="product-collapser" toggler={`#toggler${product.id}`}>
                          <Card>
                            <CardBody>
                              <CardTitle tag="h5">
                                #{product.category}
                                &nbsp;
                                <Badge className="badge" href="#" color="success">
                                  {this.state.bids.filter(bid => bid.productId === product.id).length} bids
                                </Badge>
                              </CardTitle>
                              <CardSubtitle tag="h6" className="mb-2 text-muted">
                                {this.convertDate(product.startDate) } to {this.convertDate(product.endDate)}
                              </CardSubtitle>
                              <CardText>
                                Initial price: {this.convertWeiToEth(product.initialPrice)} MATIC
                                <br />
                                {!product.sold ? 'Current' : 'Sold'} price: {this.convertWeiToEth(product.currentPrice)} MATIC
                              </CardText>
                              {!product.sold ? <Button className="start-bidding-button" onClick={() => {
                                this.props.history.push({pathname: '/placeBid', state: {id: product.id }})
                              }}>Bid now</Button> : null}
                            </CardBody>
                          </Card>
                        </UncontrolledCollapse>
                      </>
                    )
                  }), product => Date.parse(`${product.endDate}`))
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}


export default withRouter(Listings);
