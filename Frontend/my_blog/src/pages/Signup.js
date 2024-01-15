import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [data, setdata] = useState({fname: "", lname: "", email: "", password: "", confirmPassword: ""});
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event)=>{
        let name = event.target.name;
        let value = event.target.value;
        setdata({...data, [name]: value});
    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        const { fname, lname, email, password, confirmPassword} = data;

        if (password !== confirmPassword){
            alert("Password and confirm password are not same");
            setdata({
                fname, lname, email, password: "", confirmPassword: ""
            });
            return;
        }

        const response = await fetch("http://localhost:5000/api/user/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const jsondata = await response.json();
        if (response.ok) {
            console.log(jsondata);
            navigate("/login");
        }
        else{
            console.log(jsondata);
            alert(jsondata.message);
        }

    };

    const navigateToLogin=(event)=>{
        navigate("/login");
    }
    return (
        <div className='container my-4'>
            <div className='border border-2 shadow p-3 mb-5 bg-body-tertiary rounded p-3'>
                <div className='row justify-content-around'>
                    <div className='col-lg-4 col-sm-1'>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="6" controlId="validationCustom01">
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="First name"
                                        name= "fname"
                                        value= {data.fname}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="validationCustom02">
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Last name"
                                        name= "lname"
                                        value= {data.lname}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md="12" controlId="validationCustom03">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="abc@gmail.com"
                                        name= "email"
                                        value= {data.email}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md="12" controlId="validationCustom04">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        name= "password"
                                        value= {data.password}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md="12" controlId="validationCustom05">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        name= "confirmPassword"
                                        value= {data.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Button type="submit" className='btn btn-success mb-2'>SigunUp</Button>
                                <Button onClick={navigateToLogin} className='btn btn-info mb-2'>Login</Button>

                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup