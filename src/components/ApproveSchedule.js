import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import toast, { Toaster } from 'react-hot-toast';
import Form from 'react-bootstrap/Form'
import constants from '../constants';

export default function ApproveSchedule(props) {
    const [events, setEvents] = useState([]);


    const handleModalClose = () => {
        props.onHide();
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    `${constants.baseURL}schedule`
                );
                const json = await response.json();
                let Myevents = json.data.map((event) => {
                    if (event.approved === 0) {
                        return {
                            id: event.id,
                            title: event.reason,
                            desc: event.reason,
                            start: new Date(event.startDate),
                            end: new Date(event.endDate),
                        };
                    }
                });
                Object.keys(Myevents).forEach(key => {
                    if (Myevents[key] === undefined) {
                        delete Myevents[key];
                    }
                });
                console.log(Myevents, 'request events')
                setEvents(Myevents);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData()
    }, [props.showRequest])

    async function handleApprove(id) {
        try {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: 1 })
            };
            const response = await fetch('http://localhost:3000/schedule/' + id , requestOptions).then(response => response.json())
            .then(data => console.log(data));
            toast.success('Approved')
            props.onHide();
        } catch (e) {
            console.error(e);
            toast.error("Data couldn't be saved")
        }
    }

    return (
        <div>
            <Modal show={props.showRequest} onHide={props.onHide} >
                <Modal.Header closeButton>
                    <Modal.Title>Your pending requests</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {events.map((item, key) => {
                        return (
                            <table className='tableStyle'>
                                <tbody>
                                    <tr key={key}>
                                        <td>{item.title}</td>
                                        <Button variant="success"
                                            className='buttonApprove' size='sm' onClick={() => handleApprove(item.id)}>
                                            Approve
                                        </Button>
                                    </tr>
                                </tbody>
                            </table>
                        )
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalClose()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}