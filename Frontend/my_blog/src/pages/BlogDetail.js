import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function BlogDetail() {
    const [data, setdata] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const host = "http://localhost:5000";
    const [cookies] = useCookies(['jwtToken']);

    const isAuthenticated = ()=>{
        const token = !!cookies.jwtToken;
        if(!token){
            navigate("/login");
        }
    }

    const getBlog = async () => {
        const token = cookies.jwtToken;
        const id = location.state.id;
        const response = await fetch(`${host}/api/blog/getBlog/${id}`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'auth-token' : token
            }
        });

        if (response.ok) {
            const data = await response.json();
            setdata(data);
        }

    }
    useEffect(() => {
        isAuthenticated();
        getBlog();
    }, []);

    const editBlog = (id)=>{
        navigate(`/editBlog`, {
            state : {
                id 
            }
        });
    }

    const deleteBlog = async (id)=>{
        try {
        const authToken = cookies.jwtToken;

            const response = await fetch(`http://localhost:5000/api/blog/deleteBlog/${id}`, {
                method : "DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "auth-token" : authToken
                }
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/");
            }
            else(
                alert(data.message)
            )

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container border border-2 shadow p-3 my-5 bg-body-tertiary rounded'>
            <div className='container my-3'>
                <h3>{data.title}</h3>
                <div className='d-flex justify-content-between'>
                    <h5>{data.author}</h5>
                    <h5>{data.date}</h5>
                </div>
                <hr/>
                <p>{data.content}</p>
            </div>
            <div className='d-flex'>
            <button type="button" onClick={()=> editBlog(data._id)} disabled = {cookies.userId !== data.authorId} className="btn btn-warning">Edit</button>
            <button type="button" onClick={()=> deleteBlog(data._id)} disabled = {cookies.userId !== data.authorId} className="btn btn-danger mx-2">Delete</button>
            <button type="button" onClick={()=> navigate("/")} className="btn btn-info">Back</button>
            </div>
            
        </div>
    )
}

export default BlogDetail