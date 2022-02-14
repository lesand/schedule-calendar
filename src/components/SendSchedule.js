import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from "react-datepicker";
import Form from 'react-bootstrap/Form';

export default function SendSchedule(props) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reason, setReason] = useState('');
    const [showE, setShowE] = useState(false);
    const [inputs, setInputs] = useState({});

    const handleModalClose = () => {
        setStartDate(new Date());
        setEndDate(new Date());
        setReason('');
        setShowE(false);
        props.onHide();
    }
    const handleChange = (event, namePicker) => {
        if (namePicker) {
            if (namePicker === 'startDate') {
                setStartDate(event);
                const obj = {
                    [namePicker]: event
                }
                if (inputs) {
                    setInputs(values => ({ ...values, [namePicker]: event }))
                } else {
                    setInputs(obj)
                }
            } else if (namePicker === 'endDate') {
                setEndDate(event)
                const obj = {
                    [namePicker]: event
                }
                if (inputs) {
                    setInputs(values => ({ ...values, [namePicker]: event }))
                } else {
                    setInputs(obj)
                }
            } else {
                setReason(event.target.value);
                const obj = {
                    [namePicker]: event.target.value
                }
                if (inputs) {
                    setInputs(values => ({ ...values, [namePicker]: event.target.value }))
                } else {
                    setInputs(obj)
                }
            }
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if (startDate > endDate) {
            setShowE(true);
        }
        else {
            setShowE(false);
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inputs)
                };
                const response = await fetch('http://localhost:3000/schedule/createOne', requestOptions);
                console.log(response);
                toast.success('Data saved')
                props.onHide();
            } catch (e) {
                console.error(e);
                toast.error("Data couldn't be saved")
            }
        }
    }
    return (
        <div>
            <Modal show={props.showSchedule} onHide={props.onHide}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Schedule</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Start Date</Form.Label>
                            <DatePicker className='datepicker' name="startDate" onChange={(date) => handleChange(date, "startDate")} selected={startDate} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>End Date</Form.Label>
                            <DatePicker className='datepicker' name="endDate" onChange={(date) => handleChange(date, "endDate")} selected={endDate} />
                        </Form.Group>
                        {showE &&
                            <span className='pwError'>Start Date should be before the end date</span>
                        }
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Reason</Form.Label>
                            <Form.Control as="textarea" name="reason" value={reason} onChange={(e) => handleChange(e, "reason")} rows={3} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleModalClose()}>
                            Close
                        </Button>
                        <Button type='submit'>
                            Submit
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div >
    );
}