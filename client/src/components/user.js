import React, { useState, useContext } from 'react';
import moment from 'moment-timezone';
import axios from 'axios';
import MyContext from '../context';
import { Table, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';

const User = props => {
    const context = useContext(MyContext);
    if(context.user) {
        var {fname, lname, username, status, updatedAt, level, _id} = context.user;
    }
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [dialog, setDialog] = useState(false);
    const [update, setUpdate] = useState("");

    const changePassword = async e => {
        e.preventDefault();
        setError("");
        if(oldPassword === "") setError("Current password is required");
        else if(newPassword === "") {
            setError("Enter new password");
            setConfirmPassword("");
        }
        else if(newPassword !== confirmPassword) {
            setError("Passwords do not match"); 
            setConfirmPassword("");
        }
        else if( !(/[0-9][a-zA-Z]*/.test(newPassword)) ) setError("Password must contain at least one digit");
        else {
            const data = await axios.post(`http://localhost:8200/user/update/${level}`, {oldPassword, newPassword, confirmPassword, id:_id}, {withCredentials: true})
            if(data.data.err) setError(data.data.err);
            else {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setDialog(!dialog);
                setUpdate("Update Successful");
                context.setUser(data.data)
                setTimeout(() => setUpdate(""), 6000);
            }
        }
    }

    if(fname) {
        return (
            <Container className="col-md-8 bg-light">
            <Container className="col-md-7 p-3 bg-light mt-4 mb-5 rounded"> 
            <p className="text-center"><img src="../images/person.png" alt="person" width="90px" height="90px" /></p>
            <p className="text-center font-weight-bold" style={{fontSize: "24px"}}>{fname} {lname}</p>
                <Container className="col-10">          
                <Table hover sm="true">
                    <tbody>
                        <tr>
                            <th scope="row">Username</th>
                            <td>{username}</td>
                        </tr>
                        <tr>
                            <th scope="row">Status</th>
                            { status===1 && <td className="text-success">Active</td>}
                        </tr>
                        <tr>
                            <th scope="row">User Level</th>
                            <td>{level}-{[level === 1 && "Associate", level === 3 && "Admin", level === 5 && "Super Admin"]}</td>
                        </tr>
                        <tr>
                            <th scope="row">Last Updated</th>
                            <td className="pr-0"><em>{moment(updatedAt).format("MMM DD, yyyy @ LT")}</em></td>
                        </tr>
                    </tbody>
                </Table >
                { update && <p className="text-center text-success font-weight-bold">{ update }</p> }
                </Container>
                { !dialog && <p className="text-center mt-4"><Button color="primary" onClick={() => setDialog(!dialog)}>Change Password</Button></p> }
                { dialog && <div className="mt-4 pt-5 border-top container col-10">
                    { error && <p className="mb-1 text-danger text-center font-weight-bold">{error}</p> }
                    <Form className="text-center" onSubmit={ changePassword }>
                        <FormGroup>
                            <Label for="currentpassword" hidden >Current Password</Label>
                            <Input type="password"
                                autoComplete='false'  
                                placeholder="Current Password"
                                value={oldPassword} 
                                onChange={ e => {setOldPassword(e.target.value)} } 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="newpassword" hidden>New Password</Label>
                            <Input type="password" 
                                autoComplete='false'   
                                placeholder="New Password"
                                value={newPassword} 
                                onChange={ e => {setNewPassword(e.target.value)} } 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmpassword" hidden>Confirm Password</Label>
                            <Input type="password"
                                autoComplete='false'    
                                placeholder="Confirm New Password"
                                value={confirmPassword} 
                                onChange={ e => {setConfirmPassword(e.target.value)} } 
                            />
                        </FormGroup>
                        <Button color="secondary" className="mr-4 mt-2 col-md-3" onClick={ e => {setDialog(!dialog); setError("")}}>Cancel</Button>
                        <Button type="submit" color="primary" className="col-md-3 mt-2" >Save</Button>
                    </Form>
                </div> }
            </Container>
            </Container>
        )
    }
    return <></>;
}

export default User;