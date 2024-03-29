import React from 'react'
import { useNavigate } from "react-router-dom";

function BlogCard(props) {
    const { blog, deleteBlog } = props
    const navigate = useNavigate();

    const blogDetail =(id)=>{
        navigate(`/blogDetail`, {
            state : {
                id
            }
        });
    };

    return (
        <>
            <div className='col-lg-3 col-sm-3 col-1 m-3'>
                <div className="card shadow p-3 mb-5 mx-2 bg-body-tertiary rounded" style={{ width: "19rem" }}>
                    <div className="card-body">
                        <h4 className="card-title">{blog.title ? blog.content.slice(0, 30) : blog.title}...</h4>
                        <h6 className="card-subtitle mb-2 text-body-secondary">{blog.author}</h6>
                        <h6 className="card-subtitle mb-2 text-body-secondary">{blog.date}</h6>
                        <p className="card-text">{blog.content ? blog.content.slice(0, 150) : blog.content}...</p>
                            <button onClick={()=> blogDetail(blog._id)} type="submit" className="btn btn-success">Read more</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogCard



