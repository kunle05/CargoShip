import React, { useEffect, useState } from 'react';
import { Link, navigate, Router } from '@reach/router';
import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie';
import Cookies from 'universal-cookie';
import MyContext from './context';
import axios from 'axios';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, Container } from 'reactstrap';
import styles from './indexStyle.module.css';
import Home from './components/home';
import Login from './components/login';
import User from './components/user';
import NewAccount from './components/account'
import Users from './components/users';
import Locations from './components/locations';
import Logout from './components/logout'; 
import EditLocation from './components/locEdit';

const globalCookie = new Cookies();

const App = props => {
    const logState = globalCookie.get('_usl_sign');
    const [cookie, setCookie] = useCookies(0)
    const [lookie, setLookie] = useCookies(0)
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const toggle = () => setIsOpen(!isOpen);

    const addUser = user => {
        setCookie('_uurid', user._id, {path: '/'});
        setLookie('lev_rdi', user.level, {path: '/'});
        setUser(user);
    }

    useEffect( () => {
        if(!logState) {
            navigate('/login');
        }
        else {
            if(window.location.pathname === "/"){
                navigate('/home');
            }
            if(!user && lookie && cookie) {
                axios.get(`http://localhost:8200/user/${cookie._uurid}/${lookie.lev_rdi}`, {withCredentials: true})
                .then(thisUser => setUser(thisUser.data));
            }
        }
    })

    if(!logState) {
        return (
            <CookiesProvider>
                <MyContext.Provider value={{addUser}}>
                <div className={ styles.navbar }>
                    <Container>
                    <Navbar expand="md">
                        <span className={"navbar-brand " + styles.navLinks}>DTwinz Cargo</span>
                    </Navbar>
                    </Container>
                </div>
                <Login path="/login" />
                </MyContext.Provider>
            </CookiesProvider>
        )
    }
    return (
        <CookiesProvider>
            <MyContext.Provider value={{user, setUser, addUser}}>
            <div className={ styles.navbar }>
                <Container>
                <Navbar expand="md">
                    <Link to = "/home"  className={"navbar-brand pr-3 pl-3 " + styles.navLinks}>DTwinz Cargo</Link>
                    { user && <> <NavbarToggler className={styles.navLinks} onClick={toggle}>
                        <span>MENU</span>
                    </NavbarToggler>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Link to = "/home" className={`nav-link pr-3 pl-3 ${styles.navLinks} ${styles.navItems}`}>New Shipment</Link>
                            </NavItem>
                        </Nav>
                        <Nav>
                        <UncontrolledDropdown nav inNavbar >
                            <DropdownToggle nav caret className={`${styles.navLinks} ${styles.navItems} p-0 pt-2 pb-2 pr-4 pl-4`}>
                                <img src="../images/person.png" alt="person" width="28px" height="28px" />
                                <span className="ml-2"> { user.fname } { user.lname } </span>
                            </DropdownToggle> 
                            
                            <DropdownMenu right  >
                                <Link to = "/user/me" className="dropdown-item">My Account </Link>
                                <Link to = "/logout" className="dropdown-item">Logout </Link>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        </Nav> 
                    </Collapse> </>}
                </Navbar>
                </Container>
            </div>

            <Router>
                <Login path="/login" />
                <Home path="/home" />
                <User path="/user/me" />
                <Users path="/users" />
                <NewAccount path="/user/:username" />
                <Locations path="/locations" />
                <EditLocation path="/location/:edit" />
                <Logout path="/logout" />
            </Router>
            </MyContext.Provider>
        </CookiesProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));