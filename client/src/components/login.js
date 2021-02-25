import React, { useEffect, useState, useContext } from 'react';
import { navigate } from '@reach/router';
import axios from 'axios';
import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import MyContext from '../context';
import style1 from './style1.module.css';

const Login = props => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const context = useContext(MyContext);

    useEffect( () => {
        if(context.user) {
            navigate('/home');
        }
    })

    const validateForm = async e => {
        e.preventDefault();
        if(username === ""){
            setError("Username is required")
        }        
        else if(password === ""){
            setError("Password is required")
        }
        else {
            const user = await axios.post('http://localhost:8200/auth/login', {username, password}, {withCredentials: true})
            if(user && !user.data.err){
                setError("");
                setUsername("");
                setPassword("");
                context.addUser(user.data);
            } else {
                setError(user.data.err);
                setPassword("");
            }
        }        
    }

    if(context.user){
        return <></>
    }
    return (
        <Container className={"col-md-8 col-lg-5 p-4 mt-5 "+ style1.login +" "+ style1.rounded}>
            <div className={style1.rounded + " bg-white p-4"}>
                <h4 className="lead mb-3">Sign In to Admin Panel</h4>
                { error && <div className={"text-center rounded p-1 mb-3 " + style1.error}>
                    <p className="font-weight-bold text-danger lead m-0">{ error }</p>
                </div> }
                <Form onSubmit={ validateForm }>
                    <FormGroup>
                        <Label for="username" className="mb-0 font-weight-bold">Username</Label>
                        <Input type="text"
                            autoComplete='false'  
                            value={username} 
                            onChange={ e => {setUsername(e.target.value)} } 
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password" className="mb-0 font-weight-bold">Password</Label>
                        <Input type="password" 
                            autoComplete='false'  
                            value={password} 
                            onChange={ e => {setPassword(e.target.value)} }
                        />
                    </FormGroup>
                    <Button color="primary">Sign In</Button>
                </Form>
                <p className="text-danger text-right mt-3 border-top mb-0 p-1">I forgot my password</p>
            </div>
        </Container>
    )
}
export default Login;