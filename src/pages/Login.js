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

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [hasInputError, setHasInputError] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 
  
  const { setUserData } = useUser(); 
  const navigate = useNavigate();
  const url = getUrl('login');   

  const handleEmailChange = (value) => {
    setEmailInput(value); 
  }

  const handlePasswordChange = (value) => {
    setPasswordInput(value); 
  }

  const isButtonDisabled = () => {
    return !emailInput || !passwordInput; 
  }

  const handleLoginClick = async() => {
    try {
      const response = await axios.post(url, {emailInput, passwordInput});
      
      if (response.status === 200) {
        setUserData(response.data.user);
        navigate('/dashboard'); 
        console.log("user data", response.data.user)
      }
  
    }
    catch(error) {
      //user does not exist
      if (error.response.status === 404) {
        console.error('404 Error:', error.response.data);
        setHasInputError(true); 
        setErrorMessage("Email is not registered into our accounts. Please contact administrator for assistance."); 
      }
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
          <Input
            label="Work Email"
            type="email"
            name="email"
            value={emailInput}
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
              value={passwordInput}
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
                onClick={handleLoginClick}
                isDisabled={isButtonDisabled()}
                />
        <p className="text-sm text-center mt-5">
          No account yet? <a href="#" className="text-orange-500 underline hover:text-orange-500">Contact us</a>.
        </p>
      </div>
</div>

  )
}

export default Login