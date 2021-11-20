import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button, Card, CardBody, FormGroup, InputGroupAddon, InputGroupText, InputGroup } from 'reactstrap'
import API from './../../config/api'
import { isExpired } from 'react-jwt'

const Login = () => {

    const history = useHistory()

    const [button, setButton] = useState(false)

    const { register, handleSubmit } = useForm();

    const onSubmit = data => {
        setButton(true)

        const formData = new FormData()
		Object.keys(data).forEach((key) => {
			formData.append(key, data[key])
		})

        API.post('/api/login', formData)
        .then(result => {
            const { ok, message, data } = result.data

            if (ok) {
                localStorage.setItem("AUTH_TOKEN", data.authorization)
                history.push('/admin/vehiculos')
            } else {
                alert(message)
            }

            setButton(false)
        }).catch(error => {
            console.error(error);
        })
    }

    const validateSesion = () => {
        if (localStorage.getItem("AUTH_TOKEN")) {
            const isMyTokenExpired = isExpired(localStorage.getItem("AUTH_TOKEN"));
            if (isMyTokenExpired) {
                localStorage.removeItem("AUTH_TOKEN")
                history.push('/auth/login')
            } else {
                history.push('/admin/vehiculos')
            }
        }
    }

    useEffect(() => {
        validateSesion()
    }, [])

    return (
        <>
            <div className="col-lg-5 col-md-7">
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-email-83" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <input className="form-control" placeholder="Usuario" type="text" {...register("usuario", { required: true })} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-lock-circle-open" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <input className="form-control" placeholder="Clave" type="password" {...register("clave", { required: true })} />
                                </InputGroup>
                            </FormGroup>
                            <div className="text-center">
                                <Button className="my-4" color="primary" type="submit" disabled={button}>
                                    { !button ? 'Sign in' : 'Cargando...' }
                                </Button>
                            </div>
                        </form>
                        
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default Login;
