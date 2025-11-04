import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Input from './Input';
import Modal from './Modal';
import axiosInstance from '../utils/axiosInstance';

function UserTable({searchValue, userList, departmentsList}) {
    const navigate = useNavigate();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = email && emailRegex.test(email);
    const changeHandler = (setter) => (value) => setter(value);

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

    useEffect(() => {
        if (!searchValue) {
          setFilteredUsers(userList); 
        } else {
          const filtered = userList.filter(user =>
            user.name.toLowerCase().includes(searchValue.toLowerCase())
          );
          setFilteredUsers(filtered);
        }
    }, [searchValue, userList]); 

    useEffect(() => {
        if (selectedUser) {
            showSelectedUser();
        }
    },[selectedUser]);

    const [showEdit, setShowEdit] = useState(false);
    const handleEditClose = () => {
        showSelectedUser();
        setShowEdit(false);
    }

    const handleShowEdit = (user) => {
      setShowEdit(true); 
      setSelectedUser(user); 
    };

    const showSelectedUser = () => {
        setFirstName(selectedUser?.first_name || "");
        setMiddleName(selectedUser?.middle_name || "");
        setLastName(selectedUser?.last_name || "");
        setEmail(selectedUser?.email || "");
        setPosition(selectedUser?.position || "");
        setSelectedDepartment(selectedUser?.department_id || "");
        setPreview(selectedUser?.profile_picture || "");
      }

    const handleEditSubmit = async() => {
        try {
            const formData = new FormData ();

            formData.append('first_name', firstName);
            formData.append('middle_name', middleName);
            formData.append('last_name', lastName);
            formData.append('department_id', selectedDepartment);
            formData.append('position', position);
            formData.append('email', email);

            if (profilePicture) {
                formData.append("profile_picture", profilePicture); 
            }

            console.log('Form values:', {
                firstName, middleName, lastName, 
                selectedDepartment, position, email
            });

            formData.append('_method', 'PUT');

            const response = await axiosInstance.post(`/users/${selectedUser?.id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            });
            console.log("passed data:", response.data); 
            toast.success("User has been edited successfully.");
        
            //2 seconds delay 
            setTimeout(() => {
                navigate('/users'); 
            }, 2000); 
        }
        catch(error) {
            console.error("Error putting data", error); 
        }
    }
    const isEditDisabled = () => {
        return (!firstName || firstName.length < 2) || (!lastName || lastName.length < 2) || !isEmailValid || !selectedDepartment || (!position || position.length < 5 || (middleName && middleName.length < 2)); 
    } 

    console.log(filteredUsers);

  return (
    <div>
        <table className="border-collapse w-full mt-5">
            <tbody>
            {filteredUsers.map(user => (
                <tr key={user.id} className="text-sm">
                    <td className="py-2 px-4 border-b border-gray-300">
                    <div className="flex items-center justify-between w-full">
                        <div onClick={() => handleShowEdit(user)} className="cursor-pointer"> 
                            <p className="inline-flex items-center mr-3 text-sm text-gray-900">
                                <img
                                    className="mr-2 w-8 h-8 rounded-full"
                                    src={user?.profile_picture ? user?.profile_picture : '../default.png' }
                                    alt="Profile Picture"
                                />
                                {user?.first_name} {user?.last_name}
                            </p>
                        </div>
                        {/* {article.user_id === user.id && (<div className="flex space-x-2 text-orange-500">
                            <HiOutlinePencil className="w-5 h-5 cursor-pointer" onClick={() => handleShowEdit(article.id, article.title, article.content)}/>
                            <IoTrashBinOutline className="w-5 h-5 cursor-pointer" onClick={() => handleShowDelete(article.id)} />
                        </div>)} */}
                    </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        <Modal 
            isVisible={showEdit} 
            onClose={handleEditClose} 
            onSubmit={handleEditSubmit}
            title="Update an existing user"
            submitText="Update"
            cancelText="Cancel"
            isDanger={false}
            disableValue={isEditDisabled()}
            maxSize="max-w-5xl"
        >
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium">Profile Picture</p>
          <img src={preview} className="w-16 h-16 mb-3 mt-2 rounded-full object-cover" alt="Profile Picture" />
          {selectedUser?.login_provider === "manual" && (
            <>
          <input id="profilePicture" name="profilePicture" type="file" className="text-sm file:mr-2 file:py-2 file:px-3 file:rounded-sm file:border-0 file:text-sm file:bg-[#EAEAEA]" accept=".png, .jpg, .jpeg" onChange={handleFileChange}></input>
          <div className="flex flex-col mb-5 text-center">
            <p className="text-xs text-gray-400 mt-1 mb-1">Accepts formats such as JPEG and PNG and must not exceed into 2MB.</p>
            {hasFileError && <p className="text-xs text-red-500">{errorMessage}</p>}
          </div>
          </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="First Name"
                type="text"
                name="firstName"
                value={firstName}
                placeholder="First Name"
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
                options={departmentsList}
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

export default UserTable
