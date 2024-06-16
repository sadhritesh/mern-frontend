import { BrowserRouter, Routes, Route } from "react-router-dom"
import { 
  Home, 
  SignIn, 
  SignUp, 
  Projects, 
  Dashboard, 
  About, 
  Error, 
  AdminProtectedRoute,
  CreatePost,
  UpdatePost,
  PostPage
} from "./pages"
import { FooterComp, Header, ProtectedRoute } from "./components";
import { ToastContainer } from 'react-toastify';
import Search from "./pages/Search";
function App() {
  
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/search" element={<Search />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminProtectedRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/*" element={<Error />} />
      </Routes>
      <FooterComp />
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
