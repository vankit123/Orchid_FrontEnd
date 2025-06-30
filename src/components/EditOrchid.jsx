import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Button, Col, Form, FormGroup, Image, Row } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router';

export default function EditOrchid() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [api, setAPI] = useState({});
  
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();

  useEffect(() => {
    axios.get(`${baseUrl}/${id}`)
      .then((response) => {
        setAPI(response.data);
        setValue('orchidName', response.data.orchidName);
        setValue('image', response.data.image);
        setValue('isNatural', response.data.isNatural);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch orchid data.');
      });
  }, [id, setValue, baseUrl]);

  const onSubmit = (data) => {
    axios.put(`${baseUrl}/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        toast.success('Orchid edited successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to edit orchid.');
      });
  };

  return (
    <Container>
      <Toaster />
      <Row>
        <p className="lead text-primary">Edit the orchid: {api.orchidName}</p>
        <hr />
        <Col md={8}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Controller
                name="orchidName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
              {errors.orchidName && errors.orchidName.type === "required" && <p className="text-warning">Name is required</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Image</Form.Label>
              <Controller
                name="image"
                control={control}
                rules={{ required: true, pattern: /(https?:\/\/[^\s]+)/i }}
                render={({ field }) => <Form.Control {...field} type="text" />}
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

            <Button variant="primary" type="submit">
              Save
            </Button>
          </form>
        </Col>

        <Col md={4}>
          <Image src={api.image} width={240} thumbnail className='shadow-lg p-3 mb-5 bg-body-tertiary rounded' />
        </Col>
      </Row>
    </Container>
  );
}
