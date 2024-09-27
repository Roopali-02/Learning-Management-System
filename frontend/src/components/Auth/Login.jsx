import React, { useState } from 'react';
import {
  Container,
  Box,
  OutlinedInput,
  InputAdornment,
  Button,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { commonContainer } from '../globalFunctions/functions';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({email: '', password: ''})
  const [alert,setAlert] = useState({show:false,type:'',message:''})
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response =await axios.post('/api/auth/login',formValues);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data?.user));
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 0);
      setAlert({ show: true, type: 'success', message: 'Login successful. You will be redirected now to your dashboard.' })
      setTimeout(()=>{
        navigate('/dashboard');
      },4000)
    }catch(err){
      setAlert({
        show: true,
        type: 'error',
        message: 'Error!Please try again.'
      })
    }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container maxWidth='xs' className='py-4 mt-16 bg-customBg'>
      {commonContainer('login')}
     
      {alert.show &&<Alert severity={alert.type}>{alert.message}</Alert>}
      <form onSubmit={handleSubmit}>
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
          sx={{ mt: 3, mb: 3 }}
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
          sx={{ mb: 4 }}
        />
        <Box className='flex flex-col gap-y-3'>
          <Button type='submit' variant='contained' sx={{ textTransform: 'none', background: '#000' }} fullWidth>Login</Button>
          <Divider className='py-3 font-semibold'>Dont have an account?</Divider>
          <Button variant='contained' sx={{ textTransform: 'none', background: '#000' }} onClick={() => navigate('/signup')} fullWidth> Signup</Button>
        </Box>
       
      </form>

    </Container>
  )
}

export default Login