import React, {useState, useEffect} from 'react'
import { Button, Navbar, TextInput, Avatar, Dropdown, } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/features/themeSlice'
import { useToast } from '../hooks/useToast';
import { signOutSuccess } from '../redux/features/userSlice';

export default function Header() {

  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const { successToast, errorToast } = useToast()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };


  return (
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Sadh's</span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput 
         type='text'
         rightIcon={AiOutlineSearch }
         color="gray"
         className='hidden lg:inline-block'
         placeholder='Search...'
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className='flex items-center gap-x-2 md:order-2'>
        <Button
        className='w-12 h-9 hidden sm:inline-block'
        color="gray"
        pill
        onClick={()=>dispatch(toggleTheme())}
        >
        {
          theme === "dark"? <FaSun /> : <FaMoon />
        }
        </Button>
        {
          currentUser ? 
          <div className="flex">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{ currentUser.username }</span>
              <span className="block truncate text-sm font-medium">{ currentUser.email }</span>
            </Dropdown.Header>
            <Dropdown.Item>
              <Link to="/dashboard?tab=profile">Dashboard</Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={ (e)=>{handleSignOut()} }>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle className='mx-[1rem]' />
        </div>
        :
        <Link to="/signin">
          <Button
          outline gradientDuoTone="purpleToBlue"
          >Sign In
          </Button>
        </Link>
        }
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"} className='active:bg-violet-700'>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>

    </Navbar>
  )
}
