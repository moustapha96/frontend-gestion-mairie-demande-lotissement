import { PageMetaData, TopNavBar } from "@/components";
import ArticleList from "./article/ArticleList";
import { menuItems } from "@/assets/data";

export default function ArticlesPage() {
  return (
    <>
      <PageMetaData title="Actualités - Mairie de Kaolack" />
      <TopNavBar menuItems={menuItems} hasDownloadButton position="fixed" />

      <section id="actualites" className="py-10 lg:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <span className="py-1 px-3 rounded-md text-xs font-semibold uppercase tracking-wider border border-primary bg-primary/20 text-primary">
              Actualités
            </span>
            <h2 className="text-4xl font-bold text-default-950 mt-4">Dernières Actualités</h2>
            <p className="text-base mt-2 text-default-700">
              Restez informé des annonces, commissions et projets de la Commune de Kaolack.
            </p>
          </div>

          {/* Liste avec popups de lecture */}
          <ArticleList />
        </div>
      </section>
    </>
  );
}
