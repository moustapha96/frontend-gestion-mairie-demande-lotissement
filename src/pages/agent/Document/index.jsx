import { AgentBreadcrumb } from "@/components";

import DocumentListe from "./components/DocumentListe";

const AgentDocument = () => {
  return (
    <>
      <AgentBreadcrumb title="Liste Documents" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <DocumentListe />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AgentDocument;
