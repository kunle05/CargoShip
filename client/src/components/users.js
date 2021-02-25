import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { Container, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MyContext from '../context';
import { Link } from '@reach/router';
import style1 from './style1.module.css';
import { Cookies } from 'react-cookie';

const Users = props => {
    const [users, setUsers] = useState([]);
    const context = useContext(MyContext);
    const cookie = new Cookies();
    const level = cookie.get('lev_rdi');

    const [label, setLabel] = useState(0);
    const [username, setUsername] = useState(0);
    const [modal, setModal] = useState(false);
    const [userId, setUserId] = useState(0);

    async function getUsers() {
        const userList = await axios.get(`http://localhost:8200/all_users/${level}`, { withCredentials: true });
        setUsers(userList.data);
    }
    
    useEffect( () => {
        if(level >= 3) getUsers();
    })

    const showModal = (e, id, name) => {
        label ? setLabel(0) : setLabel(e.target.outerText);
        username ? setUsername(0) : setUsername(name);
        userId ? setUserId(0) : setUserId(id)
        setModal(!modal);
    }
    const action = () => {
        let stat = label === "Disable" ? 0 : 1
        axios.get(`http://localhost:8200/user/disable/${userId}/${stat}`, { withCredentials: true });
        getUsers();
        showModal();  
    }

    if(users.length >= 1 && context.user && context.user.level >= 3) {
        return (
            <div className="bg-light p-3" style={{minHeight: '100vh'}}>
            <Container>
                { context.user.level ===5 && <p className="text-right"><Link to="/user/new" className="btn btn-primary">+ New user</Link></p> }
                <Table striped hover>
                    <thead style={{borderBottom: '3px solid #002f60'}}>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Level</th>
                            <th>Start Date</th>
                            <th>Last Modified</th>
                        </tr>
                    </thead>
                    <tbody className="bg-light">
                        { users.map( user => {
                            if(user.username === context.user.username) var BgColor = 'font-weight-bold';
                            return (
                            <tr className={BgColor} key={user._id}>
                                <td>{[ context.user.level ===5 &&
                                    <Link to={"/user/" + user.username} state={user} className={style1.link} key={5} >{user.fname} {user.lname}</Link>,
                                    context.user.level !== 5 && <span key={3} >{user.fname} {user.lname}</span>
                                    ]}</td>
                                <td >{user.username}</td>
                                <td>{user.location.name}</td>
                                <td>{ [user.status === 1 && <span className="text-success" key="1">Active</span>, user.status === 0 && <span className="text-secondary" key="0">Disabled</span>] }</td>
                                <td>{user.level} - {[user.level === 1 && "Associate", user.level === 3 && "Admin", user.level === 5 && "Super Admin"]}</td>
                                <td>{moment(user.createdAt).format("MMM DD, yyyy")}</td>
                                <td>{moment(user.updatedAt).format("MMM DD, yyyy LT")}</td>
                                { (context.user.level === 5 && user.status === 1) && <td className="pt-2"><button onClick={ e => showModal(e, user._id, user.username) } className="btn btn-primary pt-0 pb-0 pr-2 pl-2">Disable</button> </td>}
                                { (context.user.level === 5 && user.status === 0) && <td className="pt-2"><button onClick={ e => showModal(e, user._id, user.username) } className="btn btn-danger pt-0 pb-0 pr-2 pl-2">Enable</button> </td>}
                            </tr> 
                        )}) }
                    </tbody>
                </Table>
                <div>
                    <Modal isOpen={modal} toggle={showModal} style={{top: '20%'}}>
                        <ModalHeader className="bg-light">{label} User</ModalHeader>
                        <ModalBody> Are you sure you want {label && label.toLowerCase()} the user, <b>{username}</b>? </ModalBody>
                        <ModalFooter className="bg-light">
                            <Button outline color="secondary" onClick={showModal}>CANCEL</Button>
                            <Button color="primary" className="ml-2" onClick={action}>{label && label.toUpperCase()}</Button>{' '}
                        </ModalFooter>
                    </Modal>
                </div>
            </Container>
            </div>
        )
    }
    else if(context.user && context.user.level < 3) {
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

export default Users;