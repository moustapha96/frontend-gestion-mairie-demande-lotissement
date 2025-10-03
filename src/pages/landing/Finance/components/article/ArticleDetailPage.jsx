import { useParams } from "react-router-dom";
import { PageMetaData, TopNavBar } from "@/components";
import ArticleDetail from "./ArticleDetail";
import { menuItems } from "@/assets/data";

const ArticleDetailPage = () => {

    const { id } = useParams();
    const [article, setArticle] = useState(null);

    setArticle({
        id: id,
        title: "Nouveau Projet de Développement Urbain",
        description: "Découvrez les détails du nouveau projet de développement urbain lancé par la mairie de Kaolack.",
        content: "La mairie de Kaolack a lancé un nouveau projet de développement urbain visant à améliorer les infrastructures de la ville. Ce projet inclut la construction de nouvelles routes, l'amélioration des systèmes d'égouts, et la création de nouveaux espaces verts pour les résidents. Le projet est prévu pour être achevé d'ici la fin de l'année 2024.",
        date: "10 août 2023",
        image: "url-de-l-image-de-l-article", // Remplacez par l'URL de l'image de l'article
    });

    // useEffect(() => {
    //     const fetchArticle = async () => {
    //         try {
    //             const response = await fetch(`/api/articles/${id}`);
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setArticle(data);
    //         } catch (error) {
    //             console.error('Error fetching article:', error);
    //         }
    //     };

    //     fetchArticle();
    // }, [id]);

    if (!article) return <div>Loading...</div>;

    return (
        <>
            <PageMetaData title={`Article - ${article.title}`} />


            <TopNavBar
                menuItems={menuItems}
                hasDownloadButton
                position="fixed"
            />
            <ArticleDetail article={article} />
        </>
    );
};

export default ArticleDetailPage;
