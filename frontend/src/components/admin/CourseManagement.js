import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

function CourseManagement() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    term: '',
    program: '',
    description: '',
    capacity: 30
  });

  // Fetch courses and programs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesData, programsData] = await Promise.all([
          courseService.getAllCourses(),
          courseService.getAllPrograms()
        ]);
        setCourses(coursesData);
        setPrograms(programsData);
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        code: course.code,
        name: course.name,
        term: course.term,
        program: course.program,
        description: course.description || '',
        capacity: course.capacity
      });
    } else {
      setEditingCourse(null);
      setFormData({
        code: '',
        name: '',
        term: '',
        program: '',
        description: '',
        capacity: 30
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      code: '',
      name: '',
      term: '',
      program: '',
      description: '',
      capacity: 30
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.code || !formData.name || !formData.term || !formData.program) {
      return 'Please fill in all required fields';
    }
    if (formData.capacity < 1) {
      return 'Capacity must be at least 1';
    }
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
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.code, formData);
      } else {
        await courseService.addCourse(formData);
      }
      
      // Refresh courses list
      const updatedCourses = await courseService.getAllCourses();
      setCourses(updatedCourses);
      
      handleCloseDialog();
      setError('');
    } catch (err) {
      console.error('Error saving course:', err);
      setError(err.response?.data?.msg || 'Failed to save course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      setLoading(true);
      await courseService.deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      setError('');
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(err.response?.data?.msg || 'Failed to delete course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const termMatch = !selectedTerm || course.term === selectedTerm;
    const programMatch = !selectedProgram || course.program === selectedProgram;
    return termMatch && programMatch;
  });

  if (loading && courses.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Course Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Course
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Term</InputLabel>
            <Select
              value={selectedTerm}
              label="Filter by Term"
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <MenuItem value="">All Terms</MenuItem>
              <MenuItem value="Winter">Winter</MenuItem>
              <MenuItem value="Spring">Spring</MenuItem>
              <MenuItem value="Summer">Summer</MenuItem>
              <MenuItem value="Fall">Fall</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Program</InputLabel>
            <Select
              value={selectedProgram}
              label="Filter by Program"
              onChange={(e) => setSelectedProgram(e.target.value)}
            >
              <MenuItem value="">All Programs</MenuItem>
              {programs.map(program => (
                <MenuItem key={program.code} value={program.code}>
                  {program.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Term</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Enrolled</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.term}</TableCell>
                <TableCell>{course.program}</TableCell>
                <TableCell>{course.capacity}</TableCell>
                <TableCell>{course.enrolled || 0}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(course)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteCourse(course.id)}
                    color="error"
                    disabled={course.enrolled > 0}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="code"
                  label="Course Code"
                  value={formData.code}
                  onChange={handleInputChange}
                  disabled={Boolean(editingCourse)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Course Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Term</InputLabel>
                  <Select
                    name="term"
                    value={formData.term}
                    label="Term"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Winter">Winter</MenuItem>
                    <MenuItem value="Spring">Spring</MenuItem>
                    <MenuItem value="Summer">Summer</MenuItem>
                    <MenuItem value="Fall">Fall</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Program</InputLabel>
                  <Select
                    name="program"
                    value={formData.program}
                    label="Program"
                    onChange={handleInputChange}
                  >
                    {programs.map(program => (
                      <MenuItem key={program.code} value={program.code}>
                        {program.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="capacity"
                  label="Capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default CourseManagement;
