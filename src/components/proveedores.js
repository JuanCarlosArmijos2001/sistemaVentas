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

function Proveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [nuevoProveedor, setNuevoProveedor] = useState({
        ruc: '',
        empresa: '',
        direccion: '',
        telefono: ''
    });
    const [editando, setEditando] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchProveedores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/proveedores');
            setProveedores(response.data);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.ruc = nuevoProveedor.ruc.length === 13 && /^\d+$/.test(nuevoProveedor.ruc)
            ? "" : "El RUC debe tener 13 dígitos numéricos.";
        tempErrors.empresa = /^[a-zA-Z\s]*$/.test(nuevoProveedor.empresa) && nuevoProveedor.empresa
            ? "" : "La empresa solo debe contener letras y espacios.";
        tempErrors.direccion = /^[a-zA-Z0-9\s]*$/.test(nuevoProveedor.direccion) && nuevoProveedor.direccion
            ? "" : "La dirección solo debe contener letras, números y espacios.";
        tempErrors.telefono = nuevoProveedor.telefono.length === 10 && /^\d+$/.test(nuevoProveedor.telefono)
            ? "" : "El teléfono debe tener 10 dígitos numéricos.";
        
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProveedor({ ...nuevoProveedor, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (editando) {
                    await axios.put(`http://localhost:5000/api/proveedores/${nuevoProveedor.ruc}`, nuevoProveedor);
                } else {
                    await axios.post('http://localhost:5000/api/proveedores', nuevoProveedor);
                }
                fetchProveedores();
                resetForm();
            } catch (error) {
                console.error('Error al guardar proveedor:', error);
            }
        }
    };

    const resetForm = () => {
        setNuevoProveedor({
            ruc: '',
            empresa: '',
            direccion: '',
            telefono: ''
        });
        setEditando(false);
        setErrors({});
    };

    const handleEdit = (proveedor) => {
        setNuevoProveedor(proveedor);
        setEditando(true);
    };

    const handleDelete = async (ruc) => {
        try {
            await axios.delete(`http://localhost:5000/api/proveedores/${ruc}`);
            fetchProveedores();
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                    Lista de Proveedores
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>RUC</TableCell>
                                <TableCell>Empresa</TableCell>
                                <TableCell>Dirección</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {proveedores.map((proveedor) => (
                                <TableRow key={proveedor.ruc}>
                                    <TableCell>{proveedor.ruc}</TableCell>
                                    <TableCell>{proveedor.empresa}</TableCell>
                                    <TableCell>{proveedor.direccion}</TableCell>
                                    <TableCell>{proveedor.telefono}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(proveedor)}>Editar</Button>
                                        <Button onClick={() => handleDelete(proveedor.ruc)}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    {editando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        name="ruc"
                        label="RUC"
                        value={nuevoProveedor.ruc}
                        onChange={handleInputChange}
                        disabled={editando}
                        error={!!errors.ruc}
                        helperText={errors.ruc}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="empresa"
                        label="Empresa"
                        value={nuevoProveedor.empresa}
                        onChange={handleInputChange}
                        error={!!errors.empresa}
                        helperText={errors.empresa}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="direccion"
                        label="Dirección"
                        value={nuevoProveedor.direccion}
                        onChange={handleInputChange}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="telefono"
                        label="Teléfono"
                        value={nuevoProveedor.telefono}
                        onChange={handleInputChange}
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {editando ? 'Actualizar Proveedor' : 'Crear Proveedor'}
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

export default Proveedores;