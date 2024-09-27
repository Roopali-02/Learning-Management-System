import React, { useState,useEffect } from 'react';
import { Container, Box, TextField, Button, MenuItem, Typography,Alert } from '@mui/material';
import axios from 'axios';
import { breadCrumb } from '../../components/globalFunctions/functions';

const AddCourse = () => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category: '',
    instructor: '',
    startDate: '',
    endDate: '',
    level: '',
  });
  const [alert,setAlert] = useState({show:false,type:'',message:''});
  const categories = ['Programming', 'Mathematics', 'Design'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const links = [{ id: 2, href: '/dashboard', title: 'Dashboard', color: '#5691c8' }, { id: 3, href: '/add-course', title: 'Add Course', color: '#5691c8' }];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value,
    });
  };

  useEffect(()=>{
    let timer;
    if (alert.show){
     timer= setTimeout(()=>{
       setAlert({ show: false, type: '', message: '' })
     },3000)
    }
    return ()=>clearTimeout(timer);
  },[alert])

  const handleSubmit =async (e) => {
    e.preventDefault();
    const payload = course;
    try{
      await axios.post('/api/add-course',payload);
      setAlert({
        show: true,
        type: 'success',
        message: 'Course added successfully!'
      })
    }catch(err){
       setAlert({
         show: true,
         type: 'error',
         message: 'Error adding course'
       })
    }finally{
      setCourse({
        title: '',
        description: '',
        category: '',
        instructor: '',
        startDate: '',
        endDate: '',
        level: '',
      })
    }
  };

  const today = new Date().toISOString().split('T')[0];
  return (
    <Container maxWidth="lg" className="bg-customBg p-4 mt-16 z-0">
    <Box className='flex justify-evenly items-center '>
        <Typography variant="h5" gutterBottom>Add a New Course</Typography>
        <Box className='flex justify-end'>{breadCrumb(links)}</Box>
    </Box>
     
    
      {
        alert.show&&<Alert severity={alert.type} className='my-2'>{alert.message}</Alert>
      }
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <TextField
            label="Course Title"
            name="title"
            value={course.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            size='small'
          />
          <TextField
            label="Description"
            name="description"
            value={course.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            required
          />
          <TextField
            select
            label="Category"
            name="category"
            value={course.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            size='small'
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Instructor Name"
            name="instructor"
            value={course.instructor}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            size='small'
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={course.startDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            size='small'
            required
            inputProps={{
              min: today, // Disable past dates
            }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={course.endDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            size='small'
            required
            inputProps={{ min: today }}
          />
          <TextField
            select
            label="Course Level"
            name="level"
            value={course.level}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size='small'
            required
          >
            {levels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, textTransform: 'none', background: '#614385' }}
            >
              Add Course
            </Button>
          </Box>

        </form>
      </Container>
    </Container>
  )
}

export default AddCourse