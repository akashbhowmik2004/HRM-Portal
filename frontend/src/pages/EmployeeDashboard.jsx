import { useState, useEffect } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import TopHeader from "../components/TopHeader";
import EmployeeContent from "../components/EmployeeContent";
import { useToast } from "../components/ToastProvider.jsx";

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("hrm_dark_mode") === "true");


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("hrm_dark_mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("hrm_dark_mode", "false");
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-[#0c1222]" : "bg-[#f5f6f8]"}`}>
      <div className="flex min-h-screen">
        <EmployeeSidebar
          activeItem={activeSection}
          onSelect={(item) => setActiveSection(item)}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <TopHeader
            user={{ name: "Akash Bhowmik", role: "Employee", avatar: null }}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            isDarkMode={isDarkMode}
          />
          <main className="flex-1">
            <EmployeeContent activeSection={activeSection} setActiveSection={setActiveSection}/>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
