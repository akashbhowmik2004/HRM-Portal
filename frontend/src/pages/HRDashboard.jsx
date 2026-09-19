import { useState, useEffect } from "react";
import HRSidebar from "../components/HRSidebar";
import TopHeader from "../components/TopHeader";
import HRContent from "../components/HRContent";
import { useToast } from "../components/ToastProvider.jsx";
import { auth } from "../apis/axios.js";

const HRDashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const { showToast } = useToast();

  const fetchUserDetails = async () => {
    try {
      const response = await auth.get("/verify");
      if (response.data.success) {
        setUserDetails(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-[#0c1222]" : "bg-[#f5f6f8]"}`}>
      <div className="flex min-h-screen">
        <HRSidebar
          activeItem={activeSection}
          onSelect={(item) => setActiveSection(item)}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <TopHeader
            user={{ name: userDetails?.name || "HR Manager", role: userDetails?.role || "HR", avatar: null }}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            isDarkMode={isDarkMode}
            onAttendanceUpdate={fetchUserDetails}
          />
          <main className="flex-1">
            <HRContent
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              userDetails={userDetails}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
