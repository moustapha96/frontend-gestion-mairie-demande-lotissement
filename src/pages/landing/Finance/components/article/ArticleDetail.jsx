import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

const ArticleDetail = ({ article }) => {
    return (
        <section className="py-10 lg:py-20">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <Link to="/actualités" className="inline-flex items-center gap-2 text-base py-2 px-4 rounded-full text-primary hover:bg-primary/20 transition-all duration-200">
                        <LuArrowLeft className="h-5 w-5" />
                        Retour aux actualités
                    </Link>
                    <div className="mt-8">
                        <h1 className="text-4xl font-medium text-default-950">{article.title}</h1>
                        <p className="text-sm text-default-500 mt-2">{article.date}</p>
                        <img src={article.image} alt={article.title} className="w-full h-64 object-cover rounded-xl mt-4" />
                        <p className="text-base mt-6">{article.content}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArticleDetail;
