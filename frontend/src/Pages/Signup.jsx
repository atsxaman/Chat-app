import React, { useState } from 'react';
import '../App.css';
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import {TailSpin}  from 'react-loader-spinner';


const Signup = () => {

  
  const navigate =useNavigate();
  const [username,setUserName] = useState('');
  const [number,setNumber] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [errors,setErrors] = useState({});


  // CODE TO SHOW ERRORS WHEN ALL FIELDS ARE EMPTY  //
const validate = () => {
  let validationErrors = {};

  if(!username){
    validationErrors.username = '* Username is required *';
  }

  if(!number){
    validationErrors.number = '* Number is required *';
  }

  if(!password){
    validationErrors.password = '* Password is required *';
  }

  return validationErrors;

};





// CODE TO SIGNUP USER //
const handleSignup = async () => {

  // SHOW ERRORS WHEN ALL FIELDS ARE EMPTY //
  const validationErrors = validate();
  if(Object.keys(validationErrors).length){
    setErrors(validationErrors);
    return;
  }

 // REGEX FOR STRONG PASSWORD MUST BE AT LEAST 2 CAPITAL 2 SPECIAL CHARACTERS //
 const passwordRegex = /^(?=.*[A-Z].*[A-Z])(?=.*[a-z].*[a-z])(?=.*[^a-zA-Z0-9]).{5,}$/;


 if(!passwordRegex.test(password)){
  swal({
    title: 'Password must contains atleast 2 Uppercase 2 Lowercase and 1 special Characters ',
    icon: 'error',
    buttons: false,
    timer: 2000
  });
  return ;
 }


 if(number.length !== 10){
  swal({
    title: 'Invalid Number',
    text: 'mobile number must contains 10 digits',
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


  // THIS IS THE MAIN CODE TO SIGNUP USER  //
  try{

    setLoading(true);

    const result = await axios.post('http://localhost:5000/auth/signup', {
      username,
      number,
      password
    });

  swal({
    title:'User registerd successfully',
    icon: 'success',
    buttons: false,
    timer: 2000
  });
  
  navigate('/login');

  }catch(err){
    if(err.response && err.response.status === 400 && err.response.data.message === 'username already exists'){
      swal({
        title:'Username already exists',
        text: `${username} userName is already taken. Please choose a different username.`,
        icon:'error',
        buttons:false,
        timer: 3000
      })
    }

   else if(err.response && err.response.status === 400 && err.response.data.message === 'number already exists'){
    swal({
      title:'number already exists',
      text: `${number} is already taken please choose a different number `,
      icon:'error',
      buttons:false,
      timer: 3000
    })
   }
  } finally{
    setLoading(false)
  }
}


  return (
    <>
    
    <div className='signup-bgcolor h-[600px] w-full fixed'>

    {
      loading ? 
      (
       <div className='grid justify-center mt-16'>
       <span className='py-8 font-bold'>Posting...</span>
       <TailSpin color='white' height={80} />
       </div>
      )
      :
      (
              <div style={{backgroundColor:'rgb(16,16,13,0.8)'}} className='rounded-lg w-[95%] md:w-[40%] m-auto p-4 mt-14'>
      <h1 className='font-thin text-sky-500 text-3xl text-center py-1'>Signup</h1>

      <div className='grid m-4'>
        <label className='p-1 text-white'>username</label>
        <input 
        value={username} onChange={(e)=> setUserName(e.target.value)}
        className='border rounded-lg p-2' type='text' placeholder='enter name' />
          {errors.username && <p className='text-red-500 text-center'>{errors.username}</p>}
      </div>

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

      <button className='bg-emerald-600 text-white px-2 py-1 flex m-auto rounded-lg hover:bg-emerald-700' onClick={handleSignup}>Signup</button>

      <p className='text-center my-4 text-white'>Already have an account ? <Link to='/login' className='underline text-sky-600'>Login</Link></p>

    </div>
      )
    }

    </div>
    
    </>
  )
}

export default Signup