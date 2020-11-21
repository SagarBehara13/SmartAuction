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
                                <div><a href="/place-bid">Host</a></div>
                                <div><a href="/place-bid">All Bids</a></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/*<Navbar color="black top-navbar" dark fixed expand="md">*/}
                {/*    <div className="container">*/}
                {/*    <NavbarToggler dark onClick={this.toggleNav} />*/}
                {/*    <NavbarBrand className="mr-auto" href="/home">*/}
                {/*        <span className="branding">DeDonate</span>*/}
                {/*    </NavbarBrand>*/}
                {/*    /!*<Collapse isOpen={this.state.isNavOpen} navbar className="">*!/*/}
                {/*    /!*    <div className="flex-grow-1"></div>*!/*/}
                {/*    /!*    <Nav className="align-items-end" navbar>*!/*/}
                {/*    /!*        <NavItem>*!/*/}
                {/*    /!*            <NavLink onClick={this.toggleNav} className="nav-link" to="/explore">*!/*/}
                {/*    /!*                /!*<i className="fa fa-child fa-lg"></i> *!/*!/*/}
                {/*    /!*                <div className="connect-btn"><MetaMaskLoginButton /></div>*!/*/}
                {/*    /!*                /!*<span className="main-btn">Explore</span>*!/*!/*/}
                {/*    /!*            </NavLink>*!/*/}
                {/*    /!*        </NavItem>*!/*/}
                {/*    /!*    </Nav>*!/*/}
                {/*    /!*</Collapse>*!/*/}
                {/*    </div>*/}
                {/*</Navbar>*/}
            </React.Fragment>
        )
    }
}

export default NavBar;
