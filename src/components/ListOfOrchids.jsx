import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/esm/Container';
import { Button, Form, FormGroup, Image, Modal } from 'react-bootstrap'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { Link } from 'react-router'
import NavBar from './NavBar';
export default function ListOfOrchids() {
    const baseUrl = import.meta.env.VITE_API_URL
    const[api, setAPI] = useState([])
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { register, handleSubmit,formState: { errors }, control, reset } = useForm();
    const [value, setValue] = useState('');
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
          const response = await axios.get(baseUrl); 
          const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          setAPI(sortedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      const handleDelete = async (id) => {
        try {
           
          const response = await axios.delete(`${baseUrl}/${id}`);
          fetchData();
          toast.success("Orchid deleted successfully!");
        } catch (error) {
          console.log(error.message);
          toast.error("Orchid deleted failed!");
        }
      };

      const onSubmit = async (data) => {
        try {
          const response = await axios.post(baseUrl, data, { 
            headers: { 'Content-Type': 'application/json' }
          });
          setShow(false);
          fetchData();
          reset();
          setValue('');
          toast.success("Orchid added successfully!");
        } catch (error) {
          console.log(error.message);
          toast.error("Orchid added fail!");
        }
      };
  return (
    <Container>
      <NavBar/>
    <Toaster/>
    <Table striped bordered hover >
      <thead>
        <tr>
          <th>Image</th>
          <th>Orchid name</th>
          <th>Original</th>
          <th><button onClick={handleShow} type='button' className="btn btn-primary"><i className="bi bi-node-plus"> Add new orchid</i></button> </th>
        </tr>
      </thead>
      <tbody>
      {api.map((a)=>(
        <tr key={a.id}>
          <td><Image src={a.image} width={40} rounded />
          </td>
          <td>{a.orchidName}</td>
          
          <td>{a.isNatural ? 
            <span className="badge text-bg-success">Natural</span>: <span className="badge text-bg-warning">Industry</span>}</td>
        <td>
        <Link to={`/edit/${a.id}`}> 
            <span className='badge text-bg-primary rounded-2'><i className="bi bi-pencil-square"> Edit </i>
            </span>
            </Link>
    
        <span className='badge text-bg-danger rounded-2' onClick={()=> { if(confirm("Are you sure you want to delete this orchid?"))
               { handleDelete(a.id)}} }>
        <i className="bi bi-trash3"> Delete </i>
        </span>
        </td>
        </tr>
          ))}
      </tbody>
    </Table>
    <Modal show={show} onHide={handleClose} backdrop="static">
    <Modal.Header closeButton>
      <Modal.Title>New Orchid</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            autoFocus
            {...register("orchidName", { required: true })}
          />
          {errors.orchidName && errors.orchidName.type === "required" && <p className="text-warning">Name is required</p>}
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlTextarea1"
        >
          <Form.Label>Image</Form.Label>
          <Form.Control 
            type="text" 
            {...register("image", { required: true, pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi })}
          />
          {errors.image && errors.image.type === "pattern" && <p className="text-warning">Image must be a valid URL</p>}
        </Form.Group>
        <FormGroup>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Natural"
            {...register("isNatural")}
          />
        </FormGroup>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal.Body>
</Modal>

    </Container>
  )
}
