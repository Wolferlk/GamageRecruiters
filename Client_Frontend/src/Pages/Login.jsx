import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { AtSign, Lock, ArrowRight } from "lucide-react";
import baseURL from "../config/axiosPortConfig";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  // useEffect(() => {
  //   const authToken = localStorage.getItem('AccessToken');
  //   console.log(authToken); 
  // }, [])
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if(!email || !password) {
      toast.error('Both Email & Password cannot be empty');
      return;
    }

    console.log("Logging in", { email, password, baseURL });

    try {
      const loginResponse = await axios.post(`${baseURL}/auth/login`, { email: email, password: password }, { withCredentials: true });
      // console.log(loginResponse);
      if(loginResponse.status === 200) {
        localStorage.setItem('IsLoginAuthenticated', true);
        toast.success('User Login Successful');
        navigate('/dashboard');
      } else {
        toast.error('User Login Failed');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const loginViaGmail = async (e) => {
    e.preventDefault();
    try {
      const loginViaGmailResponse = await axios.get(`${baseURL}/google/login`);
      console.log(loginViaGmailResponse);
      if(loginViaGmailResponse.status == 200) {
        console.log(loginViaGmailResponse.data);
        localStorage.setItem('IsLoginAuthenticated', true);
        window.location.href = loginViaGmailResponse.data.data; // Redirect to Google OAuth ...
      } else {
        toast.error('Something Went Wrong');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const loginViaFacebook = async (e) => {
    e.preventDefault();

    try {
      const loginViaFacebookResponse = await axios.get(`${baseURL}/facebook/login`);
      console.log(loginViaFacebookResponse);
      if(loginViaFacebookResponse.status == 200) {
        console.log(loginViaFacebookResponse.data);
        localStorage.setItem('IsLoginAuthenticated', true);
        window.location.href = loginViaFacebookResponse.data.data; // Redirect to Facebook OAuth ...
      } else {
        toast.error('Something Went Wrong');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  } 

  const loginViaLinkedIn = async (e) => {
    e.preventDefault();

    try {
      const loginViaLinkedInResponse = await axios.get(`${baseURL}/linkedin/login`);
      console.log(loginViaLinkedInResponse);
      if(loginViaLinkedInResponse.status == 200) {
        console.log(loginViaLinkedInResponse.data);
        localStorage.setItem('IsLoginAuthenticated', true);
        window.location.href = loginViaLinkedInResponse.data.data; // Redirect to LinkedIn OAuth ...
      } else {
        toast.error('Something Went Wrong');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }
  
  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-800 to-purple-200">
      <ToastContainer/>
      <div className="relative w-full max-w-md p-10 overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
      
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600 rounded-full translate-x-10 translate-y-10 opacity-20"></div>
        
        {/* Login header */}
        <div className="relative mb-8 text-center">
        <Link to="/dashboard">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600" >Welcome Back</h2></Link>
          <p className="mt-2 text-gray-500">Sign in to your account to continue</p>
        </div>
        
        {/* Login form */}
        <form onSubmit={handleLogin} className="relative z-10 space-y-6">
          <div className="group">
            <div className="flex items-center border-b-2 border-gray-300 group-focus-within:border-indigo-600 transition-colors pb-2">
              <AtSign className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-3 py-2 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>
          
          <div className="group">
            <div className="flex items-center border-b-2 border-gray-300 group-focus-within:border-indigo-600 transition-colors pb-2">
              <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 focus:outline-none bg-transparent"
                required
              />
            </div>
            <div className="flex justify-end mt-2">
              <Link to="/emailCheck" className="text-sm text-indigo-600 hover:text-indigo-800">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            className="flex items-center justify-center w-full px-6 py-3 text-white transition-all bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-indigo-900/20 transform hover:-translate-y-1"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?
            <Link to="/signup" className="ml-1 font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
              Sign up
            </Link>
          </p>
          
          {/* Social login options could be added here */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200">
              <span className="text-lg font-bold text-blue-600" onClick={loginViaFacebook}>F</span>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200">
              <span className="text-lg font-bold text-blue-400" onClick={loginViaLinkedIn}>L</span>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200">
              <span className="text-lg font-bold text-red-500" onClick={loginViaGmail}>G</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}