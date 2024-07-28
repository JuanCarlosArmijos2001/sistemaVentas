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

function InformeDiario() {
    const [informes, setInformes] = useState([]);
    const [filteredInformes, setFilteredInformes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [totales, setTotales] = useState({
        ingreso: 0,
        egreso: 0,
        subtotal: 0,
        total: 0
    });

    const targetRef = useRef();
    const { toPDF, targetRef: pdfTargetRef } = usePDF({filename: 'informe_diario.pdf'});

    useEffect(() => {
        fetchInformeDiario();
    }, []);

    useEffect(() => {
        filterInformes();
    }, [selectedDate, informes]);

    const fetchInformeDiario = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/informes/informeDiario');
            setInformes(response.data);
            setFilteredInformes(response.data);
        } catch (error) {
            console.error('Error al obtener informe diario:', error);
        }
    };

    const filterInformes = () => {
        let filtered;
        if (selectedDate) {
            filtered = informes.filter(informe => 
                new Date(informe.fecha).toDateString() === selectedDate.toDateString()
            );
        } else {
            filtered = informes;
        }
        setFilteredInformes(filtered);
        calculateTotals(filtered);
    };

    const calculateTotals = (data) => {
        const totals = data.reduce((acc, informe) => ({
            ingreso: acc.ingreso + (Number(informe.ingreso) || 0),
            egreso: acc.egreso + (Number(informe.egreso) || 0),
            subtotal: acc.subtotal + (Number(informe.subtotal) || 0),
            total: acc.total + (Number(informe.total) || 0)
        }), { ingreso: 0, egreso: 0, subtotal: 0, total: 0 });

        setTotales(totals);
    };

    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
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
                Informe Diario
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Filtrar por fecha"
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Button variant="contained" color="primary" onClick={handleExportPdf}>
                    Exportar a PDF
                </Button>
            </Box>
            <Typography variant="subtitle1" gutterBottom>
                Total {selectedDate ? 'del día' : 'general'}: ${formatNumber(totales.total)}
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }} ref={targetRef}>
                <Table stickyHeader ref={pdfTargetRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Número de Transacción</TableCell>
                            <TableCell>Tipo de Transacción</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Cuenta</TableCell>
                            <TableCell>Ingreso</TableCell>
                            <TableCell>Egreso</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInformes.map((informe) => (
                            <TableRow key={informe.numeroTransaccion}>
                                <TableCell>{informe.numeroTransaccion}</TableCell>
                                <TableCell>{informe.tipoTransaccion}</TableCell>
                                <TableCell>{new Date(informe.fecha).toLocaleDateString()}</TableCell>
                                <TableCell>{informe.cuenta}</TableCell>
                                <TableCell>${formatNumber(informe.ingreso)}</TableCell>
                                <TableCell>${formatNumber(informe.egreso)}</TableCell>
                                <TableCell>${formatNumber(informe.subtotal)}</TableCell>
                                <TableCell>${formatNumber(informe.total)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4}><strong>Totales</strong></TableCell>
                            <TableCell><strong>${formatNumber(totales.ingreso)}</strong></TableCell>
                            <TableCell><strong>${formatNumber(totales.egreso)}</strong></TableCell>
                            <TableCell><strong>${formatNumber(totales.subtotal)}</strong></TableCell>
                            <TableCell><strong>${formatNumber(totales.total)}</strong></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default InformeDiario;