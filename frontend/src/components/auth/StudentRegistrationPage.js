import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';

function StudentRegistrationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    program: '',
    birthday: ''
  });

  // Define available programs
  const programs = [
    { code: 'SD-DIP', name: 'Software Development - Diploma' },
    { code: 'SD-PD', name: 'Software Development - Post-Diploma' },
    { code: 'SD-CERT', name: 'Software Development - Certificate' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
        // Format phone number as (XXX) XXX-XXXX
        const numbers = value.replace(/[^\d]/g, '');
        if (numbers.length <= 10) {
            let formatted = numbers;
            if (numbers.length > 3) {
                formatted = `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
            }
            if (numbers.length > 6) {
                formatted = `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6)}`;
            }
            setFormData(prev => ({
                ...prev,
                [name]: formatted
            }));
        }
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      return 'Invalid email address';
    }
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.birthday) return 'Birthday is required';
    if (!formData.program) return 'Program is required';
    if (!formData.username.trim()) return 'Username is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    
    // Additional validations
    if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
        return 'Phone number must be 10 digits';
    }
    
    const birthDate = new Date(formData.birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 16) return 'Must be at least 16 years old';
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
        setError(validationError);
        return;
    }

    try {
        setLoading(true);
        setError('');
        
        // Format the data before sending
        const formattedData = {
            ...formData,
            phone: formData.phone.replace(/[^0-9]/g, ''), // Remove non-numeric characters
            birthday: new Date(formData.birthday).toISOString().split('T')[0] // Format date as YYYY-MM-DD
        };
        
        const response = await authService.registerStudent(formattedData);
        console.log('Registration successful:', response);
        
        navigate('/login', { 
            state: { message: 'Registration successful! Please login.' }
        });
    } catch (err) {
        console.error('Registration error:', err);
        setError(typeof err === 'string' ? err : (err.msg || 'Registration failed. Please try again.'));
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Student Registration
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Program</InputLabel>
                <Select
                  name="program"
                  value={formData.program}
                  label="Program"
                  onChange={handleChange}
                >
                  {programs.map(program => (
                    <MenuItem key={program.code} value={program.code}>
                      {program.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default StudentRegistrationPage;
