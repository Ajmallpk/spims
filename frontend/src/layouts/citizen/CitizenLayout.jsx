// citizen/layout/CitizenLayout.jsx
import { Outlet } from "react-router-dom";
import CitizenSidebar from "@/components/citizen/CitizenSidebar";
import CitizenHeader from "@/components/citizen/CitizenHeader";

export default function CitizenLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <CitizenHeader />
      <div className="flex flex-1 pt-16">
        <CitizenSidebar />
        <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}