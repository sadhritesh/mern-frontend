import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDocument, HiOutlineUserGroup } from "react-icons/hi";
import { signOutSuccess } from '../redux/features/userSlice';
import { useDispatch } from 'react-redux';
import { useToast } from '../hooks/useToast';
import { useSelector } from 'react-redux';

export default function DashSideBar() {

  const location = useLocation()
  const [ tab, setTab ] = useState()
  const dispatch = useDispatch()
  const { successToast, errorToast } = useToast()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")

    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/v1/auth/signout", {
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
    <Sidebar className='w-screen md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item 
                icon={HiUser} 
                label={(currentUser && currentUser.isAdmin)?"Admin":"user" } 
                labelColor="dark" 
                active={tab === "profile"}
                >
                  Profile
              </Sidebar.Item>
            </Link>
            {currentUser && currentUser.isAdmin && (
              <Link to="/dashboard?tab=posts">
                  <Sidebar.Item
                    active={tab == "posts"}
                    icon={HiDocument}
                    as="div"
                  >
                    Posts
                  </Sidebar.Item>
              </Link>
            )}
            {currentUser.isAdmin && (
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                  Users
                </Sidebar.Item>
              </Link>
          )}
            <Sidebar.Item 
              icon={HiArrowSmRight} 
              onClick={ (e)=>{handleSignOut()} } 
              className="cursor-pointer"
            >
                Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
