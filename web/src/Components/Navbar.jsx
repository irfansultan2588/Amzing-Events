import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { GlobalContext } from '../Context';
import axios from "axios"
import { styled } from '@mui/material/styles';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';





///////navber/////////
const NavbarComponent = () => {

    let { state, dispatch } = useContext(GlobalContext);
    // let [toggleReload, setToggleReload] = useState(false);




    const logouthandler = async () => {

        try {
            let response = await axios.post(`${state.baseUrl}/logout`, {},

                {
                    withCredentials: true,


                })
            console.log("response", response.data);

            dispatch({ type: "USER_LOGOUT", })


        } catch (e) {
            console.log("Error in api", e);

        }

    }
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        position: 'absolute',

    }));

    // const createEvent = () => {
    //     setToggleReload(!toggleReload);
    // }

    return <>

        <Navbar bg="#fff" expand="lg" className="nav-2">

            <Container fluid id="container">
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">


                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >

                        {(state.isLogin === true) ?
                            < >
                                <div className="btn-container">
                                    <div>
                                        <h3 className="haeding-nav">Amazing Events</h3>
                                    </div>

                                    <div className="child2">
                                        <Nav.Link> <Link to="/Home"> <button className="navBtn"> Home</button></Link> </Nav.Link>
                                        <Nav.Link> <Link to="/CreateEvents"> <button className="navBtn">CreateEvents</button></Link> </Nav.Link>
                                        <Nav.Link> <Link to="/MyEvents"> <button className="navBtn23">My Events</button></Link> </Nav.Link>
                                        <Nav.Link> <Link to="/" onClick={logouthandler}><button className="navBtn">Logout</button></Link> </Nav.Link>
                                    </div>
                                </div>
                            </>
                            :
                            null
                        }

                        {(state.isLogin === false) ?

                            <>

                                <div className="btn-container-out">
                                    <div className="child">
                                        <h3 className="haeding-nav">Amazing Events</h3>
                                    </div>
                                    <div className="child3">
                                        <Nav.Link> <Link to="/"> <button className="navBtn"> Home</button></Link> </Nav.Link>
                                        <Nav.Link> <Link to="/login"> <button className="navBtn"> Login</button></Link> </Nav.Link>
                                        <Nav.Link>  <Link to="/signup"><button className="navBtn">Signup</button></Link> </Nav.Link>
                                    </div>
                                </div>

                            </>
                            :
                            null
                        }
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
}

export default NavbarComponent