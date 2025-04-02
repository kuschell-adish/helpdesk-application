import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ArticleTable from '../../components/ArticleTable';
import Searchbar from '../../components/Searchbar';

import axiosInstance from '../../utils/axiosInstance';

function ArticleList() {    
    const [articles, setArticles] = useState([]); 
    useEffect(() => {
      document.title = 'adish HAP | Knowledge Base';
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
      fetchArticles();
  },[]);

  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (value) => {
      setSearchValue(value); 
  }; 

  return (
    <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
                <Sidebar />
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
              <p className="text-sm font-semibold">Knowledge Base</p>
              <Searchbar 
              name="search"
              placeholder="Type a title here"
              value={searchValue}
              onChange={handleSearchChange}
              />
              <ArticleTable searchValue={searchValue} articles={articles}/>
            </div>
        </div>
    </div>
  )
}

export default ArticleList
