import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ArticleTable from '../../components/ArticleTable';
import Searchbar from '../../components/Searchbar';

function ArticleList() {
    const [searchValue, setSearchValue] = useState("");
    const handleSearchChange = (value) => {
        setSearchValue(value); 
    }
    useEffect(() => {
        document.title = 'adish HAP | Knowledge Base';
    },[]) 
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
              <ArticleTable searchValue={searchValue}/>
            </div>
        </div>
    </div>
  )
}

export default ArticleList
