
/* eslint-disable react/prop-types */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Button, Card, Input, Modal, Select, Space, Table, Tag, Tooltip, message,
  InputNumber, DatePicker,
} from "antd";
import {
  CheckCircle2, MapPin, Layers, FileText, Ruler, Building2, Compass, Search, Info,
} from "lucide-react";
import dayjs from "dayjs";

import { AdminBreadcrumb as Breadcrumb } from "@/components";
import MapCar from "@/pages/admin/Map/MapCar";
import { formatPrice } from "@/utils/formatters";

import { getParcelleDisponibles } from "@/services/parcelleService";
import { getDetailsRequest } from "@/services/requestService";
import { createAttributionParcelle } from "@/services/attributionParcelleService";

const { Option } = Select;
const norm = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents (régularisation -> regularisation)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");



export default function AttributionParcelleRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [demande, setDemande] = useState(null);
  const [loadingDemande, setLoadingDemande] = useState(true);

  const [loading, setLoading] = useState(true);
  const [rawParcelles, setRawParcelles] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const selectedParcelle = useMemo(
    () => rawParcelles.find((p) => String(p.id) === String(selectedKey)) || null,
    [selectedKey, rawParcelles]
  );

  
const TYPE_DEMANDE_LABELS = {
  // EN -> FR
  occupancy_permit: "Permis d'occuper",
  communal_lease: "Bail communal",
  definitive_transfer: "Transfert définitif",

  // FR -> FR
  regularisation: "Régularisation",
  "régularisation": "Régularisation",

  // alias éventuels historiques
  attribution: "Permis d'occuper",
  authentication: "Authentification",
  authentification: "Authentification",
};

const toFrenchDemande = (v) => TYPE_DEMANDE_LABELS[norm(v)] || (v || "—");


  // Saisies
  const [superficieValue, setSuperficieValue] = useState(null);
  const [montantValue, setMontantValue] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(dayjs()); // par défaut aujourd’hui
  const [endDate, setEndDate] = useState(null);
  const [frequence, setFrequence] = useState(null);
  const [pvProvisoire, setPvProvisoire] = useState(""); // <-- PV obligatoire pour attribution provisoire

  // Filtres
  const [q, setQ] = useState("");
  const [localiteFilter, setLocaliteFilter] = useState(undefined);
  const [lotissementFilter, setLotissementFilter] = useState(undefined);

  const [mapOpen, setMapOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [details, dispo] = await Promise.all([
          getDetailsRequest(String(id)).catch(() => null),
          getParcelleDisponibles(id),
        ]);
        console.log("details"+ details);
        console.log("dispo", dispo);
        setDemande(details?.item ?? details ?? null);
        setRawParcelles(Array.isArray(dispo?.items) ? dispo.items : dispo || []);
      } catch {
        message.error("Erreur de chargement des données");
      } finally {
        setLoadingDemande(false);
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!selectedParcelle) {
      setSuperficieValue(null);
      setMontantValue(null);
      return;
    }
    const defSuper = selectedParcelle?.superficie ? selectedParcelle?.surface : demande?.superficie;
    const prixLocalite =
      selectedParcelle?.lotissement?.localite?.prix ??
      selectedParcelle?.localite?.prix ??
      null;
    const defMontant =
      selectedParcelle?.prix ??
      selectedParcelle?.montant ??
      (prixLocalite && defSuper ? Number(prixLocalite) * Number(defSuper) : null);

    setSuperficieValue(defSuper ?? null);
    setMontantValue(defMontant ?? null);
  }, [selectedParcelle, demande?.superficie]);

  const localiteOptions = useMemo(() => {
    const set = new Set();
    rawParcelles.forEach((p) => {
      const nom = p?.localite?.nom || p?.localite || p?.lotissement?.localite?.nom || null;
      if (nom) set.add(nom);
    });
    return [...set].map((n) => ({ label: n, value: n }));
  }, [rawParcelles]);

  const lotissementOptions = useMemo(() => {
    const set = new Set();
    rawParcelles.forEach((p) => {
      const nom = p?.lotissement?.nom || p?.lotissement || null;
      if (nom) set.add(nom);
    });
    return [...set].map((n) => ({ label: n, value: n }));
  }, [rawParcelles]);

  const data = useMemo(() => {
    return rawParcelles
      .filter((p) => {
        if (!p) return false;
        const matchesQ =
          !q ||
          String(p?.code || p?.numero || "").toLowerCase().includes(q.toLowerCase()) ||
          String(p?.lotissement?.nom || p?.lotissement || "").toLowerCase().includes(q.toLowerCase()) ||
          String(p?.localite?.nom || p?.localite || p?.lotissement?.localite?.nom || "")
            .toLowerCase()
            .includes(q.toLowerCase());
        const matchesLoc =
          !localiteFilter ||
          String(p?.localite?.nom || p?.localite || p?.lotissement?.localite?.nom || "") === String(localiteFilter);
        const matchesLot =
          !lotissementFilter ||
          String(p?.lotissement?.nom || p?.lotissement || "") === String(lotissementFilter);

        return matchesQ && matchesLoc && matchesLot && (p?.statut === "DISPONIBLE" || p?.disponible === true);
      })
      .map((p) => ({ key: String(p.id), ...p }));
  }, [rawParcelles, q, localiteFilter, lotissementFilter]);

  const columns = [
    { title: "N° parcelle", dataIndex: "numero", key: "numero", render: (v, r) => v || r?.code || "—" },
    { title: "Lotissement", key: "lotissement", render: (_, r) => r?.lotissement?.nom || r?.lotissement || "—" },
    { title: "Quartier", key: "localite", render: (_, r) => r?.lotissement?.localite?.nom || r?.localite?.nom || r?.localite || "—" },
    {
      title: "Prix (indicatif)", key: "prix",
      render: (_, r) => {
        const v = r?.prix ?? r?.montant ?? r?.lotissement?.localite?.prix;
        return v ? formatPrice(v) : "—";
      },
    },
    {
      title: "Coord.", key: "coords",
      render: (_, r) => {
        const lat = r?.latitude ?? r?.coord?.lat;
        const lng = r?.longitude ?? r?.coord?.lng;
        const ok = lat && lng && !isNaN(+lat) && !isNaN(+lng);
        return ok ? (
          <Tooltip title="Voir sur la carte">
            <Button
              size="small"
              type="text"
              icon={<MapPin className="w-4 h-4" />}
              onClick={(e) => { e.stopPropagation(); setSelectedKey(String(r.key)); setMapOpen(true); }}
            />
          </Tooltip>
        ) : <span className="text-gray-400">—</span>;
      },
    },
    {
      title: "Statut", key: "statut",
      render: (_, r) => {
        const dispo = r?.statut === "DISPONIBLE" || r?.disponible === true;
        return <Tag color={dispo ? "green" : "default"}>{dispo ? "Disponible" : r?.statut || "—"}</Tag>;
      },
    },
  ];

  const onConfirmAttribution = async () => {
    if (!selectedParcelle) return message.error("Veuillez sélectionner une parcelle.");
    if (superficieValue == null || isNaN(Number(superficieValue)) || Number(superficieValue) <= 0) {
      return message.error("Veuillez saisir une superficie valide (> 0).");
    }
    if (montantValue == null || isNaN(Number(montantValue)) || Number(montantValue) < 0) {
      return message.error("Veuillez saisir un montant valide (≥ 0).");
    }
    if (!frequence) return message.error("Veuillez choisir une fréquence de paiement.");
    if (!pvProvisoire?.trim()) return message.error("Le PV d’attribution provisoire est requis.");
    if (!effectiveDate) return message.error("Veuillez choisir une date d’effet.");
    if (endDate && dayjs(endDate).isBefore(dayjs(effectiveDate), "day")) {
      return message.error("La date de fin doit être postérieure ou égale à la date d’effet.");
    }

    Modal.confirm({
      title: "Attribuer cette parcelle ?",
      content: (
        <div className="text-sm space-y-1">
          <div><strong>Demande :</strong> #{id}</div>
          <div><strong>Parcelle :</strong> {selectedParcelle?.code || selectedParcelle?.numero || `#${selectedParcelle?.id}`}</div>
          <div><strong>Quartier :</strong> {selectedParcelle?.lotissement?.localite?.nom || selectedParcelle?.localite?.nom || selectedParcelle?.localite || "—"}</div>
          <div><strong>Lotissement :</strong> {selectedParcelle?.lotissement?.nom || selectedParcelle?.lotissement || "—"}</div>
          <div><strong>Superficie saisie :</strong> {Number(superficieValue)} m²</div>
          <div><strong>Fréquence de paiement :</strong> {frequence}</div>
          <div><strong>Montant saisi :</strong> {formatPrice(Number(montantValue))}</div>
          <div><strong>Date d’effet :</strong> {dayjs(effectiveDate).format("DD/MM/YYYY")}</div>
          <div><strong>Date de fin :</strong> {endDate ? dayjs(endDate).format("DD/MM/YYYY") : "—"}</div>
          <div><strong>Statut initial :</strong> ATTRIBUTION_PROVISOIRE</div>
          <div className="mt-2"><strong>PV (extrait) :</strong> <em>{pvProvisoire.slice(0, 120)}{pvProvisoire.length > 120 ? "…" : ""}</em></div>
        </div>
      ),
      okText: "Attribuer",
      cancelText: "Annuler",
      okButtonProps: { loading: submitting, type: "primary" },
      onOk: async () => {
        const body = {
          demandeId: id,
          parcelleId: selectedParcelle.id,
          // champs financiers / calendrier
          montant: Number(montantValue),
          frequence: frequence,
          dateEffet: dayjs(effectiveDate).toDate().toISOString(),
          dateFin: endDate ? dayjs(endDate).toDate().toISOString() : null,
          // statut + PV (côté back: pvCommision)
          statutAttribution: "ATTRIBUTION_PROVISOIRE",
          pvCommision: `[PV ATTRIBUTION_PROVISOIRE] ${pvProvisoire.trim()}`,
          // éventuellement utile si tu stockes la superficie côté back
          superficie: Number(superficieValue),
        };

        try {
          setSubmitting(true);
          const res = await createAttributionParcelle(body);
          message.success("Parcelle attribuée en ATTRIBUTION_PROVISOIRE.");
          navigate(`/admin/attributions/${res.id}/détails`);
        } catch (e) {
          message.error(e?.response?.data?.message || e?.message || "Échec de l’attribution.");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  return (
    <>
      <Breadcrumb title="Attribution d’une parcelle" />
      <section className="container my-6">
        <div className="grid grid-cols-1 gap-6">
          <Card
            className="border-l-4 border-primary"
            title={
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Demande #{id} — Attribution de parcelle</span>
              </div>
            }
            extra={<Link to={`/admin/requests/${id}`}><Button type="text">Retour aux détails</Button></Link>}
          >
            {!loadingDemande && demande ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow icon={<FileText className="w-4 h-4" />} label="Type de demande" value={ toFrenchDemande(demande?.typeDemande) || "—"} />
                <InfoRow icon={<Layers className="w-4 h-4" />} label="Statut" value={demande?.statut || "—"} />
                <InfoRow
                  icon={<Building2 className="w-4 h-4" />}
                  label="Demandeur"
                  value={
                    demande?.demandeur
                      ? `${demande.demandeur?.prenom ?? ""} ${demande.demandeur?.nom ?? ""}`.trim()
                      : `${demande?.prenom ?? ""} ${demande?.nom ?? ""}`.trim() || "—"
                  }
                />
                <InfoRow icon={<Ruler className="w-4 h-4" />} label="Usage prévu" value={demande?.usagePrevu || "—"} />
                <InfoRow icon={<Layers className="w-4 h-4" />} label="Quartier" value={demande?.localite || "—"} />
                {demande?.quartier && (
                  <>
                    <InfoRow icon={<Layers className="w-4 h-4" />} label="Quartier Existant" value={demande?.quartier.nom || "—"} />
                  </>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Chargement…</div>
            )}
          </Card>

          <Card className="border-l-4 border-primary" title="Parcelles disponibles">
            <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
              <div className="flex-1">
                <Input
                  allowClear
                  prefix={<Search size={16} />}
                  placeholder="Rechercher (code/numéro, lotissement, quartier)…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <Select
                allowClear
                className="min-w-[200px]"
                placeholder="Filtrer par quartier"
                value={localiteFilter}
                onChange={setLocaliteFilter}
                options={localiteOptions}
              />
              <Select
                allowClear
                className="min-w-[200px]"
                placeholder="Filtrer par lotissement"
                value={lotissementFilter}
                onChange={setLotissementFilter}
                options={lotissementOptions}
              />
              <Button
                onClick={() => {
                  setQ("");
                  setLocaliteFilter(undefined);
                  setLotissementFilter(undefined);
                }}
              >
                Réinitialiser
              </Button>
            </div>

            <Table
              size="middle"
              loading={loading}
              rowSelection={{
                type: "radio",
                selectedRowKeys: selectedKey ? [selectedKey] : [],
                onChange: (keys) => setSelectedKey(String(keys[0])),
              }}
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10, showTotal: (t) => `${t} parcelle(s)` }}
              onRow={(record) => ({ onClick: () => setSelectedKey(String(record.key)) })}
            />

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Sélectionnez une ligne, complétez les champs, puis « Attribuer ».
              </div>
              <Space>
                <Button type="primary" disabled={!selectedParcelle} loading={submitting} onClick={onConfirmAttribution}>
                  Attribuer au demandeur
                </Button>
              </Space>
            </div>
          </Card>

          {/* Détail + saisies */}
          <Card
            className="border-l-4 border-primary"
            title="Parcelle sélectionnée"
            extra={
              selectedParcelle &&
              (selectedParcelle?.latitude || selectedParcelle?.coord?.lat) &&
              (selectedParcelle?.longitude || selectedParcelle?.coord?.lng) && (
                <Tooltip title="Voir sur la carte">
                  <Button type="text" onClick={() => setMapOpen(true)} icon={<Compass className="w-4 h-4" />} />
                </Tooltip>
              )
            }
          >
            {!selectedParcelle ? (
              <div className="text-sm text-gray-500">Aucune parcelle sélectionnée.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow label="Code/N°" value={selectedParcelle?.code || selectedParcelle?.numero || `#${selectedParcelle?.id}`} />
                <InfoRow label="Lotissement" value={selectedParcelle?.lotissement?.nom || selectedParcelle?.lotissement || "—"} />
                <InfoRow label="Quartier" value={selectedParcelle?.lotissement?.localite?.nom || selectedParcelle?.localite?.nom || selectedParcelle?.localite || "—"} />

                {/* Superficie */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Superficie (m²)</span>
                  <InputNumber className="w-full" min={0} value={superficieValue} onChange={setSuperficieValue} step={1} placeholder="Ex: 150" />
                </div>

                {/* Montant */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Montant (FCFA)</span>
                  <InputNumber
                    className="w-full"
                    min={0}
                    value={montantValue}
                    onChange={setMontantValue}
                    step={1000}
                    formatter={(val) => (val != null ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "")}
                    parser={(val) => (val ? val.replace(/\s/g, "") : "")}
                    placeholder="Ex: 1 500 000"
                  />
                </div>

                {/* Date d’effet */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Date d’effet</span>
                  <DatePicker className="w-full" value={effectiveDate} onChange={setEffectiveDate} format="DD/MM/YYYY" />
                </div>

                {/* Date de fin */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Date de fin</span>
                  <DatePicker
                    className="w-full"
                    value={endDate}
                    onChange={setEndDate}
                    format="DD/MM/YYYY"
                    disabledDate={(d) => !!effectiveDate && d && d.isBefore(effectiveDate, "day")}
                    placeholder="Optionnel"
                  />
                </div>

                {/* Fréquence */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">Intervalle de paiement</span>
                  <Select
                    className="w-full"
                    value={frequence}
                    onChange={setFrequence}
                    placeholder="Choisir…"
                    options={[
                      { value: "1 mois", label: "1 mois" },
                      { value: "2 mois", label: "2 mois" },
                      { value: "5 mois", label: "5 mois" },
                      { value: "10 mois", label: "10 mois" },
                      { value: "12 mois", label: "12 mois" },
                      { value: "2 Année", label: "2 Année" },
                      { value: "3 Années", label: "3 Années" },
                      { value: "4 Années", label: "4 Années" },
                      { value: "5 Années", label: "5 Années" },
                    ]}
                  />
                </div>

                {/* PV (OBLIGATOIRE) */}
                <div className="sm:col-span-2">
                  <span className="text-xs text-gray-500">PV d’attribution provisoire (obligatoire)</span>
                  <Input.TextArea
                    rows={4}
                    value={pvProvisoire}
                    onChange={(e) => setPvProvisoire(e.target.value)}
                    placeholder="Colle ici le lien Drive ou décris le PV (référence, délibération, etc.)"
                  />
                </div>

                {/* Coordonnées (info) */}
                <InfoRow
                  label="Coordonnées"
                  value={
                    selectedParcelle?.latitude && selectedParcelle?.longitude
                      ? `${selectedParcelle.latitude}, ${selectedParcelle.longitude}`
                      : selectedParcelle?.coord?.lat && selectedParcelle?.coord?.lng
                        ? `${selectedParcelle.coord.lat}, ${selectedParcelle.coord.lng}`
                        : "—"
                  }
                />
              </div>
            )}
          </Card>
        </div>
      </section>

      <Modal title="Localisation de la parcelle" open={mapOpen} onCancel={() => setMapOpen(false)} width={1000} footer={null}>
        {selectedParcelle && (
          <MapCar
            latitude={selectedParcelle?.latitude ?? selectedParcelle?.coord?.lat}
            longitude={selectedParcelle?.longitude ?? selectedParcelle?.coord?.lng}
            selectedItem={selectedParcelle}
            type="parcelle"
          />
        )}
      </Modal>
    </>
  );
}

/* ---------- Petits composants ---------- */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      {icon ? <span className="text-gray-400">{icon}</span> : null}
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm">{value ?? "—"}</div>
      </div>
    </div>
  );
}
