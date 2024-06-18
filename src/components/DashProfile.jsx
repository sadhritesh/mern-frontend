import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Button, FileInput, Modal, Spinner } from "flowbite-react";
import { 
  updateStart,
  updateSuccuss,
  updateFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutSuccess } from "../redux/features/userSlice";
import { useToast } from "../hooks/useToast";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const { successToast, errorToast } = useToast()
  const [ formData, setFormData ] = useState({})
  const [ openModal, setOpenModal ] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({ ...prevData, [id]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
    console.log(id, value, files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
      dispatch(updateStart())
      const response = await fetch(`${import.meta.env.REACT_APP_API_BASE_URL}/api/v1/user/update-profile`,{
        method : "POST",
        body : data
      })
      const result = await response.json()
  
      if (!result.success) {
        dispatch(updateFailure(result.message))
        throw new Error(result.message)
      }
      console.log(result.data);
      dispatch(updateSuccuss(result.data))
      successToast(result.message)
    } catch (error) {
      console.log(error.message);
      errorToast(error.message)
      dispatch(updateFailure(error.message))
    }
  }

const handleDelete = async (e) => {
  try {
    dispatch(deleteUserStart())
    const res = await fetch(`${import.meta.env.REACT_APP_API_BASE_URL}/api/v1/user/delete-profile`,{
      method: "DELETE"
    })
    const result = await res.json()
  
    if (!result.success) {
      dispatch(deleteUserFailure(result.message))
      throw new Error(result.message)
    }
    successToast(result.message)
    navigate("/signin")
    dispatch(deleteUserSuccess())

  } catch (error) {
    dispatch(deleteUserFailure())
    errorToast(error.message)
}
}

const handleSignOut = async () => {
  try {
    const response = await fetch(`${import.meta.env.REACT_APP_API_BASE_URL}/api/v1/auth/signout`, {
      method : "POST"
    })
    const result = await response.json()
    
    if (!result.success) {
      throw new Error("Error occured, please try again !")
    }

    successToast(result.message)
    dispatch(signOutSuccess())
    navigate("/signin")
    
  } catch (error) {
    errorToast(error.message)
  }
}
  return (
    <div className="md:mx-auto mx-5">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-5 lg:w-[40rem] md:w-[30rem]" onSubmit={(e)=>(handleSubmit(e))}>
        <div className="w-32 h-32 mx-auto border-8 border-[lightgray] rounded-full cursor-pointer">
          <img
            src={currentUser.profilePicture}
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>
        <FileInput id="profilePicture" onChange={(e)=>(handleChange(e))} />
        <TextInput
          id="username"
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={(e)=>(handleChange(e))}
          readOnly
        />
        <TextInput
          id="email"
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={(e)=>(handleChange(e))}
        />
        <TextInput 
        id="password" 
        type="password" 
        placeholder="new password" 
        onChange={(e)=>(handleChange(e))}
        />
        <Button
        outline 
        gradientDuoTone="purpleToBlue"
        className="w-full"
        type="submit"
        disabled={loading}
        >
          {
            loading ? <Spinner aria-label="Small spinner example" size="sm" /> : "update"
          }
        </Button>
        {
          currentUser.isAdmin &&         
          <Link to="/create-post">
            <Button
            gradientDuoTone="purpleToBlue"
            className="w-full"
            type="button"
            >
              Create a post
            </Button>
          </Link>
        }
      </form>
      <div className="flex flex-row justify-between my-5 text-red-600 ">
        <span className="cursor-pointer" onClick={ (e)=>{setOpenModal(true)} }>Delete Account</span>
        <span className="cursor-pointer" onClick={ (e)=>{handleSignOut()} }>Sign out</span>
      </div>

      <Modal show={openModal} size="md" onClose={ (e)=>{setOpenModal(false)} } popup>
        < Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" 
              onClick={(e) => {
                setOpenModal(false) 
                handleDelete(e)}}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
