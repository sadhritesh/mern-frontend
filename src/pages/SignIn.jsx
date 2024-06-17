import React, { useEffect, useState } from 'react';
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from '../hooks/useToast';
import { 
  signInStart, 
  signInSuccess, 
  signInFailure
} from "../redux/features/userSlice.js";
import { useSelector, useDispatch } from 'react-redux';

export default function SignIn() {

  const { successToast, errorToast } = useToast()
  const [ formData, setFormData ] = useState({})
  const navigate = useNavigate()
  const { currentUser, error, loading, success } = useSelector( state => state.user )
  const dispatch = useDispatch()

  const handleChange = (e) => {
      setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (loading) {
      return null
    }
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("All the fields are required"))
      return null
    }
    
    try {
      dispatch(signInStart())
      const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const jsonResponse = await response.json()

      if (jsonResponse.success === false) {
        dispatch(signInFailure(jsonResponse.message))
        throw new Error(jsonResponse.message)
      }
      console.log(jsonResponse);
      dispatch(signInSuccess(jsonResponse.data._doc))
      successToast(jsonResponse.message)
      navigate('/')
    } catch (err) {
      errorToast(err.message)
      dispatch(signInFailure(err.message))
    }
  }

  return (
    <div className='mx-auto max-w-3xl mt-[3rem] md:mt-[7rem] flex flex-col md:flex-row'>
      {/* left-part */}
      <div className='py-[5rem] px-[3rem] flex-1'>
          <div className='font-bold text-4xl'>
            <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white py-2 px-3'>Sadh's</span>
            Blog
          </div>
          <p className='mt-[1rem]'>
          This is a demo project. You can sign in with your email and password or with Google.
          </p>
      </div>
      {/* right-part */}
      <div className='flex-1 px-[3rem] md:px-1'>
          <form onSubmit={handleSubmit}>
            <div  className='mt-[1rem]'>
              <Label htmlFor='email' value='Your email'  />
            </div>
            <TextInput id='email' type='email' placeholder='JohnDoe@gmail.com' onChange={handleChange} required/>
            <div  className='mt-[1rem]'>
              <Label htmlFor='password' value='Your password'/>
            </div>
            <TextInput id='password' type='password' placeholder='12348ssds122' onChange={handleChange}  required />
              
            <Button type='submit' className='w-full mt-[2rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' >
            {
              loading ? 
              <Spinner aria-label="Small spinner example" size="sm" />
              :
              "Sign In"
            }
            </Button>
          </form>
          <p className='my-1'>Not have an account 
            <Link to="/signup" className='text-sky-600 px-1'>signup</Link>
          </p>
      </div>
    </div>
   
  )
}
