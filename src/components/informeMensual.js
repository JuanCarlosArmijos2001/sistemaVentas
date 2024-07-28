import React, { useState, useEffect, useRef } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TextField,
    Box,
    Button
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';

function InformeMensual() {
    const [informes, setInformes] = useState([]);
    const [filteredInformes, setFilteredInformes] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [totales, setTotales] = useState({
        subtotal: 0,
        total: 0,
        cantidadVentas: 0,
        cantidadCompras: 0
    });

    const targetRef = useRef();
    const { toPDF, targetRef: pdfTargetRef } = usePDF({filename: 'informe_mensual.pdf'});

    useEffect(() => {
        fetchInformeMensual();
    }, []);

    useEffect(() => {
        filterInformes();
    }, [selectedMonth, informes]);

    const fetchInformeMensual = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/informes/informeMensual');
            setInformes(response.data);
            setFilteredInformes(response.data);
        } catch (error) {
            console.error('Error al obtener informe mensual:', error);
        }
    };

    const filterInformes = () => {
        let filtered = informes;
        if (selectedMonth) {
            filtered = informes.filter(informe => 
                new Date(informe.fechaDia).getMonth() === selectedMonth.getMonth() &&
                new Date(informe.fechaDia).getFullYear() === selectedMonth.getFullYear()
            );
        }
        setFilteredInformes(filtered);
        calculateTotals(filtered);
    };

    const calculateTotals = (data) => {
        const totals = data.reduce((acc, informe) => ({
            subtotal: acc.subtotal + Number(informe.subtotal),
            total: acc.total + Number(informe.total),
            cantidadVentas: acc.cantidadVentas + Number(informe.cantidadVentas),
            cantidadCompras: acc.cantidadCompras + Number(informe.cantidadCompras)
        }), { subtotal: 0, total: 0, cantidadVentas: 0, cantidadCompras: 0 });

        setTotales(totals);
    };

    const handleMonthChange = (newValue) => {
        setSelectedMonth(newValue);
    };

    const formatNumber = (value) => {
        const number = Number(value);
        return isNaN(number) ? '0.00' : number.toFixed(2);
    };

    const handleExportPdf = () => {
        toPDF();
    };

    return (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Informe Mensual
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Filtrar por mes"
                        views={['year', 'month']}
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Button variant="contained" color="primary" onClick={handleExportPdf}>
                    Exportar a PDF
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }} ref={targetRef}>
                <Table stickyHeader ref={pdfTargetRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Cantidad de Ventas</TableCell>
                            <TableCell>Cantidad de Compras</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInformes.map((informe, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(informe.fechaDia).toLocaleDateString()}</TableCell>
                                <TableCell>${formatNumber(informe.subtotal)}</TableCell>
                                <TableCell>${formatNumber(informe.total)}</TableCell>
                                <TableCell>{informe.cantidadVentas}</TableCell>
                                <TableCell>{informe.cantidadCompras}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell><strong>Totales</strong></TableCell>
                            <TableCell><strong>${formatNumber(totales.subtotal)}</strong></TableCell>
                            <TableCell><strong>${formatNumber(totales.total)}</strong></TableCell>
                            <TableCell><strong>{totales.cantidadVentas}</strong></TableCell>
                            <TableCell><strong>{totales.cantidadCompras}</strong></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default InformeMensual;