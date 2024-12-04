import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useParams } from 'react-router-dom';

import moment from 'moment';

import { getUrl } from '../../utils/apiUtils'; 

import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState("");
  const url = getUrl(`articles/${id}`); 

  useEffect(() => {
    document.title = 'adish HAP | Knowledge Base'

    const fetchArticle = async() => {
        try {
            const response = await axios.get(url); 
            const articleData = response.data.article; 
            setArticle(articleData); 
        }
        catch(error) {
            console.error("Error fetching data", error);
        }
    }; 
    fetchArticle();
},[id]);

console.log(article); 

  return (
    <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
            <Sidebar />
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
              <div className="flex flex-row justify-between p-2 items-center">
                <div className="flex flex-row items-center gap-x-2">
                  <img src="/default.png" className="w-10 h-10 mb-3 mt-2 rounded-full object-cover" alt="Default Profile Picture" />
                  <div className="flex flex-col text-sm">
                    <p className="font-medium">{article?.user?.first_name} {article?.user?.last_name}</p>
                    <p>{article?.user?.position} at {article?.user?.company?.name}</p>
                  </div>
                </div>
                <div className="flex flex-col text-sm">
                    <p>{article?.user?.department?.name}</p>
                    <p>{moment(article.created_at).format('MMMM D, YYYY')}</p>
                </div>
              </div>
              <hr></hr>
              <div className="p-5 flex flex-col gap-y-3">
                <p className="text-xs italic text-gray-700">Last updated on {moment(article.updated_at).format('MMMM D, YYYY')}</p>
                <p className="font-semibold text-lg">{article?.title}</p>
                <div className="article-content text-sm" dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </div>
        </div>
    </div>
  )
}

export default ArticleDetail