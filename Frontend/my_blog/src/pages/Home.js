import React, { useState, useEffect } from 'react'
import BlogCard from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Home() {
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState({search : ""});
    const [cookies, setCookie] = useCookies(['jwtToken']);

    const host = "http://localhost:5000";

    const navigate = useNavigate();

    const isAuthenticated = () => {
        const token = !!cookies.jwtToken;
        if (!token) {
            navigate("/login");
        }
    }

    const handleChange = (event)=>{
        let name = event.target.name;
        let value = event.target.value;

        setSearchValue({...searchValue, [name]:value});
    }

    const getBlogs = async () => {
        const response = await fetch(`${host}/api/blog/getBlogs?search=${searchValue.search}`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'auth-token': cookies.jwtToken,
            }
        });

        if (response.ok) {
            const data = await response.json();
            setData(data);
        }

    }

    useEffect(() => {
        isAuthenticated();
        getBlogs();
    }, [searchValue])


    return (
        <>
            <div className='container my-5'>
                <div className='row'>
                    <div className='col-3'>
                        <h5>Serach for your blog with blog title</h5>
                    </div>
                    <div className='col-5'>
                        <div className='d-flex'>
                            <input className="form-control me-2 col-3" type="search" placeholder="Search" aria-label="Search" name="search" value={searchValue.search} onChange={handleChange}/>
                        </div>
                    </div>
                </div>
                <hr />
                {data.length === 0 && <h1>No blogs added yet.</h1>}
                <div className='row'>
                    {
                        data.map((ele) => {
                            return (<BlogCard key={ele._id} blog={ele} />)
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Home