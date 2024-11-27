import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 

function ArticleList({searchValue}) {
    const [articles, setArticles] = useState([]); 
    const [filteredArticles, setFilteredArticles] = useState([]); 
    const url = "http://127.0.0.1:8000/api/articles";
    useEffect(() => {
        const fetchArticles = async() => {
            try {
                const response = await axios.get(url); 
                const articlesData = response.data.articles; 
                setArticles(articlesData); 
            }
            catch(error) {
                console.error("Error fetching data", error);
            }
        }; 
        fetchArticles();
    },[url]);

    useEffect(() => {
        const result = articles.filter(article => article.title.toLowerCase().includes(searchValue.toLowerCase()));
        setFilteredArticles(result); 
    },[searchValue, articles])
  return (
    <div>
        <table className="border-collapse w-full mt-5">
            <tbody>
            {filteredArticles.map(article => (
                <tr key={article.id} className="text-sm">
                    <td className="py-2 px-4 border-b border-gray-300">
                        <a href="#" className="hover:text-orange-500">{article.title}</a></td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  )
}

export default ArticleList
