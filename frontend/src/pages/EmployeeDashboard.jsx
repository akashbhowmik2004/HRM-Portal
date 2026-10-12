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

  const fetchUserDetails = async () => {
    try {
      const response = await employee.get("/get-details");
      setUserDetails({
        ...response.data.user,
        employee: response.data.employee,
        attendancePercentage: response.data.attendancePercentage,
        attendanceCount: response.data.attendanceCount,
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
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="flex min-h-screen">
        <EmployeeSidebar
          activeItem={activeSection}
          onSelect={(item) => setActiveSection(item)}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-4 sm:p-5 lg:p-6">
          <TopHeader
            user={{
              name: userDetails?.name || "Employee",
              role: userDetails?.role || "Employee",
              avatar: null,
            }}
            role="employee"
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
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
