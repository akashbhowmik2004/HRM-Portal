import { useState, useEffect } from "react";
import HRSidebar from "../components/HRSidebar";
import TopHeader from "../components/TopHeader";
import HRContent from "../components/HRContent";
import { useToast } from "../components/ToastProvider.jsx";
import { auth } from "../apis/axios.js";
import LoadingPage from "../components/LoadingPage";

const HRDashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  const fetchUserDetails = async () => {
    try {
      const response = await auth.get("/verify");
      if (response.data.success) {
        setUserDetails(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (isLoading) {
    return (
      <LoadingPage
        title="Loading HR Dashboard"
        subtitle="Preparing employees, leave requests, and reports..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#0f172a]">
      <div className="flex min-h-screen">
        <HRSidebar
          activeItem={activeSection}
          onSelect={(item) => setActiveSection(item)}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-3 sm:p-5 lg:p-6">
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
