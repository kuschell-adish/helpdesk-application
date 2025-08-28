  import React from 'react'
  import { useEffect, useState} from 'react';
  import { useNavigate } from 'react-router-dom';
  import { GoogleLogin } from '@react-oauth/google';

  import Input from '../components/Input';
  import Navbar from '../components/Navbar';
  import Button from '../components/Button';

  import axiosInstance from '../utils/axiosInstance';
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
        await axiosInstance.get('/sanctum/csrf-cookie');
        const response = await axiosInstance.post('/login', {email, password});        
        if (response.status === 200) {
          setUserData(response.data.user);
          navigate('/dashboard'); 
          console.log("user data", response.data)
        }
      }
      catch(error) {
        //invalid credentials
        if (error.response.status === 401) {
          console.error('401 error:', error.response.data);
          setHasInputError(true);
          setErrorMessage("Invalid credentials. Make sure you are a registered user."); 
        }
        console.error("Error posting data", error); 
      }
    };

    return (
      <div className="bg-gray-50 w-full min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <div className="w-full max-w-xl text-center px-4 mt-5">
          <img src="home.svg" className="mb-4 mx-auto w-2/3"></img>
          <p className="text-2xl sm:text-3xl font-bold">Empowering support, one ticket at a time with adish HAP.</p>
        </div>
        <div className="w-full max-w-md mt-6 px-4">
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
              <div className="relative">
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
            </form>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
                <p className="mx-4 text-sm text-center">or</p>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
            <div className="flex justify-center mb-5">
              <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    await axiosInstance.get('/sanctum/csrf-cookie');
                    const token = credentialResponse.credential; 
                    try {
                      const response = await axiosInstance.post('/login/google', {token});        
                      if (response.status === 200) {
                        setUserData(response.data.user);
                        navigate('/dashboard'); 
                      }
                    }
                    catch(error) {
                      console.error("error posting data", error); 
                    }
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="center"
                  width="355"  
                />
            </div>
            <div>
              <p className="text-sm text-center mt-5">No account yet?
                <span className="text-orange-500"> Contact administrator.</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  export default Login;