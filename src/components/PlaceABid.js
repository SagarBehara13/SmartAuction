import React, { Component } from "react";
import { TabContent, Button, Form, FormGroup, Label, Input, FormText, Nav, NavItem, NavLink, TabPane } from 'reactstrap';

class PlaceABid extends Component{
    render() {
        return(
            <div className='container'>
                <div>
                    <Form onSubmit={ async (event) => {
                        event.preventDefault()
                        // const image = this.requestPTPImage.value
                    }} className="main-form">
                        <FormGroup>
                            <Label htmlFor="name" className="form-label">Full Name</Label>
                            <Input type="text" id="requestDName" name="requestDName"
                                   innerRef={(input) => {
                                       this.requestDName = input;
                                   }} placeholder="Enter your name here"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="criteria" className="form-label">Criteria</Label>
                            <Input type="select" name="criteria" id="requestCategory"
                                   innerRef={(input) => {
                                       this.requestCategory = input;
                                   }}>
                                <option>Education</option>
                                <option>Sports</option>
                                <option>Others</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="story" className="form-label">Tell us about yourself</Label>
                            <Input type="textarea" rows={3} columns={50} name="story" id="requestStory"
                                   innerRef={(input) => this.requestStory = input} placeholder="Describe in short why you need this" maxLength={200}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="story" className="form-label">Donation Amount</Label>
                            <Input type="text" rows={3} columns={50} name="story" id="requestPrice"
                                   innerRef={(input) => this.requestPrice = input} placeholder="amount"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="exampleFile" className="form-label">Image Url</Label>
                            <Input type="text" name="photo" id="requestPTPImage" innerRef={(input) => this.requestPTPImage = input} placeholder="image"/>
                            <FormText color="muted">
                                Upload your image posted on any social media
                            </FormText>
                        </FormGroup>
                        <Button className="form-btn" type="submit" value="submit" color="primary">Submit</Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default PlaceABid
