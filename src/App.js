import './App.css';
import React, { useState } from "react";
import Button from 'react-bootstrap/Button'
import { Navbar, Container } from 'react-bootstrap';
import CalendarMVP from './components/CalendarMVP';
import CreateUser from './components/CreateUser';
import SendSchedule from './components/SendSchedule';
import ApproveSchedule from './components/ApproveSchedule';
import "react-datepicker/dist/react-datepicker.css";
import Cookies from 'universal-cookie';
import Login from './components/login';
function App() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [roleUser, setRoleUser] = useState('');
  const [tokenUser, setTokenUser] = useState('');
  const [refreshCalendar, setRefreshCalendar] = useState(false);

  const getCookies = () => {
    const cookies = new Cookies();
    const role = cookies.get('role');
    const token = cookies.get('token');
    setRoleUser(role);
    setTokenUser(token);
  }

  async function logout() {
    const cookies = new Cookies();
    cookies.remove('role')
    cookies.remove('token')
    setRoleUser('')
    setTokenUser('')
    console.log(cookies.get('role'))
  }

  async function handleModalClose() {
    setShowSchedule(false);
    setShowUser(false);
    setShowRequest(false);
    setRefreshCalendar(true);
  }
  async function offRefreshingCalendar() {
    setRefreshCalendar(false);
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            Schedule Calendar
          </Navbar.Brand>
        </Container>
      </Navbar>

      {roleUser &&
        <Button className='buttonUserlogout' variant="outline-danger" onClick={() => logout()}>Logout</Button>
      }
      {roleUser === 'general' &&
        <Button className='buttonSchedule' variant="outline-info" onClick={() => setShowSchedule(!showSchedule)}>Add Schedule</Button>
      }
      {roleUser === 'admin' &&
        <Button className='buttonRequest' variant="outline-info" onClick={() => setShowRequest(!showRequest)}>Pending requests</Button>
      }
      {roleUser === 'admin' &&
        <Button className='buttonUser' variant="outline-info" onClick={() => setShowUser(!showUser)}>Add user</Button>
      }

      <CreateUser showUser={showUser} onHide={() => handleModalClose()} />
      <SendSchedule showSchedule={showSchedule} onHide={() => handleModalClose()} />
      <ApproveSchedule showRequest={showRequest} onHide={() => handleModalClose()} />


      <div className='center-calendar'>
        {roleUser &&
          <CalendarMVP refreshCalendar={refreshCalendar} offRefresh={() => offRefreshingCalendar()} />
        }
        {!tokenUser &&
          <Login getCookies={getCookies} />
        }
      </div>
    </div>
  );
}

export default App;
