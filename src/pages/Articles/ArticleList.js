import React, { useEffect, useState, useRef} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ArticleTable from '../../components/ArticleTable';
import Searchbar from '../../components/Searchbar';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

import { useUser } from '../../context/UserContext'; 
import axiosInstance from '../../utils/axiosInstance';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ArticleList() {    
    const { user } = useUser(); 
    const [articles, setArticles] = useState([]); 

    const fetchArticles = async() => {
        try {
            const response = await axiosInstance.get('/articles'); 
            const articlesData = response.data.articles; 
            setArticles(articlesData); 
        }
        catch(error) {
            console.error("Error fetching data", error);
        }
    }; 

    useEffect(() => {
      document.title = 'adish HAP | Knowledge Base';
      fetchArticles();
  },[]);

  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (value) => {
      setSearchValue(value); 
  }; 

  const [showCreate, setShowCreate] = useState(false);
  const handleCreateClose = () => {
    handleCancelClick(); 
    setShowCreate(false);
  }
  const handleShowCreate = () => {
    setShowCreate(true); 
  };

  const quillRef = useRef(null);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState(""); 

  const handleTitleChange = (value) => {
    setTitleInput(value); 
  };
  const handleDescriptionChange = (value) => {
    setDescriptionInput(value);
  };

  const handleCancelClick = () => {
    setTitleInput("");
    setDescriptionInput(""); 
  }

  const hasTitleError = () => {
    const trimmedTitle = titleInput.trim();
    return titleInput && trimmedTitle.length < 10; 
  };

  const hasDescriptionError = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const plainText = quill.getText().trim(); 

      return plainText && plainText.length < 10; 
    }
  };

  const isCreateDisabled = () => {
    return !titleInput || !descriptionInput; 
    };

  const handleCreateSubmit = async() => {
    try {
        const payload = {
            titleInput,
            descriptionInput,
        };
    
        const response = await axiosInstance.post("articles", payload, {
            headers: {
            'Content-Type': 'application/json'
            }
        });

        console.log("passed data:", response.data); 
        toast.success("Your article has been created successfully.");
        handleCancelClick(); 
        handleCreateClose(); 
        fetchArticles(); 
    }
    catch(error) {
      console.error("Error posting data", error); 
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
                <Sidebar />
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
                <div className="flex flex-row justify-between">
                    <p className="text-sm font-semibold">Knowledge Base</p>
                    {user?.role === 'admin' && (<p className="text-sm font-semibold text-orange-500 cursor-pointer hover:underline" onClick={() => handleShowCreate()}>+ Create New</p>)}
                </div>
              <Searchbar 
              name="search"
              placeholder="Type a title here"
              value={searchValue}
              onChange={handleSearchChange}
              />
              <ArticleTable searchValue={searchValue}/>
            </div>
        </div>

        <Modal 
            isVisible={showCreate} 
            onClose={handleCreateClose} 
            onSubmit={handleCreateSubmit}
            title="Create a new article"
            submitText="Submit"
            cancelText="Cancel"
            isDanger={false}
            disableValue={isCreateDisabled()}
            maxSize="max-w-5xl"
        >
            <Input
                label="Title"
                type="text"
                name="title"
                value={titleInput}
                placeholder="Describe the subject of the article"
                onChange={handleTitleChange}
                hasError={hasTitleError()}
                error="The title must at least be 10 characters."
            />

            <div className="flex flex-col gap-y-1 mb-10">
                <div style={{ display: 'flex', flexDirection: 'column', height: '200px', marginBottom: '1.75rem',  position: 'relative', }}>
                    <label htmlFor="description" className="text-sm font-medium mb-2" >Description</label>
                    <ReactQuill
                      ref={quillRef}
                      style={{ height: '200px'}}
                      readOnly={false}
                      value={descriptionInput}
                      onChange={handleDescriptionChange}
                    />
                </div>
                {hasDescriptionError() &&  <p className="text-xs text-red-500 mt-4">The description must at least be 10 characters.</p>}
            </div>
        </Modal>

    </div>
    
  )
}

export default ArticleList
