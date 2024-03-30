import React, { useState } from 'react';
import '../App.css';
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';



const Login = () => {

  const navigate =useNavigate();
  const [number,setNumber] = useState('');
  const [password,setPassword] = useState('');
  const [errors,setErrors] = useState({});


  // CODE TO SHOW ERRORS WHEN ALL FIELDS ARE EMPTY  //
  const validate = () => {
  let validationErrors = {};
  if(!number){
    validationErrors.number = '* Number is required *';
  }
  if(!password){
    validationErrors.password = '* Password is required *';
  }
  return validationErrors;
};


    // CODE TO LOGIN USER   //
    const handleLogin = async() => {
      // SHOW ERRORS WHEN ALL FIELDS ARE EMPTY //
      const validationErrors = validate();
      if(Object.keys(validationErrors).length){
        setErrors(validationErrors);
        return;
      }
  
      if(number.length !== 10){
        swal({
          title: 'Invalid Number',
          icon: 'error',
          buttons: false,
          timer: 2000
        });
        return ;
       }
      
       if(password.length < 8){
        swal({
          title: 'Password must be atlest 8 letters strong',
          icon: 'error',
          buttons: false,
          timer: 2000
        });
        return ;
       }
    
    
       // MAIN CODE TO LOGIN USER  //
       try{
        const result = await axios.post('http://localhost:5000/auth/login',{number,password});
    
        if(result.data.status === 'success'){
          swal({
            title: 'Logged in',
            icon: 'success',
            buttons: false,
            timer: 2000
          });
    
          localStorage.setItem('jwt',result.data.token);
          localStorage.setItem('user',JSON.stringify(
            result.data.user
          ));
          navigate('/');
          window.location.reload();
        }
    
       }catch (err) {
        swal({
          title: 'User not found',
          text: 'Please check your credentials and try again',
          icon: 'error',
          buttons: false,
          timer: 2000
        });
       }
    
      };


  return (
    <>
    
    <div className='login-bgcolor h-[600px] w-full fixed'>

        <div style={{backgroundColor:'rgb(16,16,13,0.8)'}} className='rounded-lg w-[95%] md:w-[40%] m-auto p-4 mt-24'>
      <h1 className='font-thin text-sky-500 text-3xl text-center py-1'>Login</h1>


      <div className='grid m-4'>
        <label className='p-1 text-white'>Number</label>
        <input 
         value={number} onChange={(e) => setNumber(e.target.value)}
        className='border rounded-lg p-2' type='number' placeholder='enter Number' />
         {errors.number && <p className='text-red-500 text-center'>{errors.number}</p>}
      </div>

      <div className='grid m-4'>
        <label className='p-1 text-white'>Password</label>
        <input
        value={password} onChange={(e)=>setPassword(e.target.value)}
        className='border rounded-lg p-2' type='password' placeholder='enter Password' />
         {errors.password && <p className='text-red-500 text-center'>{errors.password}</p>}
      </div>

      <button className='bg-emerald-600 text-white px-2 py-1 flex m-auto rounded-lg hover:bg-emerald-700' onClick={handleLogin}>Login</button>

      <p className=' text-white text-center my-4'>Don't have an account ? <Link to='/signup' className='underline text-sky-600'>Signup</Link></p>

    </div>
      
    </div>
    
    </>
  )
}

export default Login