import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function NewBlog() {
    const [data, setdata] = useState({ title: "", author: "",  content: "" });
    const [cookies] = useCookies(['jwtToken']);
    const navigate = useNavigate();

    const isAuthenticated = ()=>{
        const token = !!cookies.jwtToken;
        if(!token){
            navigate("/login");
        }
    }

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setdata({
            ...data, [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e);
        try {
            const response = await fetch("http://localhost:5000/api/blog/addBlog", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': cookies.jwtToken,
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                console.log(response);
                alert("Blog added.")
            }
            else{
                let error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
      isAuthenticated();
    }, [])
    

    return (
        <div className='row justify-content-center my-4'>
            <div className='col-5 border border-1 rounded p-4 shadow bg-body-tertiary rounded'>
                <form method='POST'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" value={data.title} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="author" className="form-label">Author</label>
                        <input type="author" className="form-control" id="author" name="author" value={data.author} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">Content</label>
                        <textarea className="form-control" id="content" rows="3" name='content' value={data.content} onChange={handleChange}></textarea>
                    </div>
                    <button type="submit" className="btn btn-success" onClick={handleSubmit}>Save</button>
                </form>
            </div>
        </div>
    )
}

export default NewBlog