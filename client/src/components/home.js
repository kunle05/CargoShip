import React, { useContext } from 'react';
import { Link } from '@reach/router';
import MyContext from '../context';

const Home = props => {
    // const { user } = props.data;
    const context = useContext(MyContext);

    if(context.user) {
        // console.log(context);
        return (
            <div>
                <p>We are logged in!</p>
                <p>{context.user.fname}</p>
                {/* <p><Link to="/user/:username">Create new account</Link></p> */}
                <p><Link to="/users">Users</Link></p>
                <p><Link to="/locations">Locations</Link></p>
                <Link to = "/login">Login</Link>
            </div>
        )
    }

    return <> </>;
}

export default Home;