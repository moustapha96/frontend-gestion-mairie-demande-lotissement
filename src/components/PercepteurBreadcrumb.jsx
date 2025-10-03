import { LuChevronsRight } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import PageMetaData from "./PageMetaData";
import { MoveLeft } from "lucide-react";

const PercepteurBreadcrumb = ({ title, SubTitle }) => {
  const navigate = useNavigate();
  return (
    <>
      <PageMetaData title={title} />
      <section className="hidden md:block">
        <div className="container">
          <div className="my-6 rounded-lg border border-default-200 bg-white dark:bg-default-50">
            <div className="flex items-center justify-between p-6">
              <h4 className="text-lg font-medium text-default-900">{title}</h4>

              {SubTitle && <>
                <h5 className="text-lg font-medium text-default-900">{SubTitle}</h5>
              </>}


              <div className="flex items-center justify-end gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    to="/agent/dashboard"
                    className="text-base font-medium text-default-900 transition-all duration-200 hover:text-primary"
                  >
                    Gestionnaire
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <LuChevronsRight className="size-5 text-default-900 rtl:rotate-180" />
                  <Link
                    to=""
                    className="text-base font-medium text-default-900"
                  >
                    {title}
                  </Link>
                </div>

              </div>

            </div>
            {window.location.pathname !== "/agent/dashboard" && <>
              <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className=" text-primary flex items-center gap-1"
                >
                  <MoveLeft className="mr-1" /> Retour
                </button>
              </div>
            </>}

          </div>
        </div>
      </section>
    </>
  );
};

export default PercepteurBreadcrumb;
