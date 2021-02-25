import React, { useEffect, useState, useContext } from 'react';
import { Cookies } from 'react-cookie';
import { Link } from '@reach/router';
import axios from 'axios';
import { Container, Row, Col, Card, CardText, CardBody, CardTitle, Button, CardImg, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MyContext from '../context';

const Locations = props => {
    const [locs, setLoc] = useState(0);
    const context = useContext(MyContext);
    const cookie = new Cookies();
    const reqlevel = cookie.get('lev_rdi');

    const [label, setLabel] = useState(0);
    const [storename, setStoreName] = useState(0);
    const [modal, setModal] = useState(false);
    const [storeId, setStoreId] = useState(0);

    async function getloc() {
        const locations = await axios.get(`http://localhost:8200/locs/${reqlevel}`, {withCredentials: true});
        if(locations.data) setLoc(locations.data)
    }

    const showModal = (e, id, name) => {
        label ? setLabel(0) : setLabel(e.target.outerText);
        storename ? setStoreName(0) : setStoreName(name);
        storeId ? setStoreId(0) : setStoreId(id)
        setModal(!modal);
    }
    const action = () => {
        let stat = label === "LOCK" ? 0 : 1
        axios.get(`http://localhost:8200/loc/disable/${storeId}/${stat}`, { withCredentials: true });
        getloc();
        showModal();  
    }

    // useCallback( ()=> getloc(), [])

    useEffect(() => {
        async function getloc() {
            const locations = await axios.get(`http://localhost:8200/locs/${reqlevel}`, {withCredentials: true});
            if(locations.data) setLoc(locations.data)
        }
        getloc();
    }, [reqlevel])

    if(context.user && locs && context.user.level >= 3) {
        return (
            <Container className="p-3">
                { context.user.level === 5 && <p className="m=0 text-right"><Link to="/location/new" className="btn btn-primary">New Location</Link></p> }
            <Row>
                { locs.length > 0 && locs.map((item, idx) => (
                    <Col md="3" key={item._id} className="mt-3">
                        <Card>
                            <CardImg top width="100%" height="170" src='./images/home.png' alt={item.name} />
                            <CardBody>
                                { context.user.level === 5 && <CardTitle tag="h5" type="button"><Link to="/location/edit" state={item} className="text-primary"> {item.name} </Link></CardTitle> }
                                { context.user.level !== 5 && <CardTitle tag="h5" className="text-primary">{item.name}</CardTitle> }
                                <CardSubtitle tag="h6" className="mb-2 text-muted">{item.phone}</CardSubtitle>
                                <CardText>{item.address}</CardText>
                                { context.user.level === 5 && item.status === 1 && <Button onClick={e => showModal(e, item._id, item.name)} color="primary offset-4 mt-3">LOCK</Button> }
                                { context.user.level === 5 && item.status === 0 && <Button onClick={e => showModal(e, item._id, item.name)} color="danger offset-4 mt-3">UNLOCK</Button> }
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div>
                <Modal isOpen={modal} toggle={showModal} style={{top: '20%'}}>
                    <ModalHeader className="bg-light">{label} STORE</ModalHeader>
                    <ModalBody> Are you sure you want {label && label.toLowerCase()} the store, <b>{storename}</b>? </ModalBody>
                    <ModalFooter className="bg-light">
                        <Button outline color="secondary" onClick={showModal}>CANCEL</Button>
                        <Button color="primary" className="ml-2" onClick={action}>{label && label.toUpperCase()}</Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
            </Container>
        )
    }
    else if(context.user && locs && context.user.level < 3) {
        return (
            <Container>
            <Row>
                { locs.filter(item => item.status === 1).map(item => (
                    <Col md="3" key={item._id} className="mt-3">
                        <Card>
                            <CardImg top width="100%" height="170" src='./images/home.png' alt={item.name} />
                            <CardBody>
                                <CardTitle tag="h5" className="text-primary">{item.name}</CardTitle> 
                                <CardSubtitle tag="h6" className="mb-2 text-muted">{item.phone}</CardSubtitle>
                                <CardText>{item.address}</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
            </Container>
        )
    }
    return <></>;
}
export default Locations;

