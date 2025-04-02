import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';

function ArticleTable({searchValue, articles}) {
    const [filteredArticles, setFilteredArticles] = useState([]); 

    useEffect(() => {
        const result = articles.filter(article => article.title.toLowerCase().includes(searchValue.toLowerCase()));
        setFilteredArticles(result); 
    },[searchValue, articles]); 

  return (
    <div>
        <table className="border-collapse w-full mt-5">
            <tbody>
            {filteredArticles.map(article => (
                <tr key={article.id} className="text-sm">
                    <td className="py-2 px-4 border-b border-gray-300">
                        <Link to={`/articles/${article.id}`} className="hover:text-orange-500">{article.title}</Link>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  )
}

export default ArticleTable
