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

  return (
    <div className="min-h-screen bg-[#F4F8F6]">
      <div className="flex min-h-screen">
        <HRSidebar
          activeItem={activeSection}
          onSelect={(item) => setActiveSection(item)}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-4 sm:p-5 lg:p-6">
          <TopHeader
            user={{ name: userDetails?.name || "HR Manager", role: userDetails?.role || "HR", avatar: null }}
            role="hr"
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
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
