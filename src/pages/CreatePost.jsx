import React, { useState } from 'react'
import { TextInput, Select, FileInput, Button, Spinner } from "flowbite-react"
import ReactQuill from 'react-quill';
import { useToast } from "../hooks/useToast";
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {

  const [ formData, setFormData ] = useState({
    title: '',
    category: '',
    content: '',
    blogPost: ''
  })
  const { successToast, errorToast } = useToast()
  const [ loading, setLoading ] = useState(false)

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({ ...prevData, [id]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) {
      return 
    }

    setLoading(true)
    const data = new FormData()
    
    for (const key in formData) {
      data.append(key, formData[key])
    }
    
    try {
      const res = await fetch(`${import.meta.env.REACT_APP_API_BASE_URL}/api/v1/post/create-post`, {
        method: "POST",
        body : data
      }) 
      const result = await res.json()

      if (!result.success) {
        throw new Error(result.message)
      }
      console.log(result.data);
      setLoading(false)
      setFormData({
        title: '',
        category: '',
        content: '',
        blogPost: ''
      })
      successToast(result.message)
    } catch (error) {
      setLoading(false)
      errorToast(error.message)
    }
  }

  return (
    <div className='p-[1rem] w-screen'>
      <h1 
      className='text-center text-4xl font-semibold my-[1rem]'
      >
      Create Post
      </h1>
        <form onSubmit={ (e)=>handleSubmit(e) }>
      <div 
      className='flex flex-col gap-4 max-w-[80%] mx-auto'
      >
        <div className='flex flex-col sm:flex-row gap-4'>
          <TextInput 
            type='text'
            placeholder='Title' 
            className='flex-1'
            id='title'
            value={formData.title}
            onChange={ (e)=>handleChange(e) }
            required
          />
          <Select id='category' onChange={ (e)=>handleChange(e) } value={formData.category}>
              <option value="uncategorized">Select a category</option>
              <option value="javascript">Javascript</option>
              <option value="python">Python</option>
              <option value="nodejs">Nodejs</option>
              <option value="reactjs">Reactjs</option>
              <option value="nextjs">Nextjs</option>
          </Select>
        </div>
        <div 
        className='flex flex-row gap-4 justify-between border-4 border-dotted border-teal-500 p-4'
        >
          <FileInput
           type="file"
           accept='image/*'
           id='blogPost'
           onChange={ (e)=> handleChange(e) }
          />
          {/* <Button
          gradientDuoTone="purpleToBlue"
          type="button"
          size="sm"
          outline
          >
            Upload Image
          </Button> */}
        </div>
        <ReactQuill
        theme='snow'
        className='h-72 mb-10'
        value={formData.content}
        onChange={(value) => {
          setFormData((prevData) => ({ ...prevData, content: value }));
        }}
      required="true"
        />
        <Button
        gradientDuoTone="purpleToBlue"
        type="submit"
        className='my-4'
        >
          {
            loading ? <Spinner />: "Publish"
          }
        </Button>
      </div>
        </form>
    </div>
  )
}
