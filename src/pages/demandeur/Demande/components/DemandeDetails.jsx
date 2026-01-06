
// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useParams, Link } from "react-router-dom";
// import { DemandeurBreadcrumb } from "@/components";
// import { getAttributionParcelleByDemande } from "@/services/attributionParcelleService";
// import {
//   getDetailsRequest,
//   getFileRequest,
// } from "@/services/requestService";
// import {
//   Card,
//   Descriptions,
//   Divider,
//   Tag,
//   Button,
//   Space,
//   Alert,
//   Skeleton,
// } from "antd";
// import dayjs from "dayjs";

// /* ================= helpers UI ================= */

// const statutColor = (s) => {
//   switch (String(s || "").toUpperCase()) {
//     case "EN_ATTENTE":
//     case "EN_COURS":
//       return "processing";
//     case "VALIDEE":
//     case "APPROBATION_PREFET":
//       return "blue";
//     case "ATTRIBUTION_PROVISOIRE":
//       return "gold";
//     case "APPROBATION_CONSEIL":
//       return "geekblue";
//     case "ATTRIBUTION_DEFINITIVE":
//       return "green";
//     case "REJETEE":
//       return "red";
//     case "ANNULEE":
//       return "volcano";
//     default:
//       return "default";
//   }
// };
// const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);
// const money = (v) =>
//   v || v === 0 ? new Intl.NumberFormat("fr-FR").format(v) : "—";
// const fmtDate = (v, withTime = false) =>
//   v ? dayjs(v).format(withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY") : "—";



// export default function DemandeurDemandeDetails() {
//   const { id } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [demande, setDemande] = useState(null);
//   const [files, setFiles] = useState({ recto: null, verso: null });
//   const [attrib, setAttrib] = useState(null);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const [d, f, a] = await Promise.all([
//         getDetailsRequest(String(id)).catch(() => null),
//         getFileRequest(String(id)).catch(() => ({})),
//         getAttributionParcelleByDemande(String(id)).catch(() => null),
//       ]);
//       console.log(d,a)
//       setDemande(d?.item ?? d ?? null);

//       const recto =
//         f?.data?.recto ?? // cas { success, data:{...} }
//         f?.recto ??
//         null;
//       const verso =
//         f?.data?.verso ??
//         f?.verso ??
//         null;
//       setFiles({ recto, verso });

//       setAttrib(a ?? null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   // petits raccourcis sûrs
//   const lot = attrib?.parcelle?.lotissement;
//   const loc = lot?.localite;

//   // PVs: plusieurs clés possibles suivant ton back
//   const pv = useMemo(
//     () => ({
//       validationProvisoire:
//         attrib?.pvValidationProvisoire ??
//         // parfois stocké concaténé
//         (attrib?.pvCommision?.includes("VALIDATION") ? attrib?.pvCommision : null),
//       attributionProvisoire:
//         attrib?.pvAttributionProvisoire ??
//         (attrib?.pvCommision?.includes("ATTRIBUTION_PROVISOIRE")
//           ? attrib?.pvCommision
//           : null),
//       approbationPrefet:
//         attrib?.pvApprobationPrefet ??
//         (attrib?.pvCommision?.includes("APPROBATION_PREFET")
//           ? attrib?.pvCommision
//           : null),
//       approbationConseil:
//         attrib?.pvApprobationConseil ??
//         (attrib?.pvCommision?.includes("APPROBATION_CONSEIL")
//           ? attrib?.pvCommision
//           : null),
//       // PV brute (au cas où)
//       pvCommision: attrib?.pvCommision ?? null,
//     }),
//     [attrib]
//   );

//   return (
//     <>
//       <DemandeurBreadcrumb title={`Détails demande #${id}`} />
//       <section>
//         <div className="container">
//           <div className="my-6 space-y-6">
//             <Card
//               title={`Demande #${id}`}
//               extra={
//                 <Space>
//                   <Tag color={statutColor(demande?.statut)}>
//                     {demande?.statut || "—"}
//                   </Tag>
//                   <Link to="/demandeur/demandes">
//                     <Button>Retour</Button>
//                   </Link>
//                 </Space>
//               }
//             >
//               {loading ? (
//                 <Skeleton active paragraph={{ rows: 8 }} />
//               ) : (
//                 <>
//                   {/* ======= Bloc Demande ======= */}
//                   <Descriptions bordered column={2} size="small">
//                     <Descriptions.Item label="Type de demande">
//                       {fmt(demande?.typeDemande)}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Titre demandé">
//                       {fmt(demande?.typeTitre)}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Superficie (m²)">
//                       {fmt(demande?.superficie)}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Usage prévu">
//                       {fmt(demande?.usagePrevu)}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Localité / Quartier">
//                       {fmt(
//                         demande?.quartier?.nom ??
//                         demande?.localite?.nom ??
//                         demande?.localite
//                       )}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Créée le">
//                       {fmtDate(demande?.dateCreation, true)}
//                     </Descriptions.Item>
//                   </Descriptions>

//                   <Divider />

//                   {/* ======= Documents ======= */}
//                   <Descriptions
//                     title="Documents fournis"
//                     bordered
//                     column={2}
//                     size="small"
//                   >
//                     <Descriptions.Item label="Recto">
//                       {files.recto ? (
//                         <a href={import.meta.env.VITE_API_URL_SIMPLE + files.recto} target="_blank" rel="noreferrer">
//                           Ouvrir
//                         </a>
//                       ) : (
//                         "—"
//                       )}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Verso">
//                       {files.verso ? (
//                         <a href={import.meta.env.VITE_API_URL_SIMPLE + files.verso} target="_blank" rel="noreferrer">
//                           Ouvrir
//                         </a>
//                       ) : (
//                         "—"
//                       )}
//                     </Descriptions.Item>
//                   </Descriptions>

//                   <Divider />

//                   {/* ======= Attribution ======= */}
//                   {attrib && (

//                     <Descriptions
//                       title="Attribution & validations"
//                       bordered
//                       column={1}
//                       size="small"
//                     >
//                       <Descriptions.Item label="Statut attribution">
//                         {attrib?.statut ? (
//                           <Tag color={statutColor(attrib.statut)}>
//                             {attrib.statut}
//                           </Tag>
//                         ) : (
//                           "—"
//                         )}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Montant">
//                         {money(attrib?.montant)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Périodicité (ex-: échéance)">
//                         {fmt(attrib?.frequence)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Date d’effet">
//                         {fmtDate(attrib?.dateEffet)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Date de fin">
//                         {fmtDate(attrib?.dateFin)}
//                       </Descriptions.Item>

//                       {/* PV par étape */}
//                       <Descriptions.Item label="PV — Validation provisoire">
//                         {fmt(pv.validationProvisoire)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="PV — Attribution provisoire">
//                         {fmt(pv.attributionProvisoire)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="PV — Approbation Préfet">
//                         {fmt(pv.approbationPrefet)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="PV — Approbation Conseil">
//                         {fmt(pv.approbationConseil)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Décision Conseil">
//                         {fmt(attrib?.decisionConseil)}
//                       </Descriptions.Item>

//                       {/* Dates d’étapes (avec heure quand dispo) */}
//                       <Descriptions.Item label="Validation provisoire le">
//                         {fmtDate(attrib?.datesEtapes?.validationProvisoire, true)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Attribution provisoire le">
//                         {fmtDate(attrib?.datesEtapes?.attributionProvisoire, true)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Approbation du Préfet le">
//                         {fmtDate(attrib?.datesEtapes?.approbationPrefet, true)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Approbation du Conseil le">
//                         {fmtDate(attrib?.datesEtapes?.approbationConseil, true)}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Attribution définitive le">
//                         {fmtDate(attrib?.datesEtapes?.attributionDefinitive, true)}
//                       </Descriptions.Item>

//                       {/* Info re-ouverture (si exposée par le back) */}
//                       {attrib?.canReopen === true && (
//                         <Descriptions.Item label="Peut être réouvert ?">
//                           Oui
//                         </Descriptions.Item>
//                       )}
//                     </Descriptions>
//                   )}

//                   <Divider />

//                  {attrib && attrib.parcelle && (
                   
//                   <Descriptions
//                     title="Parcelle attribuée"
//                     bordered
//                     column={2}
//                     size="small"
//                   >
//                     <Descriptions.Item label="Numéro">
//                       {fmt(attrib?.parcelle?.numero)}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Surface">
//                       {fmt(attrib?.parcelle?.surface)} m²
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Statut">
//                       {fmt(attrib?.parcelle?.statut)}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Coordonnées">
//                       {fmt(attrib?.parcelle?.latitude)} /{" "}
//                       {fmt(attrib?.parcelle?.longitude)}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Lotissement">
//                       {fmt(lot?.nom)}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Localité">
//                       {fmt(loc?.nom)}
//                     </Descriptions.Item>
//                     {loc?.prix !== undefined && (
//                       <Descriptions.Item label="Prix localité (FCFA)">
//                         {money(loc.prix)}
//                       </Descriptions.Item>
//                     )}
//                     {attrib?.parcelle?.proprietaire && (
//                       <>
//                         <Descriptions.Item label="Propriétaire">
//                           {fmt(
//                             `${attrib.parcelle.proprietaire?.prenom ?? ""} ${attrib.parcelle.proprietaire?.nom ?? ""
//                               }`.trim()
//                           )}
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Contact">
//                           {fmt(attrib.parcelle.proprietaire?.telephone)}
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Email">
//                           {fmt(attrib.parcelle.proprietaire?.email)}
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Adresse">
//                           {fmt(attrib.parcelle.proprietaire?.adresse)}
//                         </Descriptions.Item>
//                       </>
//                     )}
//                   </Descriptions>
//                  )}

//                   {/* ======= Alerte info ======= */}
//                   <Alert
//                     className="mt-4"
//                     type="info"
//                     showIcon
//                     message="Suivi"
//                     description={
//                       <>
//                         Vous recevrez un e-mail à chaque étape importante
//                         (validation, approbations, attribution définitive).
//                       </>
//                     }
//                   />
//                 </>
//               )}
//             </Card>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { DemandeurBreadcrumb } from "@/components";
import { getAttributionParcelleByDemande } from "@/services/attributionParcelleService";
import { getDetailsRequest, getFileRequest } from "@/services/requestService";
import {
  Card,
  Descriptions,
  Divider,
  Tag,
  Button,
  Space,
  Alert,
  Skeleton,
} from "antd";
import dayjs from "dayjs";

/* ================= helpers UI ================= */
const statutColor = (s) => {
  switch (String(s || "").toUpperCase()) {
    case "EN_ATTENTE":
    case "EN_COURS":
      return "processing";
    case "VALIDEE":
    case "APPROBATION_PREFET":
      return "blue";
    case "ATTRIBUTION_PROVISOIRE":
      return "gold";
    case "APPROBATION_CONSEIL":
      return "geekblue";
    case "ATTRIBUTION_DEFINITIVE":
      return "green";
    case "REJETEE":
      return "red";
    case "ANNULEE":
      return "volcano";
    default:
      return "default";
  }
};
const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const money = (v) =>
  v || v === 0 ? new Intl.NumberFormat("fr-FR").format(v) : "—";
const fmtDate = (v, withTime = false) =>
  v ? dayjs(v).format(withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY") : "—";

// détecte si la valeur ressemble à une URL/fichier
const isUrlLike = (v) =>
  typeof v === "string" && (v.startsWith("/") || v.startsWith("http"));
// construit une URL absolue depuis VITE_API_URL_SIMPLE
const toAbsUrl = (v) =>
  !v ? v : v.startsWith("http") ? v : (import.meta.env.VITE_API_URL_SIMPLE || "") + v;

const DocLink = ({ value, children = "Ouvrir" }) =>
  isUrlLike(value) ? (
    <a href={toAbsUrl(value)} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    fmt(value)
  );

export default function DemandeurDemandeDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [demande, setDemande] = useState(null);
  const [files, setFiles] = useState({ recto: null, verso: null });
  const [attrib, setAttrib] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [d, f, a] = await Promise.all([
        getDetailsRequest(String(id)).catch(() => null),
        getFileRequest(String(id)).catch(() => ({})),
        getAttributionParcelleByDemande(String(id)).catch(() => null),
      ]);

      setDemande(d?.item ?? d ?? null);

      const recto = f?.data?.recto ?? f?.recto ?? null;
      const verso = f?.data?.verso ?? f?.verso ?? null;
      setFiles({ recto, verso });

      setAttrib(a ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // petits raccourcis sûrs
  const lot = attrib?.parcelle?.lotissement;
  const loc = lot?.localite;

  // PVs: lien si URL, sinon texte
  const pv = useMemo(
    () => ({
      validationProvisoire:
        attrib?.pvValidationProvisoire ??
        (attrib?.pvCommision?.includes("VALIDATION") ? attrib?.pvCommision : null),
      attributionProvisoire:
        attrib?.pvAttributionProvisoire ??
        (attrib?.pvCommision?.includes("ATTRIBUTION_PROVISOIRE")
          ? attrib?.pvCommision
          : null),
      approbationPrefet:
        attrib?.pvApprobationPrefet ??
        (attrib?.pvCommision?.includes("APPROBATION_PREFET")
          ? attrib?.pvCommision
          : null),
      approbationConseil:
        attrib?.pvApprobationConseil ??
        (attrib?.pvCommision?.includes("APPROBATION_CONSEIL")
          ? attrib?.pvCommision
          : null),
      pvCommision: attrib?.pvCommision ?? null,
    }),
    [attrib]
  );

  return (
    <>
      <DemandeurBreadcrumb title={`Détails demande #${id}`} />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <Card
              title={`Demande #${id}`}
              extra={
                <Space>
                  <Tag color={statutColor(demande?.statut)}>
                    {demande?.statut || "—"}
                  </Tag>
                  <Link to="/demandeur/demandes">
                    <Button>Retour</Button>
                  </Link>
                </Space>
              }
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
              ) : (
                <>
                  {/* ======= Bloc Demande ======= */}
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Type de demande">
                      {fmt(demande?.typeDemande)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Titre demandé">
                      {fmt(demande?.typeTitre)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Superficie (m²)">
                      {fmt(demande?.superficie)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Usage prévu">
                      {fmt(demande?.usagePrevu)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Localité / Quartier">
                      {fmt(
                        demande?.quartier?.nom ??
                          demande?.localite?.nom ??
                          demande?.localite
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Créée le">
                      {fmtDate(demande?.dateCreation, true)}
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider />

                  {/* ======= Documents fournis (upload demandeur) ======= */}
                  <Descriptions
                    title="Documents fournis"
                    bordered
                    column={2}
                    size="small"
                  >
                    <Descriptions.Item label="Recto">
                      {files.recto ? <DocLink value={files.recto} /> : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Verso">
                      {files.verso ? <DocLink value={files.verso} /> : "—"}
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider />

                  {/* ======= Documents générés côté mairie ======= */}
                  {attrib && (
                    <>
                      <Descriptions
                        title="Documents générés"
                        bordered
                        column={2}
                        size="small"
                      >
                        <Descriptions.Item label="Notification d’attribution">
                          {attrib?.pdfNotificationUrl ? (
                            <DocLink value={attrib.pdfNotificationUrl} />
                          ) : (
                            "—"
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Bulletin de liquidation">
                          {attrib?.bulletinLiquidationUrl ? (
                            <DocLink value={attrib.bulletinLiquidationUrl} />
                          ) : (
                            "—"
                          )}
                        </Descriptions.Item>
                      </Descriptions>

                      <Divider />
                    </>
                  )}

                  {/* ======= Attribution ======= */}
                  {attrib && (
                    <Descriptions
                      title="Attribution & validations"
                      bordered
                      column={1}
                      size="small"
                    >
                      <Descriptions.Item label="Statut attribution">
                        {attrib?.statut ? (
                          <Tag color={statutColor(attrib.statut)}>
                            {attrib.statut}
                          </Tag>
                        ) : (
                          "—"
                        )}
                      </Descriptions.Item>

                      <Descriptions.Item label="État de paiement">
                        {attrib?.etatPaiement ? (
                          <Tag color="green">Payé</Tag>
                        ) : (
                          <Tag color="volcano">Non payé</Tag>
                        )}
                      </Descriptions.Item>

                      <Descriptions.Item label="Montant (FCFA)">
                        {money(attrib?.montant)}
                      </Descriptions.Item>

                      <Descriptions.Item label="Fréquence / périodicité">
                        {fmt(attrib?.frequence)}
                      </Descriptions.Item>

                      <Descriptions.Item label="Date d’effet">
                        {fmtDate(attrib?.dateEffet)}
                      </Descriptions.Item>

                      <Descriptions.Item label="Date de fin">
                        {fmtDate(attrib?.dateFin)}
                      </Descriptions.Item>

                      {/* PV par étape : lien si fichier, sinon texte */}
                      {/* <Descriptions.Item label="PV — Validation provisoire">
                        {isUrlLike(pv.validationProvisoire) ? (
                          <DocLink value={pv.validationProvisoire} />
                        ) : (
                          fmt(pv.validationProvisoire)
                        )}
                      </Descriptions.Item> */}

                      {/* <Descriptions.Item label="PV — Attribution provisoire">
                        {isUrlLike(pv.attributionProvisoire) ? (
                          <DocLink value={pv.attributionProvisoire} />
                        ) : (
                          fmt(pv.attributionProvisoire)
                        )}
                      </Descriptions.Item> */}

                      {/* <Descriptions.Item label="PV — Approbation Préfet">
                        {isUrlLike(pv.approbationPrefet) ? (
                          <DocLink value={pv.approbationPrefet} />
                        ) : (
                          fmt(pv.approbationPrefet)
                        )}
                      </Descriptions.Item> */}

                      {/* <Descriptions.Item label="PV — Approbation Conseil">
                        {isUrlLike(pv.approbationConseil) ? (
                          <DocLink value={pv.approbationConseil} />
                        ) : (
                          fmt(pv.approbationConseil)
                        )}
                      </Descriptions.Item> */}

                      {/* <Descriptions.Item label="Décision Conseil">
                        {fmt(attrib?.decisionConseil)}
                      </Descriptions.Item> */}

                      {/* Dates d’étapes */}
                      {/* <Descriptions.Item label="Validation provisoire le">
                        {fmtDate(attrib?.datesEtapes?.validationProvisoire, true)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Attribution provisoire le">
                        {fmtDate(attrib?.datesEtapes?.attributionProvisoire, true)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Approbation du Préfet le">
                        {fmtDate(attrib?.datesEtapes?.approbationPrefet, true)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Approbation du Conseil le">
                        {fmtDate(attrib?.datesEtapes?.approbationConseil, true)}
                      </Descriptions.Item> */}
                      <Descriptions.Item label="Attribution définitive le">
                        {fmtDate(attrib?.datesEtapes?.attributionDefinitive, true)}
                      </Descriptions.Item>

                      {/* {attrib?.canReopen === true && (
                        <Descriptions.Item label="Peut être réouvert ?">
                          Oui
                        </Descriptions.Item>
                      )} */}
                    </Descriptions>
                  )}

                  <Divider />

                  {/* ======= Parcelle ======= */}
                  {attrib?.parcelle && (
                    <Descriptions
                      title="Parcelle attribuée"
                      bordered
                      column={2}
                      size="small"
                    >
                      <Descriptions.Item label="Numéro">
                        {fmt(attrib?.parcelle?.numero)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Surface">
                        {fmt(attrib?.parcelle?.surface)} m²
                      </Descriptions.Item>
                      <Descriptions.Item label="Statut">
                        {fmt(attrib?.parcelle?.statut)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Coordonnées">
                        {fmt(attrib?.parcelle?.latitude)} / {fmt(attrib?.parcelle?.longitude)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Lotissement">
                        {fmt(lot?.nom)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Localité">
                        {fmt(loc?.nom)}
                      </Descriptions.Item>
                      {loc?.prix !== undefined && (
                        <Descriptions.Item label="Prix localité (FCFA)">
                          {money(loc.prix)}
                        </Descriptions.Item>
                      )}
                      {attrib?.parcelle?.proprietaire && (
                        <>
                          <Descriptions.Item label="Propriétaire">
                            {fmt(
                              `${attrib.parcelle.proprietaire?.prenom ?? ""} ${
                                attrib.parcelle.proprietaire?.nom ?? ""
                              }`.trim()
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label="Contact">
                            {fmt(attrib.parcelle.proprietaire?.telephone)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Email">
                            {fmt(attrib.parcelle.proprietaire?.email)}
                          </Descriptions.Item>
                          <Descriptions.Item label="Adresse">
                            {fmt(attrib.parcelle.proprietaire?.adresse)}
                          </Descriptions.Item>
                        </>
                      )}
                    </Descriptions>
                  )}

                  {/* ======= Alerte info ======= */}
                  <Alert
                    className="mt-4"
                    type="info"
                    showIcon
                    message="Suivi"
                    description={
                      <>
                        Vous recevrez un e-mail à chaque étape importante
                        (validation, approbations, attribution définitive).
                      </>
                    }
                  />
                </>
              )}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
