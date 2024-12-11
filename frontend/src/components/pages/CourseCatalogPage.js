import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// This component displays the catalog of all courses
function CourseCatalogPage() {
  const { courses, programs } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const location = useLocation();

  // Set selected program if passed from another page
  useEffect(() => {
    if (location.state && location.state.selectedProgram) {
      setSelectedProgram(location.state.selectedProgram);
    }
  }, [location]);

  // Group courses by program
  const groupedCourses = useMemo(() => {
    return courses.reduce((acc, course) => {
      if (!acc[course.program]) {
        acc[course.program] = [];
      }
      acc[course.program].push(course);
      return acc;
    }, {});
  }, [courses]);

  // Filter courses based on search term and selected program
  const filteredCourses = useMemo(() => {
    return Object.entries(groupedCourses).reduce((acc, [program, programCourses]) => {
      if (selectedProgram && selectedProgram !== program) {
        return acc;
      }
      const filtered = programCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[program] = filtered;
      }
      return acc;
    }, {});
  }, [groupedCourses, searchTerm, selectedProgram]);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Course Catalog
        </Typography>
        <Box display="flex" justifyContent="center" mb={4}>
          <TextField
            variant="outlined"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
            style={{ width: '50%', marginRight: '1rem' }}
          />
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel id="program-select-label">Program</InputLabel>
            <Select
              labelId="program-select-label"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              label="Program"
            >
              <MenuItem value="">All Programs</MenuItem>
              {programs.map((program) => (
                <MenuItem key={program.code} value={program.code}>{program.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {Object.entries(filteredCourses).map(([program, programCourses]) => (
          <Accordion key={program} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{programs.find(p => p.code === program)?.name || program}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={4}>
                {programCourses.map((course) => (
                  <Grid item key={course.id} xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="h2">
                          {course.name}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                          {course.code}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Term: {course.term}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {course.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}

export default CourseCatalogPage;
