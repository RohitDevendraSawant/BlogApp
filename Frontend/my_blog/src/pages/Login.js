import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Login() {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({email: "", password: ""});
    const [cookies, setCookie] = useCookies(['jwtToken']);
    const navigate = useNavigate();



    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setData({ ...data, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidated(true);

        try {
            const response = await fetch("http://localhost:5000/api/user/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const data = await response.json()
                const token = data.authToken;
                setCookie('jwtToken', token, { path : '/', maxAge : 60 * 60 * 24 });
                navigate("/");
            }
            else{
                let error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const navigateToSignup = () => {
        navigate("/signup");
    }
    return (
        <div className='container my-4'>
            <div className='border border-2 shadow p-3 mb-5 bg-body-tertiary rounded p-3'>
                <div className='row justify-content-around'>
                    <div className='col-lg-4 col-sm-1'>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md="12" controlId="validationCustom01">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        placeholder="abc@gmail.com"
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md="12" controlId="validationCustom02">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Button type="submit" className='btn btn-success mb-2'>Login</Button>
                                <Button onClick={navigateToSignup} className='btn btn-info mb-2'>Create Account</Button>

                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login