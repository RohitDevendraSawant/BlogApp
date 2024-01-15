import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';


function EditBlog() {
  const location = useLocation();
  const [data, setData] = useState([])
  const host = "http://localhost:5000";
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

    setData({
        ...data, [name]: value
    });
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
        console.log(data);
        setData(data);
    }
    else{
        let error = await response.json();
        alert(error.message);
    }

}
  
  const editBlog =  async (e)=>{
    e.preventDefault();
    const token = cookies.jwtToken;
    const id = location.state.id;
    const response = await fetch(`http://localhost:5000/api/blog/updateBlog/${id}`, {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json",
            'auth-token': token
        },
        body : JSON.stringify(data),
    });
    if (response.ok){
        alert("Blog edited successfully.")
        navigate("/");
    }
    else{
        let error = await response.json();
        alert(error.message);
    }
  }

  useEffect(() => {
    isAuthenticated();
    getBlog();
  }, [])
  
  return (
    <div className='container'>
        <div className='row justify-content-center my-4'>
            <div className='col-5 border border-1 rounded p-4 shadow bg-body-tertiary rounded'>
                <form method='POST'>
                    <div className="mb-3">
                        <label htmlhtmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" value={data.title} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlhtmlFor="author" className="form-label">Author</label>
                        <input type="author" className="form-control" id="author" name="author" value={data.author} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlhtmlFor="content" className="form-label">Content</label>
                        <textarea className="form-control" id="content" rows="3" name='content' value={data.content} onChange={handleChange}></textarea>
                    </div>
                    <button className="btn btn-success" onClick={editBlog}>Save</button>
                </form>
            </div>
        </div>
    </div>
  );
}

export default EditBlog