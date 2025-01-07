import React from 'react'
import axios from 'axios';
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../components/Input';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

import { getUrl } from '../utils/apiUtils'; 
import { useUser } from '../context/UserContext';

function Login() {
  useEffect(() => {
    document.title = 'adish HAP | Login';
  }, []); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasInputError, setHasInputError] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 
  
  const { setUserData } = useUser(); 
  const navigate = useNavigate();
  const url = getUrl('auth/login');   

  const handleEmailChange = (value) => {
    setEmail(value); 
  }

  const handlePasswordChange = (value) => {
    setPassword(value); 
  }

  const isButtonDisabled = () => {
    return !email || !password; 
  }

  const handleLoginClick = async(e) => {
    e.preventDefault();

    try {
      const response = await axios.post(url, {email, password});        
      if (response.status === 200) {
        setUserData(response.data.user);
        sessionStorage.setItem('token', response.data.accessToken); 

        navigate('/dashboard'); 
        console.log("user data", response.data)
      }
    }
    catch(error) {
      //invalid credentials
      if (error.response.status === 401) {
        console.error('401 Error:', error.response.data);
        setHasInputError(true);
        setErrorMessage("Invalid credentials. Make sure you are a registered user."); 
      }
      console.error("Error posting data", error); 
    }
  }

  return (
    <div className="bg-gray-50 w-full min-h-screen flex flex-col items-center justify-center gap-y-10">
      <Navbar />
      <div className="w-1/4 text-center">
        <p className="text-4xl font-bold">Empowering support, one ticket at a time with adish HAP.</p>
      </div>
      <div className="w-1/4">
      <form onSubmit={handleLoginClick}>
          <Input
            label="Work Email"
            type="email"
            name="email"
            value={email}
            placeholder="Enter your work email"
            onChange={handleEmailChange}
          />
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <a href="#" className="text-sm text-orange-500 font-medium hover:text-orange-500">Forgot password?</a>
          </div>

          <div className="relative mb-3">
            <Input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your work password"
              onChange={handlePasswordChange}
              hasError={hasInputError}
              error={errorMessage}
            />
          </div>
          <Button 
                type="submit"
                label="Login"
                isPrimary={true}
                isDisabled={isButtonDisabled()}
                />
        <p className="text-sm text-center mt-5">
          No account yet? <a href="#" className="text-orange-500 underline hover:text-orange-500">Contact us</a>.
        </p>
        </form>
      </div>
</div>

  )
}

export default Login