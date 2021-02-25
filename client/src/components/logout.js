import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { navigate } from '@reach/router';
import MyContext from '../context';

const Logout = props => {
    const context = useContext(MyContext);

    useEffect(() => {
        context.setUser(null);
        console.log("logging out");
        const cookie = new Cookies();
        cookie.remove('_uurid');
        cookie.remove('lev_rdi');
        const res = axios.get('http://localhost:8200/logout', {withCredentials: true})
        res && navigate('/login') 
    })

    return <></>
}
export default Logout