import { PageMetaData, TopNavBar } from "@/components";
import ArticleList from "./article/ArticleList";
import { menuItems } from "@/assets/data";

const ArticlesPage = () => {
    return (
        <>
            <PageMetaData title="Actualités - Mairie de Kaolack" />


            <TopNavBar
                menuItems={menuItems}
                hasDownloadButton
                position="fixed"
            />


            <section id="actualites" className="py-10 lg:py-20">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Actualités</span>
                        <h2 className="text-4xl font-medium text-default-950 mt-4">Dernières Actualités</h2>
                        <p className="text-base mt-2">Restez informés des dernières nouvelles et événements de la mairie de Kaolack.</p>
                    </div>
                    <ArticleList />
                </div>
            </section>
        </>
    );
};

export default ArticlesPage;
