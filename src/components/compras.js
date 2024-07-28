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

function Compras() {
    const [compras, setCompras] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [nuevaCompra, setNuevaCompra] = useState({
        proveedor: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
        subtotal: 0,
        total: 0,
        cuenta: '',
        numeroTransaccion: null
    });
    const [editando, setEditando] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        fetchCompras();
        fetchProveedores();
        fetchCuentas();
    }, []);

    const fetchCompras = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/compras');
            setCompras(response.data);
        } catch (error) {
            console.error('Error al obtener compras:', error);
            showSnackbar('Error al obtener compras', 'error');
        }
    };

    const fetchProveedores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/proveedores');
            setProveedores(response.data);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
            showSnackbar('Error al obtener proveedores', 'error');
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
            setNuevaCompra({ ...nuevaCompra, subtotal, total: total.toFixed(2) });
        } else {
            setNuevaCompra({ ...nuevaCompra, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const compraData = {
                ...nuevaCompra,
                proveedor: nuevaCompra.proveedor
            };
            if (editando) {
                await axios.put(`http://localhost:5000/api/compras/${nuevaCompra.numeroTransaccion}`, compraData);
                showSnackbar('Compra actualizada con éxito', 'success');
            } else {
                await axios.post('http://localhost:5000/api/compras', compraData);
                showSnackbar('Compra creada con éxito', 'success');
            }
            fetchCompras();
            resetForm();
        } catch (error) {
            console.error('Error al guardar compra:', error.response ? error.response.data : error.message);
            showSnackbar('Error al guardar compra', 'error');
        }
    };

    const resetForm = () => {
        setNuevaCompra({
            proveedor: '',
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
            subtotal: 0,
            total: 0,
            cuenta: '',
            numeroTransaccion: null
        });
        setEditando(false);
    };

    const handleEdit = (compra) => {
        setNuevaCompra({
            ...compra,
            proveedor: compra.proveedor,
            fecha: compra.fecha.split('T')[0],
            hora: compra.hora.slice(0, 5)
        });
        setEditando(true);
    };

    const handleDelete = async (numeroTransaccion) => {
        try {
            await axios.delete(`http://localhost:5000/api/compras/${numeroTransaccion}`);
            fetchCompras();
            showSnackbar('Compra eliminada con éxito', 'success');
        } catch (error) {
            console.error('Error al eliminar compra:', error);
            showSnackbar('Error al eliminar compra', 'error');
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
                    Lista de Compras
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Número de Transacción</TableCell>
                                <TableCell>Proveedor (RUC)</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Hora</TableCell>
                                <TableCell>Subtotal</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Cuenta</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {compras.map((compra) => (
                                <TableRow key={compra.numeroTransaccion}>
                                    <TableCell>{compra.numeroTransaccion}</TableCell>
                                    <TableCell>{proveedores.find(p => p.ruc === compra.proveedor)?.empresa || compra.proveedor}</TableCell>
                                    <TableCell>{compra.fecha.split('T')[0]}</TableCell>
                                    <TableCell>{compra.hora}</TableCell>
                                    <TableCell>{compra.subtotal}</TableCell>
                                    <TableCell>{compra.total}</TableCell>
                                    <TableCell>{cuentas.find(c => c.numeroCuenta === compra.cuenta)?.nombreAsociado || compra.cuenta}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(compra)}>Editar</Button>
                                        <Button onClick={() => handleDelete(compra.numeroTransaccion)}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    {editando ? 'Editar Compra' : 'Nueva Compra'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        name="proveedor"
                        label="Proveedor"
                        value={nuevaCompra.proveedor}
                        onChange={handleInputChange}
                        required
                    >
                        {proveedores.map((proveedor) => (
                            <MenuItem key={proveedor.ruc} value={proveedor.ruc}>
                                {proveedor.empresa}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        margin="normal"
                        name="fecha"
                        label="Fecha"
                        type="date"
                        value={nuevaCompra.fecha}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="hora"
                        label="Hora"
                        type="time"
                        value={nuevaCompra.hora}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="subtotal"
                        label="Subtotal"
                        type="number"
                        value={nuevaCompra.subtotal}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        name="total"
                        label="Total (con IVA)"
                        type="number"
                        value={nuevaCompra.total}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        name="cuenta"
                        label="Cuenta"
                        value={nuevaCompra.cuenta}
                        onChange={handleInputChange}
                        required
                    >
                        {cuentas.map((cuenta) => (
                            <MenuItem key={cuenta.numeroCuenta} value={cuenta.numeroCuenta}>
                                {cuenta.nombreAsociado}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {editando ? 'Actualizar Compra' : 'Crear Compra'}
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

export default Compras;