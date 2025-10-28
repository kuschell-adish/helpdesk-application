import React, { useEffect, useState, useRef } from 'react'; 
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { HiOutlinePencil } from "react-icons/hi";
import { IoTrashBinOutline } from "react-icons/io5";

import Modal from './Modal';
import Input from './Input';

import { useUser } from '../context/UserContext'; 
import axiosInstance from '../utils/axiosInstance';

function UserTable({searchValue, userList, onRefresh}) {
    const { user } = useUser(); 
    const quillRef = useRef(null);
    const [filteredUsers, setFilteredUsers] = useState([]);

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
      

//     const [userContent, setUserContent] = useState({
//         name: '',
//         department: ''
//       });

//     const [showEdit, setShowEdit] = useState(false);
//     const handleEditClose = () => {
//       setShowEdit(false);
//     }
//     const handleShowEdit = (id, title,content) => {
//       setShowEdit(true); 
//       setUserContent({id, title, content}); 
//     };

//     const handleTitleChange = (value) => {
//         setUserContent(prev => ({
//           ...prev,
//           title: value
//         }));
//     };

//     const handleContentChange = (value) => {
//         setUserContent(prev => ({
//           ...prev,
//           content: value
//         }));
//       };

//     const handleEditSubmit = async () => {
//         try {
//             const response = await axiosInstance.put(`/articles/${articleContent.id}`, {
//                 title: articleContent.title,
//                 content: articleContent.content
//             }); 
//             console.log("Successful editing data", response.data);
//             toast.success("Your article has been updated successfully.");

//             await onRefresh();
//             handleEditClose(); 
           
//         }
//         catch(error) {
//             console.error("Error putting data", error); 
//         }
//     }

//     const hasTitleError = () => {
//         const trimmedTitle = articleContent.title.trim();
//         return articleContent.title && trimmedTitle.length < 10; 
//     };

//     const hasDescriptionError = () => {
//         if (quillRef.current) {
//           const quill = quillRef.current.getEditor();
//           const plainText = quill.getText().trim(); 
    
//           return plainText && plainText.length < 10; 
//         }
//     };


//   const isEditDisabled = () => {
//     return !articleContent.title || !articleContent.content; 
// };

//     const [deletingArticleId, setDeletingArticleId] = useState(null);

//     const [showDelete, setShowDelete] = useState(false);
//     const handleDeleteClose = () => setShowDelete(false);
//     const handleShowDelete = (id) => {
//         setDeletingArticleId(id); 
//         setShowDelete(true);
//     };

//     const handleDelete = async () => {
//         try {
//             const response = await axiosInstance.delete(`/articles/${deletingArticleId}`); 
//             console.log("Successful deleting data", response.data);
//             toast.success("Your article has been deleted successfully.");

//             await onRefresh();
//             handleDeleteClose(); 
            
//         }
//         catch(error) {
//             console.error("Error putting data", error); 
//         }
//     }

  return (
    <div>
        <table className="border-collapse w-full mt-5">
            <tbody>
            {filteredUsers.map(user => (
                <tr key={user.id} className="text-sm">
                    <td className="py-2 px-4 border-b border-gray-300">
                    <div className="flex items-center justify-between w-full">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900">
                            <img
                                className="mr-2 w-8 h-8 rounded-full"
                                src={user?.profile_picture ? user?.profile_picture : '../default.png' }
                                alt="Profile Picture"
                            />
                            {user?.first_name} {user?.last_name}
                        </p>
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

        {/* <Modal 
            isVisible={showEdit} 
            onClose={handleEditClose} 
            onSubmit={handleEditSubmit}
            title="Update an existing article"
            submitText="Update"
            cancelText="Cancel"
            isDanger={false}
            disableValue={isEditDisabled()}
            maxSize="max-w-5xl"
        >
            <Input
                label="Title"
                type="text"
                name="title"
                value={articleContent.title}
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
                      value={articleContent.content}
                      onChange={handleContentChange}
                    />
                </div>
                {hasDescriptionError() &&  <p className="text-xs text-red-500 mt-4">The description must at least be 10 characters.</p>}
            </div>
        </Modal>

        <Modal 
            isVisible={showDelete} 
            onClose={handleDeleteClose} 
            onSubmit={handleDelete}
            title="Are you sure you want to delete this article?"
            submitText="Delete"
            cancelText="Cancel"
            isDanger={true}
            maxSize="max-w-lg"
        /> */}

    </div>
  )
}

export default UserTable
