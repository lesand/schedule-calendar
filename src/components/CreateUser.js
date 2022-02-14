import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import toast, { Toaster } from 'react-hot-toast';
import Form from 'react-bootstrap/Form'

export default function CreateUser(props) {
    const [password, setPassword] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [username, setUsername] = useState('');
    const [inputs, setInputs] = useState({});
    const [showE, setShowE] = useState(false);

    const handleChange = (event) => {
        if(event.target.name === 'username'){
            setUsername(event.target.value)
            const obj = {
                [event.target.name]: event.target.value
            }
            if (inputs) {
                setInputs(values => ({ ...values, [event.target.name]: event.target.value }))
            } else {
                setInputs(obj)
            }
        }else if (event.target.name === 'password'){
            setPassword(event.target.value)
            const obj = {
                [event.target.name]: event.target.value
            }
            if (inputs) {
                setInputs(values => ({ ...values, [event.target.name]: event.target.value }))
            } else {
                setInputs(obj)
            }
        }else{
            setPwConfirm(event.target.value)
            const obj = {
                [event.target.name]: event.target.value
            }
            if (inputs) {
                setInputs(values => ({ ...values, [event.target.name]: event.target.value }))
            } else {
                setInputs(obj)
            }
        }
        setInputs(values => ({ ...values, [event.target.name]: event.target.value }))
    }

    const handleModalClose = () => {
        setPassword('');
        setPwConfirm('');
        setUsername('');
        setShowE(false);
        props.onHide();
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (password !== pwConfirm) {
            setShowE(true);
        } else {
            setShowE(false);
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputs)
                };
                const response = await fetch('http://localhost:3000/user/createOne', requestOptions);
                console.log(response);
                toast.success('Data saved')
                props.onHide();
            } catch (e) {
                console.error(e);
                toast.error("Data couldn't be saved")
            }
            console.log(inputs, 'inputs');
        }
    }

    return (
        <div>
            <Modal show={props.showUser} onHide={props.onHide} >
                <form onSubmit={handleSubmit} >
                    <Modal.Header closeButton>
                        <Modal.Title>Add user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" placeholder='Username' controlId="exampleForm.ControlInput1">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text"  name='username' value={username} onChange={e => handleChange(e)} placeholder="Username" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name='password' value={password} placeholder="Password" onChange={e => handleChange(e)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" name='confirmPassword' value={pwConfirm} placeholder="Password" onChange={e => handleChange(e)} />
                            {showE &&
                                <span className='pwError'>Password doesn't match</span>
                            }
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleModalClose()}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit' >
                            Add new user
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    );
}