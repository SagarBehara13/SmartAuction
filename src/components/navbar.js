import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import MetaMaskLoginButton from "react-metamask-login-button";
import logo from '../logo.png';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isNavOpen: false
    };
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav() {
    this.setState({
        isNavOpen: !this.state.isNavOpen
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className='navbar-custom'>
          <div className='container'>
              <div className='navbar-contain'>
                <div className='brand-menu'>
                    <div className='logo'><a href="/home"><img src={logo} className="logo-app" alt="logo" /></a></div>
                    <div className='app-name'><a href="/home">Smart Auction</a></div>
                </div>
                <div className='main-menu'>
                    <div><a href="/home">Home</a></div>
                    <div><a href="/host">Host auction</a></div>
                    <div><a href="/listing">Listings</a></div>
                    <div><a href="/allBids">All bids</a></div>
                    <div><a href="/placeBid">Place bid</a></div>
                    <div><a href="/haltAuction">Hault auction</a></div>
                    <div><a href="/finishAuction">Finish auction</a></div>
                </div>
              </div>
            </div>
          </div>
      </React.Fragment>
    )
  }
}

export default NavBar;
