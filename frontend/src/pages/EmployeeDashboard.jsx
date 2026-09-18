import { useState, useEffect } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import TopHeader from "../components/TopHeader";
import EmployeeContent from "../components/EmployeeContent";
import { useToast } from "../components/ToastProvider.jsx";
import { employee } from "../apis/axios.js";

const EmployeeDashboard = () => {
  const {showToast} = useToast();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [userDetails, setUserDetails] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const fetchUserDetails = async () => {
    try {
      const response = await employee.get("/get-details");
      setUserDetails({
        ...response.data.user,
        employee: response.data.employee,
      });
      console.log("User details:", response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      showToast("Failed to fetch user details.", "error");
    }
  }
  useEffect(() => {
    fetchUserDetails();
  }, []);

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
            user={{
              name: userDetails?.name || "Employee",
              role: userDetails?.role || "Employee",
              avatar: null,
            }}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            isDarkMode={isDarkMode}
          />
          <main className="flex-1">
            <EmployeeContent
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

export default EmployeeDashboard;
