import { Link } from "react-router-dom";
import { sources } from "../data";
import { LuUpload } from "react-icons/lu";

const Sources = () => {
  return (
    <div className="overflow-hidden rounded-md border border-default-200 bg-white dark:bg-default-50">
      <div className="flex items-center justify-between border-b border-default-200 px-4 py-3">
        <h4 className="text-lg text-default-900">Sources</h4>

      </div>
      <div>
        <table className="w-full">
          <thead className="border-b border-default-200 bg-default-100">
            <tr>
              <th className="p-2 text-start text-sm font-semibold text-default-900">
                Types
              </th>
              <th className="p-2 text-start text-sm font-semibold text-default-900">
                Sessions
              </th>
              <th className="p-2 text-start text-sm font-semibold text-default-900">
                Views
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-default-200">
            {sources.map((source, idx) => {
              return (
                <tr key={idx}>
                  <td className="p-2">{source.type}</td>
                  <td className="p-2">{source.session}</td>
                  <td className="p-2">{source.view}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sources;
