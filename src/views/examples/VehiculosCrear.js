import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col, FormFeedback, FormText } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { isExpired } from "react-jwt"
// core components
import Header from "components/Headers/Header.js"
import api from 'config/api'

const ListaVehiculos = () => {

    const history = useHistory()

    const [button, setButton] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm();

    const validarSesionJWT = () => {
        if (!localStorage.getItem("AUTH_TOKEN")) {
            history.push('/')
        } else {
            const isMyTokenExpired = isExpired(localStorage.getItem("AUTH_TOKEN"));
            if (isMyTokenExpired) {
                history.push('/')
            }
        }
    }

    const onSubmit = data => {
        console.log(data);
        // return
        setButton(true)


        const formData = new FormData()
		Object.keys(data).forEach((key) => {
            if (key !== 'imagen') {
                formData.append(key, data[key])
            }
		})

        formData.append("imagen", data.imagen[0])

        api.post('/api/vehiculos', formData, {
            headers: { "Authorization": localStorage.getItem("AUTH_TOKEN"), "Content-Type": "multipart/form-data" }
            
        }).then(result => {
            const { ok, message } = result.data

            alert(message)
            if (ok) {
                setTimeout(() => {
                    history.push('/admin/vehiculos')
                }, 2000)
            }

            setButton(false)
        }).catch(error => {
            console.error(error);
        })
    }

    // const eliminarVehiculo = id => {
        
    // }

    useEffect(() => {
        validarSesionJWT()
    }, [])

    return (
        <>
            <Header view='crear' />
            {fetch && (<p>Cargando contenido...</p>)}

            {!fetch && (
                <Container className="mt--7" fluid>
                    <Row>
                        <Col xl="2" />
                        <Col xl="8">
                            <Card className="bg-secondary shadow">
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <CardHeader className="bg-white border-0">
                                        <Row className="align-items-center">
                                            <Col xs="8">
                                                <h3 className="mb-0">Registro Vehiculos</h3>
                                            </Col>
                                            <Col className="text-right" xs="4">
                                                <Button type="submit" color="primary" size="sm" disabled={button}>{ !button ? 'Guardar' : 'Procesando...' }</Button>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <CardBody>
                                        <h6 className="heading-small text-muted mb-4">Informaci??n</h6>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-username">Placa</label>
                                                        <input className="form-control" placeholder="Placa" type="text" {...register("placa", { required: true })} />
                                                        {errors.placa && (
                                                            <FormText color="red">Este campo es requerido</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-username">Marca</label>
                                                        <input className="form-control" placeholder="Marca" type="text" {...register("marca", { required: true })} />
                                                        {errors.marca && (
                                                            <FormText color="red">Este campo es requerido</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-username">Color</label>
                                                        <input className="form-control" placeholder="Color" type="text" {...register("color", { required: true })} />
                                                        {errors.color && (
                                                            <FormText color="red">Este campo es requerido</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-username">Modelo</label>
                                                        <input className="form-control" placeholder="Modelo" type="text" {...register("modelo", { required: true })} />
                                                        {errors.modelo && (
                                                            <FormText color="red">Este campo es requerido</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-username">Imagen</label>
                                                        <input className="form-control" placeholder="Imagen" type="file" accept="image/*" {...register("imagen", { required: true })} />
                                                        {errors.color && (
                                                            <FormText color="red">Este campo es requerido</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                </Form>
                            </Card>
                        </Col>  
                        <Col xl="2" />
                    </Row>
                </Container>
            )}
        </>
    );
};

export default ListaVehiculos;