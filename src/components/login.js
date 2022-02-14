import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form'
import Cookies from 'universal-cookie';



export default function Login(props) {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [inputs, setInputs] = useState({});
  // const [showE, setShowE] = useState(false);

  const handleChange = (event) => {
    if (event.target.name === 'username') {
      setUsername(event.target.value)
    } else {
      setPassword(event.target.value)
    }
    setInputs(values => ({ ...values, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const cookies = new Cookies();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      };
      const response = await fetch('http://localhost:3000/auth/signin', requestOptions)
        .then((response) => response.json())
        .then((ans) => {
          console.log(ans); 
          if (ans.message) {
            if (ans.message === 'User does not exist') {
              toast.error('User does not exist')
            }
          }
          if (ans.message === 'Invalid credentials') {
            toast.error('Wrong credentials')
          }
          if (ans.role) {
            toast.success('You logged in')
            cookies.set('role', ans.role, {path: '/'});
            cookies.set('token', ans.token, {path: '/'})
            props.getCookies();
          }
        });
      console.log(response, 'response');

    } catch (e) {
      console.error(e);
    }

  }

  return (
    <div className='bg-login'>
      <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name='username' value={username} placeholder="username" onChange={(e) => handleChange(e)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name='password' type="password" value={password} placeholder="password" onChange={(e) => handleChange(e)} />
        </Form.Group>
        <Button variant="outline-info" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

