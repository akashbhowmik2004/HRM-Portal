import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";
import AdminContent from "../components/AdminContent";
import { useToast } from "../components/ToastProvider.jsx";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-[#0c1222]" : "bg-[#f5f6f8]"}`}>
      <div className="flex min-h-screen">
        <AdminSidebar
          activeItem={activeSection}
          onSelect={(item) => setActiveSection(item)}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <TopHeader
            user={{ name: "John Wick", role: "Super Admin", avatar: null }}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            isDarkMode={isDarkMode}
          />
          <main className="flex-1">
            <AdminContent
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
