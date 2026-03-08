import TopNavigation from "./TopNavigation";

const CitizenLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation />
      <main className="max-w-3xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default CitizenLayout;