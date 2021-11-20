import React, { useState, useMemo } from 'react'
import { Container, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useHistory } from 'react-router-dom';
import Dropzone, { useDropzone } from 'react-dropzone';
import API from './../../config/api';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const Header = (props) => {
    const history = useHistory()

    const [isOpen, setOpen] = useState(false)

    const [selectedFiles, setSelectedFiles] = useState(undefined)

    const [progressInfos, setProgressInfos] = useState(0)

    const [message, setMessage] = useState(undefined)

    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    // const acceptedFileItems = acceptedFiles.map(file => (
    //     <li key={file.path}>
    //         {file.path} - {file.size} bytes
    //     </li>
    // ))

    const onDrop = files => {
        if (files.length > 0) {
            setSelectedFiles(files);
        }
    }

    const uploadService = () => {
        let _progressInfos = progressInfos;

        upload(selectedFiles, event => {
            _progressInfos = Math.round(
                (100 * event.loaded) / event.total
            );
            setProgressInfos(_progressInfos)
        }).then(result => {
            const { ok, message } = result.data
            setMessage(message)

            if (ok) {
                setTimeout(() => {
                    setOpen(false)
                }, 3000)
            }
        }).catch(error => {
            console.error(error);
        })
    }

    const upload = (file, onUploadProgress) => {
        let formData = new FormData();
        formData.append("excel", file[0]);
    
        return API.post("/api/vehiculos/upload", formData, {
            headers: {
                "Authorization": localStorage.getItem("AUTH_TOKEN"),
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress,
        });
    }

    return (
        <>
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                <Container fluid>
                    {props.view === 'listar' && (
                        <>
                            <Button color="success" onClick={() => history.push('/admin/vehiculos-crear')}><i className="ni ni-archive-2"></i> Registrar Vehículo</Button>
                            <Button color="primary" onClick={() => setOpen(true)}><i className="ni ni-cloud-upload-96"></i> Subir Excel</Button>
                        </>
                    )}
                </Container>
            </div>

            <Modal isOpen={isOpen} toggle={isOpen}>
                <ModalHeader toggle={() => setOpen(false)}>Upload Vehículos</ModalHeader>
                <ModalBody>
                    {progressInfos > 1 &&
                        <div className="mb-2">
                            <div className="progress">
                                <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow={progressInfos} aria-valuemin="0" aria-valuemax="100" style={{ width: progressInfos + "%" }}>{progressInfos}%</div>
                            </div>
                        </div>
                    }

                    <div className="my-3">
                        <Dropzone accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onDrop={onDrop}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps({style})}>
                                        <input {...getInputProps()} />
                                        {selectedFiles ? (
                                            <div className="selected-file">
                                                {selectedFiles.length > 1
                                                ? `${selectedFiles.length} files`
                                                : selectedFiles.map((file) => file.name).join(", ")}
                                            </div>
                                            ) : (
                                                <>
                                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                                    <em>(Only *.xls and *.xlsx)</em>
                                                </>
                                            )
                                        }
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </div>

                    {message && (
                        <div className="alert alert-secondary" role="alert">{message}</div>
                    )}
                    {/* <div className="container">
                        <div {...getRootProps({style})}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                            <em>(Only *.xls and *.xlsx)</em>
                        </div>
                        <aside>
                            <h4>Accepted files</h4>
                            <ul>{acceptedFileItems}</ul>
                            <h4>Message</h4>
                            <ul>{message}</ul>
                        </aside>
                    </div> */}
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={uploadService}>Upload</Button>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default Header;
