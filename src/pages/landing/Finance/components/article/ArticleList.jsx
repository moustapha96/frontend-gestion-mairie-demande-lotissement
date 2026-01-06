// import { Link } from "react-router-dom";
// import { LuMoveRight } from "react-icons/lu";

// const articles = [
//     {
//         title: "Nouveau Projet de Développement Urbain",
//         description: "Découvrez les détails du nouveau projet de développement urbain lancé par la mairie de Kaolack.",
//         date: "10 août 2023",
//     },
//     {
//         title: "Campagne de Nettoyage de la Ville",
//         description: "Participez à la campagne de nettoyage de la ville organisée par la mairie de Kaolack.",
//         date: "5 août 2023",
//     },
//     {
//         title: "Inauguration de la Nouvelle École",
//         description: "La mairie de Kaolack a inauguré une nouvelle école pour améliorer l'éducation des enfants.",
//         date: "1 août 2023",
//     },
// ];

// const ArticleList = () => {
//     return (
//         <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-10">
//             {articles.map((article, idx) => (
//                 <div key={idx} className="bg-white border border-default-200 rounded-xl p-6">
//                     <h3 className="text-xl font-medium text-default-950 mt-4">{article.title}</h3>
//                     <p className="text-base mt-2">{article.description}</p>
//                     <p className="text-sm text-default-500 mt-2">{article.date}</p>
//                     {/* <div className="group mt-5">
//                         <Link to={`/article/${idx}`} className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">
//                             Lire plus
//                             <LuMoveRight className="w-6 h-6 inline-block" />
//                         </Link>
//                     </div> */}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ArticleList;


/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { LuCalendarDays, LuClock, LuX, LuExternalLink, LuEye } from "react-icons/lu";

/** 
 * Tu peux remplacer "fetchArticles" par un appel réel à ton API:
 * GET `${import.meta.env.VITE_API_URL}/articles?limit=12&page=1`
 */
async function fetchArticlesMock() {
  // Données d'exemple (remplace par la réponse de ton backend)
  return [
    {
      id: "1",
      title: "Calendrier de la Commission d’Attribution – Octobre",
      excerpt: "La commission communale d’attribution se tiendra le 17 octobre. Dossiers concernés, ordre du jour, et modalités de participation…",
      content:
        "La commission communale d’attribution des parcelles se tiendra le 17 octobre à 10h, salle du conseil. Les dossiers éligibles seront examinés par ordre de dépôt. Les demandeurs recevront une notification par SMS/Email. Documents exigés: pièce d’identité, récépissé de dépôt, preuves de paiement des frais d’étude. Les résultats seront publiés dans les 72 heures sur le portail et affichés au guichet.",
      cover: "/images/actu-commission.jpg",
      tags: ["Commission", "Attribution", "Transparence"],
      publishedAt: "2025-10-08T12:00:00Z",
      readTimeMin: 3,
      link: "/actualites/commission-octobre-2025"
    },
    {
      id: "2",
      title: "Mise à jour de la carte SIG – Zones disponibles",
      excerpt: "La couche “disponibilités” a été actualisée. Consultez les secteurs en lotissement et les servitudes à respecter…",
      content:
        "La carte SIG intègre désormais les dernières mises à jour des zones loties et des servitudes. Accédez au portail cartographique pour vérifier la disponibilité par secteur, visualiser les réserves, et télécharger les plans de masse. Les demandes sur zones non conformes seront rejetées.",
      cover: "/images/actu-sig.jpg",
      tags: ["SIG", "Cartographie"],
      publishedAt: "2025-10-06T09:30:00Z",
      readTimeMin: 2,
      link: "/carte-fonciere?layer=disponibilites"
    },
    {
      id: "3",
      title: "Paiements en ligne – Wave & Orange Money",
      excerpt: "Régler vos frais d’étude et de délivrance directement en ligne et téléchargez vos reçus dématérialisés…",
      content:
        "Les paiements des frais d’étude et de délivrance peuvent être réalisés via Wave/OM. Après validation, votre reçu est disponible depuis votre espace. Veillez à respecter les montants du barème communal. En cas de doute, contactez le guichet.",
      cover: "/images/actu-paiements.jpg",
      tags: ["Paiement", "Quitus"],
      publishedAt: "2025-10-03T15:00:00Z",
      readTimeMin: 2,
      link: "/mon-compte/paiements"
    }
  ];
}

function formatDate(d) {
  try {
    const date = new Date(d);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch { return d; }
}

function cls(...xs){ return xs.filter(Boolean).join(" "); }

export default function ArticleList({ apiUrl }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (apiUrl) {
          const res = await fetch(apiUrl);
          const data = await res.json();
          if (!mounted) return;
          setItems(Array.isArray(data) ? data : data?.items ?? []);
        } else {
          const data = await fetchArticlesMock();
          if (!mounted) return;
          setItems(data);
        }
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [apiUrl]);

  // Ouvre la modale et focus
  const openModal = useCallback((article, triggerEl) => {
    lastFocused.current = triggerEl || document.activeElement;
    setActive(article);
    setOpen(true);
    // petit délai pour laisser le DOM afficher le dialog
    setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setActive(null);
    lastFocused.current && lastFocused.current.focus();
  }, []);

  // Esc pour fermer
  useEffect(() => {
    function onKey(e){ if (e.key === "Escape") closeModal(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  const grid = useMemo(() => {
    if (!items?.length) return null;
    return (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <article key={a.id} className="group rounded-xl border border-default-200 bg-white dark:bg-default-50 shadow-sm overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              {a.cover ? (
                <img
                  src={a.cover}
                  alt={a.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-default-100" />
              )}
              {Array.isArray(a.tags) && a.tags.length > 0 && (
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {a.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-default-900">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-default-950 line-clamp-2">{a.title}</h3>
              <p className="mt-2 text-sm text-default-700 line-clamp-3">{a.excerpt}</p>

              <div className="mt-3 flex items-center gap-3 text-xs text-default-500">
                <span className="inline-flex items-center gap-1">
                  <LuCalendarDays className="h-4 w-4" /> {formatDate(a.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <LuClock className="h-4 w-4" /> {a.readTimeMin ?? 2} min
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => openModal(a, e.currentTarget)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-haspopup="dialog"
                  aria-controls="article-dialog"
                >
                  <LuEye className="h-4 w-4" /> Lire la suite
                </button>

                {a.link && (
                  <a
                    // href={a.link}
                    className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    target="_blank" rel="noreferrer"
                  >
                    Ouvrir la page <LuExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }, [items, openModal]);

  return (
    <>
      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_,i)=>(
            <div key={i} className="rounded-xl border border-default-200 bg-white dark:bg-default-50 shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-default-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-default-100 w-3/4 rounded" />
                <div className="h-4 bg-default-100 w-5/6 rounded" />
                <div className="h-4 bg-default-100 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items?.length ? (
        grid
      ) : (
        <div className="mt-10 text-center text-default-600">
          Aucune actualité pour le moment.
        </div>
      )}

      {/* ===== MODALE DE LECTURE ===== */}
      {open && active && (
        <div
          className="fixed inset-0 z-50"
          aria-labelledby="article-title"
          role="dialog"
          aria-modal="true"
          id="article-dialog"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          {/* content */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              ref={dialogRef}
              tabIndex={-1}
              className={cls(
                "relative w-full max-w-3xl rounded-2xl border border-default-200",
                "bg-white dark:bg-default-50 shadow-xl outline-none"
              )}
            >
              {/* header */}
              <div className="flex items-start gap-4 p-5 border-b border-default-200">
                <div className="flex-1">
                  <h3 id="article-title" className="text-xl font-semibold text-default-950">
                    {active.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-default-500">
                    <span className="inline-flex items-center gap-1">
                      <LuCalendarDays className="h-4 w-4" /> {formatDate(active.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <LuClock className="h-4 w-4" /> {active.readTimeMin ?? 2} min
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="rounded-md p-1 hover:bg-default-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label="Fermer l’article"
                  title="Fermer"
                >
                  <LuX className="h-5 w-5" />
                </button>
              </div>

              {/* body */}
              <div className="max-h-[70vh] overflow-y-auto p-5 space-y-4">
                {active.cover && (
                  <img
                    src={active.cover}
                    alt={active.title}
                    className="w-full max-h-80 object-cover rounded-xl"
                    loading="eager"
                  />
                )}
                {Array.isArray(active.tags) && active.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {active.tags.map((t) => (
                      <span key={t} className="rounded-full bg-default-100 px-2 py-0.5 text-xs font-semibold text-default-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <p className="whitespace-pre-wrap text-default-800 leading-relaxed">
                  {active.content}
                </p>
              </div>

              {/* footer */}
              <div className="flex items-center justify-between gap-3 p-5 border-t border-default-200">
                <div className="text-xs text-default-500">
                  Appuyez sur <kbd className="rounded border px-1">Échap</kbd> pour fermer
                </div>
                {active.link && (
                  <a
                    href={active.link}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Ouvrir la page <LuExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
