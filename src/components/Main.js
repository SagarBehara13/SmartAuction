import React, { Component } from 'react';
import NavBar from "./navbar";
import Home from "./Home";
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

class Main extends Component{
    render() {
        return(
        <div>
            <NavBar/>
            <Switch>
                <Route path="/home" component={Home} />
                {/*<Route*/}
                {/*    path="/explore"*/}
                {/*    render={ props => (*/}
                {/*        <Explore requests={this.state.requests}*/}
                {/*                 fullFillRequest={this.fullFillRequest}*/}
                {/*                 charityRequests={this.state.charityRequests}*/}
                {/*        />)}*/}
                {/*/>*/}
                {/*<Route*/}
                {/*    path="/request"*/}
                {/*    component={Request}*/}
                {/*/>*/}
                {/*<Route*/}
                {/*    path="/approve"*/}
                {/*    component={Approve}*/}
                {/*/>*/}
                <Redirect to="/home" />
            </Switch>
        </div>
        )
    }
}

export default withRouter(Main);
