import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import MetaMaskLoginButton from "react-metamask-login-button";

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
                <Navbar color="black top-navbar" dark fixed expand="md">
                    <div className="container">
                    <NavbarToggler dark onClick={this.toggleNav} />
                    <NavbarBrand className="mr-auto nav-brand" href="/home">
                        <span className="branding">DeDonate</span>
                    </NavbarBrand>
                    <Collapse isOpen={this.state.isNavOpen} navbar className="">
                        <div className="flex-grow-1"></div>
                        <Nav className="align-items-end" navbar>
                            <NavItem>
                                <NavLink onClick={this.toggleNav} className="nav-link" to="/explore">
                                    {/*<i className="fa fa-child fa-lg"></i> */}
                                    <div className="connect-btn"><MetaMaskLoginButton /></div>
                                    {/*<span className="main-btn">Explore</span>*/}
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    </div>
                </Navbar>
            </React.Fragment>
        )
    }
}

export default NavBar;
