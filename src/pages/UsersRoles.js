import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Skeleton from '../components/Skeleton';
import UserTable from '../components/UserTable'; 
import Sidebar from '../components/Sidebar';
import Searchbar from '../components/Searchbar';
import Input from '../components/Input';
import Modal from '../components/Modal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

import Pagination from '@mui/material/Pagination';

function UsersRoles() {
  const { user } = useUser(); 
  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [preview, setPreview] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [hasFileError,setHasFileError] = useState(false); 
  const [errorMessage,setErrorMessage] = useState(""); 
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [position, setPosition] = useState("");

  const fileTypes = new Set([
    'image/jpeg', 
    'image/png',  
    'image/bmp'
  ]);

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    const maxSize = 2 * 1024 * 1024; //2mb 
    let errorMessage = ""; 
    let allowedFiles = true; 
    
    //wrong file type
    if (!fileTypes.has(file.type)) {
      allowedFiles = false; 
      errorMessage = "Only .jpg, .jpeg, .png, .bmp files are allowed.";
  
    }
    //wrong size
    if (file.size > maxSize) {
      allowedFiles = false; 
      errorMessage = "The maximum file size allowed is 2MB."
    }

    if (!allowedFiles) {
      setHasFileError(true);
      setErrorMessage(errorMessage);
      event.target.value = '';
    }
    else {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result); 
      };
      fileReader.readAsDataURL(file);
      setHasFileError(false); 
      setErrorMessage(""); 
      setProfilePicture(file); 
    }
  }

  const changeHandler = (setter) => (value) => setter(value);


  const handleCreateSubmit = async() => {
    try {
      const formData = new FormData ();

      formData.append('first_name', firstName);
      formData.append('middle_name', middleName);
      formData.append('last_name', lastName);
      formData.append('department_id', selectedDepartment);
      formData.append('position', position);
      formData.append('email', email);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture); 
      }

      const response = await axiosInstance.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("passed data:", response.data); 
      toast.success("User has been created successfully.");

      //2 seconds delay 
      setTimeout(() => {
        navigate('/users'); 
      }, 2000); 

    }
    catch(error){
      console.error("Error posting data", error); 
    }
  };

  const isCreateDisabled = () => {
    return (!firstName || firstName.length < 2) || (!lastName || lastName.length < 2) || !isEmailValid || !selectedDepartment || (!position || position.length < 5 || (middleName && middleName.length < 2)); 
  } 


  const handlePageChange = (value) => {
    setPage(value);
  };


  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (value) => {
      setSearchValue(value); 
  }; 

  const fetchUsers = async() => {
    try {
        const response = await axiosInstance.get(`/users?page=${page}`); 
        const paginated = response.data.users;
        setUsers(paginated.data || []); 
        setTotalPages(paginated.last_page);
        setDepartments(response.data.departments);
    }
    catch(error) {
        console.error("Error fetching data", error);
    }
    finally {
      setLoading(false);
    }
  }; 

  const [showCreate, setShowCreate] = useState(false);
  const handleCreateClose = () => {
    setShowCreate(false);
    handleCancelClick();
  }
  const handleCancelClick = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setPosition("");
    setEmail("");
    setSelectedDepartment("");
  }

  const handleShowCreate = () => {
    setShowCreate(true); 
  };

  useEffect(() => {
    document.title = 'adish HAP | All Users';
    fetchUsers();
  },[page]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = email && emailRegex.test(email);

return (
  <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex flex-col md:flex-row p-5">
        <div className="w-[4%]">
          <Sidebar/>
        </div>
          <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
              <div className="flex flex-row justify-between">
                  <p className="text-sm font-semibold">All Users</p>
                  <p className="text-sm font-semibold text-orange-500 cursor-pointer hover:underline" onClick={() => handleShowCreate()}>+ Create New</p>
              </div>
            <Searchbar 
            name="search"
            placeholder="Type a name here"
            value={searchValue}
            onChange={handleSearchChange}
            />
            {loading 
            ? <Skeleton />
            :
            <>
            <UserTable 
              searchValue={searchValue}
              userList={users}
              onRefresh={() => fetchUsers(page)}
            />
             <div className="flex justify-center mt-auto py-10">
              <Pagination 
                  count={totalPages} 
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined"
              />
            </div>
            </>
            }
          </div>
      </div>

      <Modal 
          isVisible={showCreate} 
          onClose={handleCreateClose} 
          onSubmit={handleCreateSubmit}
          title="Create a new user"
          submitText="Submit"
          cancelText="Cancel"
          isDanger={false}
          disableValue={isCreateDisabled()}
          maxSize="max-w-5xl"
      >
        <div className="flex flex-col items-center">
          <label htmlFor="profilePicture" className="text-sm font-medium">Profile Picture</label>
          <img src={preview ? preview : "../default.png"} className="w-16 h-16 mb-3 mt-2 rounded-full object-cover" alt="Profile Picture" />
          <input id="profilePicture" name="profilePicture" type="file" className="text-sm file:mr-2 file:py-2 file:px-3 file:rounded-sm file:border-0 file:text-sm file:bg-[#EAEAEA]" accept=".png, .jpg, .jpeg" onChange={handleFileChange}></input>
          <div className="flex flex-col mb-5 text-center">
            <p className="text-xs text-gray-400 mt-1 mb-1">Accepts formats such as JPEG and PNG and must not exceed into 2MB.</p>
            {hasFileError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          
          <Input
              label="First Name"
              type="text"
              name="firstName"
              value={firstName}
              placeholder="Enter the first name"
              onChange={changeHandler(setFirstName)}
              hasError={firstName && firstName.length < 2}
              error="The first name must at least be 2 characters."
              autoComplete="first_name"
          />
          <Input
              label="Middle Name"
              type="text"
              name="middleName"
              value={middleName}
              placeholder="Enter the middle name"
              onChange={changeHandler(setMiddleName)}
              hasError={middleName && middleName.length < 2}
              error="The middle name must at least be 2 characters."
              autoComplete="additional_name"
          />
          <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={lastName}
              placeholder="Enter the last name"
              onChange={changeHandler(setLastName)}
              hasError={lastName && lastName.length < 2}
              error="The last name must at least be 2 characters."
              autoComplete="family_name"
          />
          <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              placeholder="Enter the work email address"
              onChange={changeHandler(setEmail)}
              hasError={email && !isEmailValid}
              error={"Please enter a valid email address."}
          />
          <Input
            label="Department"
            type="select"
            name="department"
            value={selectedDepartment}
            options={departments}
            onChange={changeHandler(setSelectedDepartment)}
          />
          <Input
            label="Position"
            type="text"
            name="position"
            value={position}
            placeholder="Enter the position"
            onChange={changeHandler(setPosition)}
            hasError={position && position.length < 5}
            error="The position field must be at least be 5 characters."
          />
        </div>
      </Modal>

  </div>
  
)
}

export default UsersRoles