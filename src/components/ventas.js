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
    MenuItem,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import axios from 'axios';

function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [nuevaVenta, setNuevaVenta] = useState({
        cliente: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
        subtotal: 0,
        total: 0,
        cuenta: ''
    });
    const [editando, setEditando] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        fetchVentas();
        fetchClientes();
        fetchCuentas();
    }, []);

    const fetchVentas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/ventas');
            setVentas(response.data);
        } catch (error) {
            console.error('Error al obtener ventas:', error);
            showSnackbar('Error al obtener ventas', 'error');
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            showSnackbar('Error al obtener clientes', 'error');
        }
    };

    const fetchCuentas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/cuentas');
            setCuentas(response.data);
        } catch (error) {
            console.error('Error al obtener cuentas:', error);
            showSnackbar('Error al obtener cuentas', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'subtotal') {
            const subtotal = parseFloat(value);
            const total = subtotal * 1.15; // Añadir 15% de IVA
            setNuevaVenta({ ...nuevaVenta, subtotal, total: total.toFixed(2) });
        } else {
            setNuevaVenta({ ...nuevaVenta, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await axios.put(`http://localhost:5000/api/ventas/${nuevaVenta.numeroTransaccion}`, nuevaVenta);
                showSnackbar('Venta actualizada con éxito', 'success');
            } else {
                await axios.post('http://localhost:5000/api/ventas', nuevaVenta);
                showSnackbar('Venta creada con éxito', 'success');
            }
            await fetchVentas();
            await fetchCuentas();
            resetForm();
        } catch (error) {
            console.error('Error al guardar venta:', error.response ? error.response.data : error.message);
            showSnackbar('Error al guardar venta', 'error');
        }
    };

    const resetForm = () => {
        setNuevaVenta({
            cliente: '',
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
            subtotal: 0,
            total: 0,
            cuenta: ''
        });
        setEditando(false);
    };

    const handleEdit = (venta) => {
        setNuevaVenta({
            ...venta,
            fecha: venta.fecha.split('T')[0],
            hora: venta.hora.slice(0, 5)
        });
        setEditando(true);
    };

    const handleDelete = async (numeroTransaccion) => {
        try {
            await axios.delete(`http://localhost:5000/api/ventas/${numeroTransaccion}`);
            await fetchVentas();
            await fetchCuentas();
            showSnackbar('Venta eliminada con éxito', 'success');
        } catch (error) {
            console.error('Error al eliminar venta:', error.response ? error.response.data : error.message);
            showSnackbar('Error al eliminar venta', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                    Lista de Ventas
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Número de Transacción</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Hora</TableCell>
                                <TableCell>Subtotal</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Cuenta</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ventas.map((venta) => (
                                <TableRow key={venta.numeroTransaccion}>
                                    <TableCell>{venta.numeroTransaccion}</TableCell>
                                    <TableCell>{clientes.find(c => c.cedula === venta.cliente)?.nombre || venta.cliente}</TableCell>
                                    <TableCell>{venta.fecha.split('T')[0]}</TableCell>
                                    <TableCell>{venta.hora}</TableCell>
                                    <TableCell>{venta.subtotal}</TableCell>
                                    <TableCell>{venta.total}</TableCell>
                                    <TableCell>{cuentas.find(c => c.numeroCuenta === venta.cuenta)?.nombreAsociado || venta.cuenta}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(venta)}>Editar</Button>
                                        <Button onClick={() => handleDelete(venta.numeroTransaccion)}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    {editando ? 'Editar Venta' : 'Nueva Venta'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        name="cliente"
                        label="Cliente"
                        value={nuevaVenta.cliente}
                        onChange={handleInputChange}
                    >
                        {clientes.map((cliente) => (
                            <MenuItem key={cliente.cedula} value={cliente.cedula}>
                                {cliente.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        margin="normal"
                        name="fecha"
                        label="Fecha"
                        type="date"
                        value={nuevaVenta.fecha}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="hora"
                        label="Hora"
                        type="time"
                        value={nuevaVenta.hora}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="subtotal"
                        label="Subtotal"
                        type="number"
                        value={nuevaVenta.subtotal}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="total"
                        label="Total (con IVA)"
                        type="number"
                        value={nuevaVenta.total}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        name="cuenta"
                        label="Cuenta"
                        value={nuevaVenta.cuenta}
                        onChange={handleInputChange}
                    >
                        {cuentas.map((cuenta) => (
                            <MenuItem key={cuenta.numeroCuenta} value={cuenta.numeroCuenta}>
                                {cuenta.nombreAsociado}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {editando ? 'Actualizar Venta' : 'Crear Venta'}
                    </Button>
                    {editando && (
                        <Button onClick={resetForm} variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
                            Cancelar
                        </Button>
                    )}
                </form>
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
}

export default Ventas;