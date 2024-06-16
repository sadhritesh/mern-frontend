import React, { useState } from 'react'
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from '../hooks/useToast';

export default function SignUp() {

  const { successToast, errorToast } = useToast()
  const [ formData, setFormData ] = useState({})
  const navigate = useNavigate()

  const [ loading, setLoading ] = useState(false)

  const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        if (loading) {
          return null
        }

        if (!formData.username || !formData.email || !formData.password) {
            error("all fields are required")
            setLoading(false)
            return null 
        }

        try {
          const response = await fetch("/api/v1/auth/signup",{
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          })

          const data = await response.json()

          setLoading(false)

          if (data.success === false) {
            throw new Error(data.message)
          }
          successToast(data.message)
          
          if (response.ok) {
            navigate('/signin')
          }
        } catch (err) {
          setLoading(false)
          errorToast(err.message)
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
          This is a demo project. You can sign up with your email and password or with Google.
          </p>
      </div>
      {/* right-part */}
      <div className='flex-1 px-[3rem] md:px-1'>
          <form onSubmit={handleSubmit}>
            <div className='mt-[1rem]'>
              <Label htmlFor='username' value='Your username' />
            </div>
            <TextInput id='username' type='text' placeholder='John Doe' onChange={handleChange} required/>
            <div  className='mt-[1rem]'>
              <Label htmlFor='email' value='Your email'  />
            </div>
            <TextInput id='email' type='email' placeholder='JohnDoe@gmail.com' onChange={handleChange} required/>
            <div  className='mt-[1rem]'>
              <Label htmlFor='password' value='Your password'/>
            </div>
            <TextInput id='password' type='password' placeholder='12348ssds122' onChange={handleChange} required />
              
            <Button type='submit' className='w-full mt-[2rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' >
            {
              loading ? 
              <Spinner aria-label="Small spinner example" size="sm" />
              :
              "Sign Up"
            }
            </Button>
          </form>
          <p className='my-1'>Already have an account 
            <Link to="/signin" className='text-sky-600 px-1'>signin</Link>
          </p>
      </div>
    </div>
   
  )
}
