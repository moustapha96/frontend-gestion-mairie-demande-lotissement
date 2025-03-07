import { Link, useLocation } from "react-router-dom";
import { adminMenu } from "../data";
import { cn } from "@/utils";

const AdminMenu = () => {
  const { pathname } = useLocation();
  return (
    <nav className="admin-menu border-b border-default-200 bg-white text-sm font-medium shadow-sm shadow-default-100 dark:bg-default-50">
      <div className="custom-scroll container mx-auto flex w-full snap-x items-center overflow-x-auto py-2.5">
        {adminMenu.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="shrink-0 snap-center px-2">
              <Link
                to={item.link}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-default-600 transition-all hover:bg-default-100 hover:text-default-800 [&.active]:bg-primary/10 [&.active]:text-primary",
                  pathname === item.link && "active"
                )}
              >
                <Icon className="size-5" />
                <span>{item.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminMenu;
