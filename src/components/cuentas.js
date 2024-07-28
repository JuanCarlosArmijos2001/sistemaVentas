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

function Cuentas() {
    const [cuentas, setCuentas] = useState([]);
    const [nuevaCuenta, setNuevaCuenta] = useState({
        numeroCuenta: '',
        banco: '',
        nombreAsociado: '',
        saldoCuenta: 0
    });
    const [editando, setEditando] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCuentas();
    }, []);

    const fetchCuentas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cuentas');
            setCuentas(response.data);
        } catch (error) {
            console.error('Error al obtener cuentas:', error);
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.numeroCuenta = /^\d{15,20}$/.test(nuevaCuenta.numeroCuenta)
            ? "" : "El número de cuenta debe tener entre 15 y 20 dígitos numéricos.";
        tempErrors.banco = /^[a-zA-Z\s]*$/.test(nuevaCuenta.banco) && nuevaCuenta.banco
            ? "" : "El banco solo debe contener letras y espacios.";
        tempErrors.nombreAsociado = /^[a-zA-Z\s]*$/.test(nuevaCuenta.nombreAsociado) && nuevaCuenta.nombreAsociado
            ? "" : "El nombre asociado solo debe contener letras y espacios.";
        tempErrors.saldoCuenta = nuevaCuenta.saldoCuenta >= 0
            ? "" : "El saldo debe ser un número positivo.";
        
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaCuenta({ ...nuevaCuenta, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (editando) {
                    await axios.put(`http://localhost:5000/api/cuentas/${nuevaCuenta.numeroCuenta}`, nuevaCuenta);
                } else {
                    await axios.post('http://localhost:5000/api/cuentas', nuevaCuenta);
                }
                fetchCuentas();
                resetForm();
            } catch (error) {
                console.error('Error al guardar cuenta:', error);
            }
        }
    };

    const resetForm = () => {
        setNuevaCuenta({
            numeroCuenta: '',
            banco: '',
            nombreAsociado: '',
            saldoCuenta: 0
        });
        setEditando(false);
        setErrors({});
    };

    const handleEdit = (cuenta) => {
        setNuevaCuenta(cuenta);
        setEditando(true);
    };

    const handleDelete = async (numeroCuenta) => {
        try {
            await axios.delete(`http://localhost:5000/api/cuentas/${numeroCuenta}`);
            fetchCuentas();
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                    Lista de Cuentas
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Número de Cuenta</TableCell>
                                <TableCell>Banco</TableCell>
                                <TableCell>Nombre Asociado</TableCell>
                                <TableCell>Saldo</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cuentas.map((cuenta) => (
                                <TableRow key={cuenta.numeroCuenta}>
                                    <TableCell>{cuenta.numeroCuenta}</TableCell>
                                    <TableCell>{cuenta.banco}</TableCell>
                                    <TableCell>{cuenta.nombreAsociado}</TableCell>
                                    <TableCell>{cuenta.saldoCuenta}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(cuenta)}>Editar</Button>
                                        <Button onClick={() => handleDelete(cuenta.numeroCuenta)}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    {editando ? 'Editar Cuenta' : 'Nueva Cuenta'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        name="numeroCuenta"
                        label="Número de Cuenta"
                        value={nuevaCuenta.numeroCuenta}
                        onChange={handleInputChange}
                        disabled={editando}
                        error={!!errors.numeroCuenta}
                        helperText={errors.numeroCuenta}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="banco"
                        label="Banco"
                        value={nuevaCuenta.banco}
                        onChange={handleInputChange}
                        error={!!errors.banco}
                        helperText={errors.banco}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="nombreAsociado"
                        label="Nombre Asociado"
                        value={nuevaCuenta.nombreAsociado}
                        onChange={handleInputChange}
                        error={!!errors.nombreAsociado}
                        helperText={errors.nombreAsociado}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="saldoCuenta"
                        label="Saldo"
                        type="number"
                        value={nuevaCuenta.saldoCuenta}
                        onChange={handleInputChange}
                        error={!!errors.saldoCuenta}
                        helperText={errors.saldoCuenta}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {editando ? 'Actualizar Cuenta' : 'Crear Cuenta'}
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

export default Cuentas;