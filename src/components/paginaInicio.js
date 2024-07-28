import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    Container,
    Box,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import LandscapeIcon from '@mui/icons-material/Landscape';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Ventas from './ventas';
import Compras from './compras';
import Clientes from './clientes';
import Proveedores from './proveedores';
import Cuentas from './cuentas';
import InformeDiario from './informeDiario';
import InformeMensual from './informeMensual';

function Header({ setActiveComponent }) {
    const menuItems = [
        { label: 'Ventas', component: 'Ventas' },
        { label: 'Compras', component: 'Compras' },
        { label: 'Clientes', component: 'Clientes' },
        { label: 'Proveedores', component: 'Proveedores' },
        { label: 'Cuentas', component: 'Cuentas' },
        { label: 'Informe diario', component: 'InformeDiario' },
        { label: 'Informe mensual', component: 'InformeMensual' },
    ];

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LandscapeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        JABED
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.label}
                                onClick={() => setActiveComponent(item.component)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

function HomePage() {
    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Bienvenido al Sistema de Gestión de JABED
            </Typography>
            <Typography variant="h6" gutterBottom>
                Su plataforma integral para el control de ventas, compras y finanzas
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Características Principales
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <ShoppingCartIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Gestión de Ventas y Compras" 
                                    secondary="Realice operaciones CRUD para ventas, compras, clientes y proveedores."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Administración de Clientes y Proveedores" 
                                    secondary="Mantenga actualizada su base de datos de contactos comerciales."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AttachMoneyIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Control de Cuentas" 
                                    secondary="Gestione sus cuentas financieras con facilidad."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Informes Detallados" 
                                    secondary="Acceda a informes diarios y mensuales para un análisis profundo de sus operaciones."
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Cómo Empezar
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Utilice el menú de navegación para acceder a las diferentes secciones del sistema:
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <ShoppingCartIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Ventas y Compras" 
                                    secondary="Registre nuevas transacciones o modifique las existentes."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Clientes y Proveedores" 
                                    secondary="Gestione su cartera de clientes y proveedores."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AssessmentIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Informes" 
                                    secondary="Analice sus ventas diarias o mensuales con filtros personalizados."
                                />
                            </ListItem>
                        </List>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            ¿Necesita ayuda? Nuestro equipo de soporte está disponible para asistirle en cualquier momento.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

function PaginaInicio() {
    const [activeComponent, setActiveComponent] = useState(null);

    return (
        <div>
            <Header setActiveComponent={setActiveComponent} />
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {activeComponent === null ? (
                    <HomePage />
                ) : activeComponent === 'Ventas' ? (
                    <Ventas />
                ) : activeComponent === 'Compras' ? (
                    <Compras />
                ) : activeComponent === 'Clientes' ? (
                    <Clientes />
                ) : activeComponent === 'Proveedores' ? (
                    <Proveedores />
                ) : activeComponent === 'Cuentas' ? (
                    <Cuentas />
                ) : activeComponent === 'InformeDiario' ? (
                    <InformeDiario />
                ) : activeComponent === 'InformeMensual' ? (
                    <InformeMensual />
                ) : (
                    <Typography variant="h5">
                        Componente {activeComponent} en construcción...
                    </Typography>
                )}
            </Container>
        </div>
    );
}

export default PaginaInicio;