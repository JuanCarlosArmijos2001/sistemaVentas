import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Grid,
    Typography
} from '@mui/material';
import axios from 'axios';

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [nuevoCliente, setNuevoCliente] = useState({
        cedula: '',
        nombre: '',
        direccion: '',
        telefono: ''
    });
    const [editando, setEditando] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.cedula = nuevoCliente.cedula.length === 10 && /^\d+$/.test(nuevoCliente.cedula) 
            ? "" : "La cédula debe tener 10 dígitos numéricos.";
        tempErrors.nombre = /^[a-zA-Z\s]*$/.test(nuevoCliente.nombre) && nuevoCliente.nombre 
            ? "" : "El nombre solo debe contener letras.";
        tempErrors.direccion = /^[a-zA-Z0-9\s]*$/.test(nuevoCliente.direccion) && nuevoCliente.direccion 
            ? "" : "La dirección solo debe contener letras y números.";
        tempErrors.telefono = nuevoCliente.telefono.length === 10 && /^\d+$/.test(nuevoCliente.telefono) 
            ? "" : "El teléfono debe tener 10 dígitos numéricos.";
        
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoCliente({ ...nuevoCliente, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (editando) {
                    await axios.put(`http://localhost:5000/api/clientes/${nuevoCliente.cedula}`, nuevoCliente);
                } else {
                    await axios.post('http://localhost:5000/api/clientes', nuevoCliente);
                }
                fetchClientes();
                resetForm();
            } catch (error) {
                console.error('Error al guardar cliente:', error);
            }
        }
    };

    const resetForm = () => {
        setNuevoCliente({
            cedula: '',
            nombre: '',
            direccion: '',
            telefono: ''
        });
        setEditando(false);
        setErrors({});
    };

    const handleEdit = (cliente) => {
        setNuevoCliente(cliente);
        setEditando(true);
    };

    const handleDelete = async (cedula) => {
        try {
            await axios.delete(`http://localhost:5000/api/clientes/${cedula}`);
            fetchClientes();
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                    Lista de Clientes
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Cédula</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Dirección</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientes.map((cliente) => (
                                <TableRow key={cliente.cedula}>
                                    <TableCell>{cliente.cedula}</TableCell>
                                    <TableCell>{cliente.nombre}</TableCell>
                                    <TableCell>{cliente.direccion}</TableCell>
                                    <TableCell>{cliente.telefono}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(cliente)}>Editar</Button>
                                        <Button onClick={() => handleDelete(cliente.cedula)}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    {editando ? 'Editar Cliente' : 'Nuevo Cliente'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        name="cedula"
                        label="Cédula"
                        value={nuevoCliente.cedula}
                        onChange={handleInputChange}
                        disabled={editando}
                        error={!!errors.cedula}
                        helperText={errors.cedula}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="nombre"
                        label="Nombre"
                        value={nuevoCliente.nombre}
                        onChange={handleInputChange}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="direccion"
                        label="Dirección"
                        value={nuevoCliente.direccion}
                        onChange={handleInputChange}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="telefono"
                        label="Teléfono"
                        value={nuevoCliente.telefono}
                        onChange={handleInputChange}
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {editando ? 'Actualizar Cliente' : 'Crear Cliente'}
                    </Button>
                    {editando && (
                        <Button onClick={resetForm} variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
                            Cancelar
                        </Button>
                    )}
                </form>
            </Grid>
        </Grid>
    );
}

export default Clientes;