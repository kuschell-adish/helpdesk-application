import React, { useState } from 'react'
import { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Input from '../components/Input';
import Button from '../components/Button';

import axiosInstance from '../utils/axiosInstance';
import { useUser } from '../context/UserContext';

import { IoDocumentTextOutline } from "react-icons/io5";

function FileTicket() {

  const [departments, setDepartments] = useState([]); 
  const [priorities, setPriorities] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [filteredEmployees, setFilteredEmployees] = useState([]); 

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState(""); 
  const [isChecked, setIsChecked] = useState(false); 
  const [filesInput, setFilesInput] = useState([]);
  const [previews, setPreviews] = useState([]);

  const quillRef = useRef(null);
  const { user } = useUser(); 
  const userName = user ? `${user.first_name} ${user.last_name}` : ''; 
  const navigate = useNavigate(); 

  const handleTitleChange = (value) => {
    setTitleInput(value); 
  }

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value); 
  }

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value); 
  }

  const handlePriorityChange = (value) => {
    setSelectedPriority(value); 
  }

  const handleDescriptionChange = (value) => {
    setDescriptionInput(value);
  };

  const handleCheckboxChange = () => {
    setIsChecked(prevChecked => {
      const newChecked = !prevChecked;  
      if (newChecked) {
        setSelectedEmployee(""); 
      }
      return newChecked; 
    });
  };

  const [hasFileError,setHasFileError] = useState(false); 
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const fileTypes = new Set([
    'image/jpeg', 
    'image/png',  
    'image/bmp',
    'video/mp4',
    'video/quicktime',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
  ]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const maxSize = 50 * 1024 * 1024; // 50MB
    let errorMessage = "";
    let allowedFiles = true;
  
    if (newFiles.length + filesInput.length > 5) {
      allowedFiles = false;
      errorMessage = "You can only upload a maximum of 5 attachments.";
    } else {
      for (const file of newFiles) {
        if (!fileTypes.has(file.type)) {
          allowedFiles = false;
          errorMessage = "Only .jpg, .jpeg, .png, .bmp, .mp4, .mov, .doc, .docx, .pdf files are allowed.";
          break;
        }
        if (file.size > maxSize) {
          allowedFiles = false;
          errorMessage = "The maximum file size allowed is 50MB per file.";
          break;
        }
      }
    }
  
    if (!allowedFiles) {
      setHasFileError(true);
      setFileErrorMessage(errorMessage);
      event.target.value = ''; 
    } else {
      setHasFileError(false);
      setFileErrorMessage(""); 
      setFilesInput((prevFiles) => [...prevFiles, ...newFiles]); 

      const newPreviews = newFiles.map((file) => {
        if (file.type.startsWith('image/')) {
          const objectURL = URL.createObjectURL(file);
          return { file, preview: objectURL, type: 'image' };
        }
        else if (file.type.startsWith('video/')) {
          const objectURL = URL.createObjectURL(file);
          return { file, preview: objectURL, type: 'video' };
        }
        return { file, preview: null, type: 'other' };
      });

      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };
  

  const handleCancelClick = () => {
    setSelectedDepartment("");
    setSelectedEmployee("");
    setSelectedPriority("");
    setTitleInput("");
    setDescriptionInput("");
    setFilesInput([]); 
    setPreviews([]);
  }
  
  const handleSubmitClick = async() => {
    try {
      const formData = new FormData();

      formData.append('authUser', user?.id);
      formData.append('selectedDepartment', selectedDepartment);
      formData.append('selectedEmployee', selectedEmployee);
      formData.append('selectedPriority', selectedPriority);
      formData.append('titleInput', titleInput);
      formData.append('descriptionInput', descriptionInput); 
      formData.append('filesInput', filesInput); 

      filesInput.forEach(file => {
        formData.append('filesInput[]', file); 
      }); 

      const response = await axiosInstance.post('/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("passed data:", response.data); 
      toast.success("Your ticket has been submitted successfully.");
      handleCancelClick(); 

      //2 seconds delay 
      setTimeout(() => {
        navigate('/tickets'); 
      }, 2000); 

    }
    catch(error) {
      console.error("Error posting data", error); 
    }
  }

  const isButtonDisabled = () => {
    return !selectedDepartment  || !selectedPriority || !titleInput || !descriptionInput || hasTitleError() || hasDescriptionError() || hasFileError;
  }

  const hasTitleError = () => {
    const trimmedTitle = titleInput.trim();
    return titleInput && trimmedTitle.length < 10; 
  }

  const hasDescriptionError = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const plainText = quill.getText().trim(); 

      return plainText && plainText.length < 10; 
    }
  }

  useEffect(() => {
    document.title = 'adish HAP | File Ticket';
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/tickets/create');
        const departmentsData = response.data.departments;
        const employeesData = response.data.employees;
        const prioritiesData = response.data.priorities; 
        setDepartments(departmentsData); 
        setEmployees(employeesData);
        setPriorities(prioritiesData);
      }
      catch (error) {
        console.error("Error fetching data", error); 
      }
    };
    fetchDepartments();
  },[]); 

  useEffect(() => {
    if (selectedDepartment) {
      const departmentId = parseInt(selectedDepartment,10); 
      const filtered = employees.filter(employee => employee.department_id === departmentId);
      setFilteredEmployees(filtered); 
    }
    else {
      setFilteredEmployees([]); 
    }
  },[selectedDepartment, employees]);

  const removePreview = (index) => {
    const fileName = previews[index].file.name;
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setFilesInput((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  } 


  return (
    <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
            <Sidebar />
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
              <p className="text-sm font-semibold">File a Ticket</p>
              <div className="grid grid-cols-2 gap-x-24 px-2 py-3">
                <Input
                label="Name"
                type="text"
                name="name"
                value={userName}
                isDisabled={true}
                />
                <Input
                label="Date"
                type="text"
                name="date"
                value={format(new Date(), 'MMMM d, yyyy hh:mm a')}
                isDisabled={true}
                />
                <Input
                label="Assign to Department"
                type="select"
                name="department"
                value={selectedDepartment}
                options={departments}
                onChange={handleDepartmentChange}
                />

                <div className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <label htmlFor="employee" className="text-sm font-medium">Assign to Employee</label>
                    <div className="flex items-center gap-x-2">
                      <input type="checkbox" id="unassigned" name="unassigned" value="1" className="w-4 h-4 bg-gray-100 border-gray-300" checked={isChecked} onChange={handleCheckboxChange}></input>
                      <label htmlFor="unassigned" className="text-sm font-medium">Leave Unassigned</label>
                    </div>
                  </div>
                  <select name="employee" value ={selectedEmployee} className="mt-2 w-full border-[1px] border-black p-2 text-sm rounded-sm" onChange={handleEmployeeChange} disabled={isChecked}>
                  <option value="">Select employee </option>
                    {filteredEmployees.map(employee => (
                      <option key ={employee.id} value={employee.id}>
                        {employee.first_name + ' ' + employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Input
                label="Title"
                type="text"
                name="title"
                value={titleInput}
                placeholder="Describe the subject of the ticket"
                onChange={handleTitleChange}
                hasError={hasTitleError()}
                error="The title must at least be 10 characters."
                />
                <Input
                label="Priority Level"
                type="select"
                name="priority"
                value={selectedPriority}
                options={priorities}
                onChange={handlePriorityChange}
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <div style={{ display: 'flex', flexDirection: 'column', height: '200px', padding: '0 0.5rem', marginBottom: '1.75rem',  position: 'relative', }}>
                    <label htmlFor="description" className="text-sm font-medium mb-2" >Description</label>
                    <ReactQuill
                      ref={quillRef}
                      style={{ height: '200px'}}
                      readOnly={false}
                      value={descriptionInput}
                      onChange={handleDescriptionChange}
                    />
                </div>
                {hasDescriptionError() &&  <p className="text-xs text-red-500 mt-4 ml-2">The description must at least be 10 characters.</p>}
                <div className="flex flex-col px-2 mt-10">
                  <label htmlFor="attachments" className="text-sm font-medium">Attachments</label>
                  <label htmlFor="attachments" className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-sm cursor-pointer mt-2">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-6 h-6 mt-1 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm font-medium text-gray-500">Click to upload</p>
                        <p className="text-xs text-gray-500">Accepts the following formats with size limits of 50MB:</p>
                        <p className="text-xs text-gray-500">JPEG, PNG, BMP; MP4, MOV; DOC, DOCX, PDF</p>
                    </div>
                    <input id="attachments" name="attachments" type="file" className="hidden" multiple accept=".jpg, .jpeg, .png, .bmp, .mp4, .mov, .doc, .docx, .pdf" onChange={handleFileChange}/>
                  </label>
                  {filesInput.length === 0 && <p className="text-sm mt-2">No file chosen</p>}
                  {hasFileError && <p className="mt-2 text-xs text-red-500">{fileErrorMessage}</p>}
                  <div className="grid grid-cols-5 gap-4 mt-4">
                  {previews.length > 0 && previews.map((preview, index) => (
                    <div key={index} className="relative bg-gray-100 rounded-lg py-4 px-6" title={preview.file.name}>
                      <button title="Remove attachment" className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800"  onClick={() => removePreview(index)}>
                        &times;
                      </button>
                      <p className="text-xs text-orange-500 text-contain truncate w-full mb-2">{preview.file.name}</p>
                      {preview.type === 'image' ? (
                        <img 
                            src={preview.preview} 
                            alt={preview.file.name} 
                            className="w-full h-32 object-cover rounded-sm" 
                          />
                      ) : preview.type === 'video' ? (
                        <video 
                            src={preview.preview} 
                            controls
                            className="w-full h-32 object-cover rounded-sm"
                          />
                      ) : (
                        <IoDocumentTextOutline className="text-9xl"/>
                      )}
                  </div>
                  ))}
                </div>
                </div> 
              </div>
              <div className="w-full flex justify-end">
                <div className="w-1/6 flex flex-row gap-x-2 mr-2">
                  <Button 
                  type="button"
                  label="Cancel"
                  isPrimary={false}
                  onClick={handleCancelClick}
                  />
                  <Button 
                  type="submit"
                  label="Submit"
                  isPrimary={true}
                  onClick={handleSubmitClick}
                  isDisabled={isButtonDisabled()}
                  />
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default FileTicket
