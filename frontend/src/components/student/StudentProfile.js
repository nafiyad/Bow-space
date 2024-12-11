import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Divider,
    Paper
} from '@mui/material';
import { useUserContext } from '../../context/UserContext';

function StudentProfile() {
    const { currentUser } = useUserContext();

    if (!currentUser) {
        return (
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography>Loading profile...</Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Student Profile
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Personal Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        First Name
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {currentUser.firstName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Last Name
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {currentUser.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {currentUser.email}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Username
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {currentUser.username}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Role
                                    </Typography>
                                    <Typography variant="body1" gutterBottom sx={{ textTransform: 'capitalize' }}>
                                        {currentUser.role}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Account Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Account Created
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {new Date(currentUser.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Account Status
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        color="success.main" 
                                        gutterBottom
                                        sx={{ fontWeight: 'medium' }}
                                    >
                                        Active
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentProfile;
