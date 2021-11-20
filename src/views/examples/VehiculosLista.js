import React, { useState, useEffect } from 'react'
import { Badge, Card, CardHeader, CardFooter, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Pagination, PaginationItem, PaginationLink, Table, Container, Row, Media } from "reactstrap";
import { useHistory } from 'react-router-dom'
import API from './../../config/api'
import { isExpired } from "react-jwt";
// core components
import Header from "components/Headers/Header.js";

const ListaVehiculos = () => {

    const history = useHistory()

    const tokenAuth = localStorage.getItem("AUTH_TOKEN")

    const [resultado, setResultado] = useState([])
    
    const [fetch, setFetch] = useState(true)

    const listarVehiculos = async() => {
        if (tokenAuth) {
            API.get('/api/vehiculos', {
                headers: { 'Authorization': localStorage.getItem("AUTH_TOKEN") }
            })
            .then(result => {
                const { ok, message, data } = result.data

                if (ok) {
                    setResultado(data)
                    setFetch(false)
                } else {
                    alert(message)

                    if (message === 'Token not valid') {
                        setTimeout(() => {
                            history.push('/')
                        }, 3000)
                    }
                }
            })
            .catch(error => {
                console.error(error);
            })
        }
    }

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

    const eliminarVehiculo = id => {
        API.delete(`/api/vehiculos/${id}`, {
            headers: { 'Authorization': localStorage.getItem("AUTH_TOKEN") }
        })
        .then(result => {
            const { ok, message, data } = result.data

            if (ok) {
                setResultado(data)
            } else {
                alert(message)

                if (message === 'Token not valid') {
                    setTimeout(() => {
                        history.push('/')
                    }, 3000)
                }
            }
        })
        .catch(error => {
            console.error(error);
        })
    }

    useEffect(() => {
        validarSesionJWT()

        if (fetch) {
            listarVehiculos();
        }
    }, [])

    return (
        <>
            <Header view='listar' />
            {fetch && (<p>Cargando contenido...</p>)}

            {!fetch && (
                <Container className="mt--7" fluid>
                    <Row>
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0">Card tables</h3>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Responsable</th>
                                            <th scope="col">Placa</th>
                                            <th scope="col">Marca</th>
                                            <th scope="col">Color</th>
                                            <th scope="col">Modelo</th>
                                            <th scope="col">Valor</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Ingreso</th>
                                            <th scope="col" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            resultado.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <Media className="align-items-center">
                                                                <img className="avatar rounded-circle mr-3" alt="..." src={`http://localhost:3030/api/vehiculos/imagen/${item.imagen}`}/>
                                                            </Media>
                                                        </td>
                                                        <td>{item.responsable}</td>
                                                        <td>{item.placa}</td>
                                                        <td>{item.marca}</td>
                                                        <td>{item.color}</td>
                                                        <td>{item.modelo}</td>
                                                        <td>{item.valor}</td>
                                                        <td>{((item.status === '1')?<Badge color="" className="badge-dot mr-4"><i className="bg-success" />Activo</Badge>:<Badge color="" className="badge-dot mr-4"><i className="bg-danger" />Eliminado</Badge>)}</td>
                                                        <td>{item.fecha_ingreso}</td>
                                                        <td>
                                                            {item.status === '1' && (
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle className="btn-icon-only text-light" href="#" role="button" size="sm" color="" onClick={(e) => e.preventDefault()} ><i className="fas fa-ellipsis-v" /></DropdownToggle>
                                                                    <DropdownMenu className="dropdown-menu-arrow" right>
                                                                        <DropdownItem onClick={() => history.push(`/admin/vehiculos-editar/${item.id}`)}>Editar</DropdownItem>
                                                                        <DropdownItem onClick={() => eliminarVehiculo(item.id)}>Eliminar</DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <CardFooter className="py-4">
                                    <nav aria-label="...">
                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        <PaginationItem className="disabled">
                                        <PaginationLink
                                            href="#pablo"
                                            onClick={(e) => e.preventDefault()}
                                            tabIndex="-1"
                                        >
                                            <i className="fas fa-angle-left" />
                                            <span className="sr-only">Previous</span>
                                        </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem className="active">
                                        <PaginationLink
                                            href="#pablo"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            1
                                        </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#pablo"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                2 <span className="sr-only">(current)</span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                        <PaginationLink
                                            href="#pablo"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            3
                                        </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                        <PaginationLink
                                            href="#pablo"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <i className="fas fa-angle-right" />
                                            <span className="sr-only">Next</span>
                                        </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                    </nav>
                                </CardFooter>
                            </Card>
                        </div>
                    </Row>
                </Container>
            )}
        </>
    );
};

export default ListaVehiculos;