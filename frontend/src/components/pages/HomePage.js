import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Container, 
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/system';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Footer from '../layout/Footer';

// Styled components for the home page
const HeroSection = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  backgroundImage: 'url(https://source.unsplash.com/random?coding)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12),
    paddingRight: 0,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

// Home page component
function HomePage() {
  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <HeroContent>
            <Typography component="h1" variant="h2" color="inherit" gutterBottom>
              Bow Course Registration
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Software Development Department Course Management System
            </Typography>
            <Button variant="contained" color="primary" component={RouterLink} to="/signup" size="large">
              Sign Up Now
            </Button>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        {/* SD Programs section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SchoolIcon color="primary" fontSize="large" />
                  <Typography variant="h5" component="h2" ml={1}>
                    SD Programs
                  </Typography>
                </Box>
                <List>
                  {['Diploma (2 years)', 'Post-Diploma (1 year)', 'Certificate (6 months)'].map((item, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </StyledCard>
          </Grid>
          {/* Terms section */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <EventIcon color="primary" fontSize="large" />
                  <Typography variant="h5" component="h2" ml={1}>
                    Terms
                  </Typography>
                </Box>
                <List>
                  {[
                    'Spring: March - June',
                    'Summer: June - August',
                    'Fall: September - December',
                    'Winter: January - March'
                  ].map((item, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </StyledCard>
          </Grid>
          {/* Sign Up Process section */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonAddIcon color="primary" fontSize="large" />
                  <Typography variant="h5" component="h2" ml={1}>
                    Sign Up Process
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Provide your details including First Name, Last Name, Email, Phone, Birthday, Program, Username, and Password. After signing up, you'll receive a Student ID and be redirected to your dashboard.
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Call to action */}
        <Box my={8} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Ready to Start Your SD Journey?
          </Typography>
          <Button variant="contained" color="primary" component={RouterLink} to="/signup" size="large">
            Sign Up Now
          </Button>
        </Box>
      </Container>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default HomePage;
