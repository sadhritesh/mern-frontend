import { React, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DashProfile, DashSideBar, DashPosts, DashUsers } from '../components'

export default function Dashboard() {

  const location = useLocation()
  const [ tab, setTab ] = useState("")
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")

    if (tabFromUrl) {
      setTab(tabFromUrl)
    }

  }, [location.search])

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='md:min-h-screen'>
        <DashSideBar />
      </div>
      {/* Profile */}
      {tab === "profile" && <DashProfile/>}
      {/* Posts */}
      {tab === "posts" && <DashPosts/>}
      {/* Users */}
      {tab === "users" && <DashUsers/> }
    </div>
  )
}
