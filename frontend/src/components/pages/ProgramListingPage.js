import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// This component displays the list of available programs
function ProgramListingPage() {
  const { programs } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to courses page with selected program
  const handleViewCourses = (programCode) => {
    navigate('/courses', { state: { selectedProgram: programCode } });
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Software Development Programs
        </Typography>
        <Box display="flex" justifyContent="center" mb={4}>
          <TextField
            variant="outlined"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
            style={{ maxWidth: 500, width: '100%' }}
          />
        </Box>
        <Grid container spacing={4}>
          {filteredPrograms.map((program) => (
            <Grid item key={program.code} xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {program.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {program.code}
                  </Typography>
                  <Typography variant="body2" component="p">
                    <strong>Duration:</strong> {program.duration}
                  </Typography>
                  <Typography variant="body2" component="p">
                    <strong>Description:</strong> {program.description}
                  </Typography>
                  <Typography variant="body2" component="p">
                    <strong>Fees (Domestic):</strong> ${program.feesDomestic.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" component="p">
                    <strong>Fees (International):</strong> ${program.feesInternational.toLocaleString()}
                  </Typography>
                </CardContent>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewCourses(program.code)}
                >
                  View Courses
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default ProgramListingPage;