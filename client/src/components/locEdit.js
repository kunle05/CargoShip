import { navigate } from '@reach/router';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Container } from 'reactstrap';
import style1 from './style1.module.css';

const EditLocation = props => {
    var store, num, addy, id = 0;
    var editMode = false;
    if(props.location.state) {
        store = props.location.state.name
        num = props.location.state.phone
        addy = props.location.state.address
        id = props.location.state._id
        editMode = store ? true : false;
    }
    const [name, changeStore] = useState(store || "")
    const [phone, changePhone] = useState(num || "")
    const [address, changeAddress] = useState(addy || "")
    const [error, setError] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        if(!name || !address) return setError("All fields are required");
        if(!editMode) {
            const resdata = await axios.post('http://localhost:8200/newLocation/', {name, phone, address}, {withCredentials: true});
            if(resdata) return navigate('/locations')
        }
        if(editMode) {
            const resdata = await axios.put(`http://localhost:8200/loc/${id}`, {name, phone, address}, {withCredentials: true});
            if(resdata) return navigate('/locations')
        }
    }

    return (
        <Container className={style1.login + " p-2 col-md-4 mt-4" }>
            <Container className="p-3 bg-light">
                { error && <div className={"text-center rounded p-1 mb-3 " + style1.error}>
                    <p className="font-weight-bold text-danger lead m-0">{ error }</p>
                </div> }
                <Form className="mt-3" onSubmit={ handleSubmit }>
                    <FormGroup row>
                        <Label for="name" sm={3} className="pr-0"><b>Name</b></Label>
                        <Col sm={9} className="pl-0">
                            <Input type="text" 
                                name="name"
                                autoComplete= 'false' 
                                value={name} 
                                onChange={ e => changeStore(e.target.value) } 
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="phone" sm={3} className="pr-0"><b>Phone</b></Label>
                        <Col sm={9} className="pl-0">
                            <Input type="text" 
                                name="phone"
                                autoComplete= 'false' 
                                value={phone} 
                                onChange={ e => changePhone(e.target.value) } 
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="address" sm={3} className="pr-0"><b>Address</b></Label>
                        <Col sm={9} className="pl-0">
                            <Input type="text" 
                                name="address"
                                autoComplete= 'false' 
                                value={address} 
                                onChange={ e => changeAddress(e.target.value) } 
                            />
                        </Col>
                    </FormGroup>
                    <p className="m-0 text-right"><Button color="primary mt-3">Submit</Button></p>
                </Form>
            </Container>
        </Container>
    )

}
export default EditLocation;