import { LuUpload } from "react-icons/lu";
import { Link } from "react-router-dom";
import { recentOrders } from "../data";
import { cn } from "@/utils";

const RecentOrders = () => {
  return (
    <div className="overflow-hidden rounded-md border border-default-200 bg-white dark:bg-default-50">
      <div className="flex items-center justify-between border-b border-default-200 px-4 py-3">
        <h4 className="uppercase">Recent Orders</h4>

      </div>
      <div className="overflow-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-default-200">
              <thead>
                <tr className="bg-default-100">
                  <th
                    scope="col"
                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-start text-sm font-semibold text-default-900"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200">
                {recentOrders.map((order, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-default-100">
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-default-600">
                        #{order.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-default-600">
                        {order.product}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-default-600">
                        {order.customer}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-start text-default-600">
                        ${order.price}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-start text-default-600">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium",
                            order.status === "Declined"
                              ? "text-red-500 bg-red-500/10"
                              : order.status === "Pending"
                                ? "text-yellow-500 bg-yellow-500/10"
                                : "text-teal-500 bg-teal-500/10"
                          )}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
