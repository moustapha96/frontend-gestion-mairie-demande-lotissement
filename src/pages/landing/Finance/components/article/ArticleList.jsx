import { Link } from "react-router-dom";
import { LuMoveRight } from "react-icons/lu";

const articles = [
    {
        title: "Nouveau Projet de Développement Urbain",
        description: "Découvrez les détails du nouveau projet de développement urbain lancé par la mairie de Kaolack.",
        date: "10 août 2023",
    },
    {
        title: "Campagne de Nettoyage de la Ville",
        description: "Participez à la campagne de nettoyage de la ville organisée par la mairie de Kaolack.",
        date: "5 août 2023",
    },
    {
        title: "Inauguration de la Nouvelle École",
        description: "La mairie de Kaolack a inauguré une nouvelle école pour améliorer l'éducation des enfants.",
        date: "1 août 2023",
    },
];

const ArticleList = () => {
    return (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-10">
            {articles.map((article, idx) => (
                <div key={idx} className="bg-white border border-default-200 rounded-xl p-6">
                    <h3 className="text-xl font-medium text-default-950 mt-4">{article.title}</h3>
                    <p className="text-base mt-2">{article.description}</p>
                    <p className="text-sm text-default-500 mt-2">{article.date}</p>
                    {/* <div className="group mt-5">
                        <Link to={`/article/${idx}`} className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">
                            Lire plus
                            <LuMoveRight className="w-6 h-6 inline-block" />
                        </Link>
                    </div> */}
                </div>
            ))}
        </div>
    );
};

export default ArticleList;
