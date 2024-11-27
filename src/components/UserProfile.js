import React from 'react';
import { useState } from 'react';
import Input from './Input';
import Button from './Button';

function UserProfile() {
  const [hasFileError,setHasFileError] = useState(false); 
  const fileTypes = new Set([
    'image/jpeg', 
    'image/png',  
    'image/bmp'
  ]);
  const [profilePicture, setProfilePicture] = useState("");
  const handleUpdateClick = () => {
    alert("clicked");
  } 

  const isButtonDisabled = () => {
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    console.log(file); 
    if (!fileTypes.has(file.type)) {
      setHasFileError(true);
    }
    else {
      setHasFileError(false); 
      setProfilePicture(file); 
    }
  }

  console.log("profile", profilePicture); 
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <label htmlFor="profile_picture" className="text-sm font-medium">Profile Picture</label>
        <img id="profile_picture_preview" src="/default.png" className="w-20 h-20 mb-3 mt-2 rounded-full object-cover" alt="Profile Picture" />
        <input type="file" name="profile_picture" id="profile_picture" className="text-sm file:mr-2 file:py-2 file:px-3 file:rounded-sm file:border-0 file:text-sm file:bg-[#EAEAEA]" accept=".png, .jpg, .jpeg, .tiff, .tif" onChange={handleFileChange}></input>
        <div className="flex flex-col mb-5 text-center">
          <p className="text-xs text-gray-400 mt-1 mb-1">Accepts formats such as JPEG, PNG, BMP, TIFF, and must not exceed into 2MB.</p>
          {hasFileError && <p className="text-xs text-red-500">Only .jpg, .jpeg, .png, .bmp files are allowed.</p>}
        </div>
      </div>
       <div className="grid grid-cols-2 gap-x-24 px-2 py-3">
        <Input
          label="First Name"
          type="text"
          name="first_name"
          value="Juan"
          isDisabled={true}
        />
        <Input
          label="Email"
          type="text"
          name="email"
          value="juandelacruz@email.com"
          isDisabled={true}
        />
        <Input
          label="Middle Name"
          type="text"
          name="middle_name"
          value="Guzman"
          isDisabled={true}
        />
        <Input
          label="Company"
          type="text"
          name="company"
          value="XYZ International"
          isDisabled={true}
        />
        <Input
          label="Last Name"
          type="text"
          name="last_name"
          value="Dela Cruz"
          isDisabled={true}
        />
        <Input
          label="Position"
          type="text"
          name="position"
          value="Operations Manager"
          isDisabled={true}
        />
        </div>
        <div className=" flex justify-end mr-2">
          <Button 
            type="submit"
            label="Update"
            isPrimary={true}
            onClick={handleUpdateClick}
            isDisabled={isButtonDisabled()}
            />
        </div>
    </div>
  )
}

export default UserProfile
