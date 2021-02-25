import React, { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Row, Col, Container, InputGroupText } from 'reactstrap';
import style1 from './style1.module.css';
import { navigate, Link } from '@reach/router';
import { Cookies } from 'react-cookie';
import MyContext from '../context';

const initialState = {
    locations: [],
    suggestion: [],
    fname: "",
    lname: "",
    level: 1,
    username: "",
    location: "",
    password: "",
    error: ""
}
function reducer(state, action) {
    return {
        ...state,
        [action.type]: action.payload
    }
}

const Account = props => {
    // console.log(props.location.state);
    var stateToUse = initialState;
    const cookie = new Cookies();
    const reqlevel = cookie.get('lev_rdi');
    const context = useContext(MyContext);

    if(props.location.state && props.location.state.fname){
        // console.log("i keep get here");
        const { _id, fname, lname, level, username, location } = props.location.state;
        const editState = {
            locations: [],
            _id,
            fname,
            lname,
            level,
            username,
            location: location._id,
            password: "",
            error: "",
            editMode: true
        }
        stateToUse = editState;
    }

    const [state, dispatch] = useReducer(reducer, stateToUse);
    useEffect(() => {
        async function fetchData() {
            
            const Locations = await axios.get(`http://localhost:8200/locs/${reqlevel}`, {withCredentials: true});
            dispatch({
                type: "locations",
                payload: Locations.data
            })
        }
        fetchData();
    }, [reqlevel])

    const handleChange = e => {
        const {name, value} = e.target;
        dispatch({
            type: name,
            payload: value
        });
        if (!state.editMode && name === "lname" && state.fname ) {
            let pw = state.fname[0] + value;
            dispatch({
                type: "username",
                payload: pw.toLowerCase()
            })
            dispatch({
                type: "password",
                payload: "changeMe0nL0g1n" + value 
            })
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        for (let key in state) {
            if ( key !== "error" && state[key] === "" ) {
                if( key !== "password") {
                    if(key === "fname") key = "first name";
                    if(key === "lname") key = "last name";
                    dispatch({
                        type: "error",
                        payload: key + " is required"
                    });
                    return;
                }
            }
        }
        const {_id, fname, lname, username, password, location, level} = state;
        if(!state.editMode) {
            const newUser = await axios.post(`http://localhost:8200/user`, {fname, lname, username, location, level, password, confirmPassword: password}, {withCredentials: true});
            if(newUser.data.message) {
                let msg = newUser.data.message;
                dispatch({
                    type: "error",
                    payload: msg
                });
                if(msg === "Username is taken") nameSuggestion();
                return;
            }
            navigate('/users');
            return;
        } 
        await axios.put(`http://localhost:8200/user/${_id}`, {fname, lname, username, location, level, password}, {withCredentials: true})
        navigate('/users')
    }

    function nameSuggestion() {
        let list = [];
        const { fname: first, lname: last } = state;
        list.push( (first.substr(0,2)+last).toLowerCase(),  (first+last).toLowerCase(), (first[0]+last[0]+last).toLowerCase() );
        dispatch({
            type: "suggestion",
            payload: list
        });
    }

    if(context.user && context.user.level === 5 && state.locations.length >= 1) {
        return (
            <Container className={style1.login + " p-2 col-md-5 mt-4" }>
            <Container className="p-3 bg-light">
            { state.error && <div className={"text-center rounded p-1 mb-3 "+ style1.error}>
                <p className="font-weight-bold text-danger lead m-0">{ state.error }</p>
            </div> }
            <Form className="mt-3" onSubmit={ handleSubmit }>
                <Row form>
                    <Col md={6}>
                        <FormGroup row>
                            <Label for="firstName" sm={5} className="pr-0"><b>First Name</b></Label>
                            <Col sm={7} className="pl-0">
                                <Input type="text" 
                                    name="fname"
                                    autoComplete= 'false' 
                                    value={state.fname} 
                                    onChange={ handleChange } 
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup row>
                            <Label for="lastName" sm={4} className="pr-0"><b>Last Name</b></Label>
                            <Col sm={8}>
                                <Input type="text" 
                                    name="lname"
                                    autoComplete= 'false' 
                                    value={state.lname} 
                                    onChange={ handleChange } 
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup row>
                    <Label for="locSelect" sm={2}><b>Location</b></Label>
                    <Col sm={10}>
                        <Input type="select" 
                            name="location" 
                            value={state.location}
                            autoComplete= 'false' 
                            onChange={ handleChange }>
                            <option value="">Select a location</option>
                            { state.locations.filter(item => item.status === 1).map(item => {
                                return <option value={item._id} key={item._id}>{item.name}</option>
                            }) }
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="userlevel" className="pr-0"><b>User Level</b></Label>
                    <Col sm={10}>
                        <Input type="select" 
                            name="level" 
                            value={state.level} 
                            autoComplete= 'false' 
                            onChange={ handleChange }>
                            <option value="1">Associate</option>
                            <option value="3">Assitant Admin</option>
                            <option value="5">Administrator</option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="username"><b>Username</b></Label>
                    <Col sm={10}>
                        {[ state.editMode && 
                            <Input type="text"
                                key="01"
                                name="username"
                                autoComplete= 'false' 
                                value={state.username} 
                                onChange={ handleChange } 
                            />,
                        !state.editMode && 
                            <InputGroupText key="02" style={{height: "100%"}}> {state.username} </InputGroupText>
                        ]}
                    </Col>
                    { state.suggestion && <ul className="list-unstyled list-inline mb-1 ml-5 pl-5"> { state.suggestion.map((item, idx) => (
                        <li key={idx} type="button" className={`text-primary list-inline-item ml-4 ${style1.enlarge}`} 
                            onClick={ () => dispatch({
                                type: "username",
                                payload: item
                            })}>
                            {item} 
                        </li>
                    )) }</ul>}
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="password"><b>Password</b></Label>
                    <Col sm={10}>
                        {[ state.editMode && 
                            <span key="1"><Input type="password"
                                name="password"
                                autoComplete= 'false' 
                                value={state.password} 
                                onChange={ handleChange } 
                            />
                            <p style={{color: '#757575', marginBottom: '0px'}}>Leave blank to keep existing passowrd</p></span>,
                        !state.editMode && 
                            <InputGroupText key="2" style={{height: "100%"}}> {state.password} </InputGroupText>
                        ]}
                    </Col>
                </FormGroup>
                <Button type="submit" color="primary" className="col-md-3 mt-2 offset-9" >Submit</Button>
            </Form>
            </Container>
            </Container>
        )
    }
    else if(context.user && context.user.level !==5) {
        return (
            <Container className="pt-5">
                <Container className={"col-6 text-center mt-5 p-3 " + style1.login} >
                    <h4 className="text-danger m-3">You are not authorized to view this page</h4>
                    <Link to="/home" className="btn btn-lg btn-primary m-3">Home</Link>
                </Container>
            </Container>
        )
    }
    return <></>;
}

export default Account;