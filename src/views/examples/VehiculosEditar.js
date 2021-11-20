import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Container, Row, Col, FormText } from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import { isExpired } from "react-jwt"
// core components
import Header from "components/Headers/Header.js"
import API from 'config/api'

const ListaVehiculos = () => {

    const history = useHistory()

    const { id } = useParams()

    const [result, setResult] = useState({})

    const [fetch, setFetch] = useState(true)

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

    const datosVehiculo = () => {
        API.get(`/api/vehiculos/${id}`, {
            headers: { "Authorization": localStorage.getItem("AUTH_TOKEN") }
            
        }).then(result => {
            const { ok, message, data } = result.data

            if (ok) {
                setResult(data)
                setFetch(false)
            } else {
                alert(message)
            }
        }).catch(error => {
            console.error(error);
        })
    }

    const onSubmit = data => {
        // console.log(data);
        // return

        setButton(true)

        if (data.imagen.length > 0) {
            const formData = new FormData()
            Object.keys(data).forEach((key) => {
                if (key !== 'imagen') {
                    formData.append(key, data[key])
                }
            })

            formData.append("imagen", data.imagen[0])

            API.put(`/api/vehiculos/${id}`, formData, {
                headers: { "Authorization": localStorage.getItem("AUTH_TOKEN"), "Content-Type": "multipart/form-data" }
                
            }).then(result => {
                const { ok, message } = result.data
    
                alert(message)
    
                // if (ok) {
                //     setTimeout(() => {
                //         history.push('/admin/vehiculos')
                //     }, 2000)
                // }
    
                setButton(false)
            }).catch(error => {
                console.error(error);
            })
        } else {
            const formData = new FormData()
            Object.keys(data).forEach((key) => {
                if (key !== 'imagen') {
                    formData.append(key, data[key])
                }
            })

            API.put(`/api/vehiculos/${id}`, formData, {
                headers: { "Authorization": localStorage.getItem("AUTH_TOKEN") }
                
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
    }

    // const eliminarVehiculo = id => {
        
    // }

    useEffect(() => {
        validarSesionJWT()

        if (fetch) {
            datosVehiculo()
        }
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
                                                <h3 className="mb-0">Editar Vehiculo</h3>
                                            </Col>
                                            <Col className="text-right" xs="4">
                                                <input type="hidden" {...register("imagen_", { required: true })} defaultValue={result.imagen} />
                                                <input type="hidden" {...register("valor", { required: true })} defaultValue={parseInt(result.valor)} />
                                                <Button type="submit" color="primary" size="sm" disabled={button}>{ !button ? 'Editar' : 'Procesando...' }</Button>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <CardBody>
                                        <h6 className="heading-small text-muted mb-4">Información</h6>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-username">Placa</label>
                                                        <input className="form-control" placeholder="Placa" type="text" {...register("placa", { required: true })} defaultValue={result.placa} />
                                                        {errors.placa && (
                                                            <FormText color="red">Este campo es requerido</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-username">Marca</label>
                                                        <input className="form-control" placeholder="Marca" type="text" {...register("marca", { required: true })} defaultValue={result.marca} />
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
                                                        <input className="form-control" placeholder="Color" type="text" {...register("color", { required: true })} defaultValue={result.color} />
                                                        {errors.color && (
                                                            <FormText color="red">Este campo es requerido</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label className="form-control-label" htmlFor="input-username">Modelo</label>
                                                        <input className="form-control" placeholder="Modelo" type="text" {...register("modelo", { required: true })} defaultValue={result.modelo} />
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
                                                        <input className="form-control" placeholder="Imagen" type="file" accept="image/*" {...register("imagen", { required: false })} />
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