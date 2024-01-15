import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';


function Navbar() {

    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken']);
    const [isLoggedIn, setLoggedIn] = useState(!!cookies.jwtToken);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie('jwtToken');
        navigate("/login");
    }

    useEffect(() => {
        setLoggedIn(!!cookies.jwtToken);
    }, [cookies.jwtToken]);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/">My-Blog</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/addBlog">Add Blog</NavLink>
                            </li>

                            <li className="nav-item">
                                {isLoggedIn ? <button onClick={handleLogout} className='nav-link'> Logout </button> :
                                    <NavLink className="nav-link" to="/login">Login</NavLink>}
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar