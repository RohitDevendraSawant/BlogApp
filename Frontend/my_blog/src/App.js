import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import NewBlog from "./pages/NewBlog";
import BlogDetail from "./pages/BlogDetail";
import EditBlog from "./pages/EditBlog";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route exact path="/" element = {<Home/>} />
        <Route exact path="/login" element= {<Login/>}/>
        <Route exact path="/signup" element= {<Signup/>}/>
        <Route exact path="/addBlog" element = {<NewBlog/>} />
        <Route exact path= "/blogDetail" element ={<BlogDetail/>}/>
        <Route exact path= "/editBlog" element ={<EditBlog/>}/>

      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
