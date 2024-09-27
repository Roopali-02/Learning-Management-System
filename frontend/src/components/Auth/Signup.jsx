import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import axios from 'axios';
import {
  commonContainer
} from '../globalFunctions/functions';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({show:false,type:'',message:''});
  const [formValues,setFormValues] = useState({name:'',email:'',password:'',role:''})

  const handleChange = (e)=>{
    const {name,value } = e.target;
    setFormValues((prev)=>({...prev,[name]:value}))
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response =await axios.post('/api/auth/signup',formValues);
      const data =  response.data;
      setAlert({ show: true, type: 'success', message: 'Signup successful! You will be redirected to the login page.' });
      setTimeout(()=>{
      navigate('/login');
      },5000)
    }catch(err){
      if (err.response && err.response.data) {
        setAlert({show:true, message: err.response.data.message,type:'error' })
      } else {
        setAlert({show: true, message: 'Something went wrong. Please try again.', type: 'error' })
      }
    }
  };
  
  return (
    
    <Container maxWidth='xs' className='py-4 mt-16 bg-customBg'>
        {
          commonContainer('signup')
        }
      {
        alert.show && <Alert severity={alert.type} className='my-2'>{alert.message}</Alert>
      }
      <form onSubmit={handleSubmit}>
        <OutlinedInput  
          fullWidth
          size='small'
          id='name'
          type='text'
          name='name'
          startAdornment={<InputAdornment position="start">Name</InputAdornment>}
          onChange={handleChange}
          value={formValues.name}
          required
          sx={{ mb: 2 }}
         />
        <OutlinedInput
          fullWidth
          size='small'
          id='email'
          type='email'
          name='email'
          startAdornment={<InputAdornment position="start">Email</InputAdornment>}
          onChange={handleChange}
          value={formValues.email}
          required
          sx={{ mb: 2 }}
        />
        <OutlinedInput
          fullWidth
          size='small'
          id='password'
          type={showPassword ? 'text' : 'password'}
          name='password'
          startAdornment={<InputAdornment position="start">Password</InputAdornment>}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          onChange={handleChange}
          value={formValues.password}
          required
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }} size='small'>
          <InputLabel id="role-label">Role</InputLabel>
        <Select 
          labelId="role-label"
          id='role'
          name='role'
          onChange={handleChange}
          value={formValues.role}
          label="Role"
          required
         >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="instructor">Instructor</MenuItem>
        </Select>
        </FormControl>

        <Box className='flex flex-col gap-y-2'>
          <Button type='submit' variant='contained' sx={{ textTransform: 'none', background: '#000' }} fullWidth> Sign Up</Button>
          <Divider className='py-3 font-semibold'>Already have an account?</Divider>
          <Button variant='contained' sx={{ textTransform: 'none', background: '#000' }} onClick={() => navigate('/login')} fullWidth> Login</Button>
        </Box>
      
      </form>
    
    </Container>
   
  )
}

export default Signup