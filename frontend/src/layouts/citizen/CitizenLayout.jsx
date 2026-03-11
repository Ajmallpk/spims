import TopNavigation from "@/layouts/citizen/TopNavigation";
import { Outlet } from "react-router-dom";

const CitizenLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation />

      <main className="max-w-3xl mx-auto py-6 px-4">
        <Outlet />
      </main>
      
    </div>
  );
};

export default CitizenLayout;