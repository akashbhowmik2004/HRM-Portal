import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TopHeader from "../components/TopHeader";
import AdminContent from "../components/AdminContent";
import { useToast } from "../components/ToastProvider.jsx";
import { auth } from "../apis/axios.js";
import LoadingPage from "../components/LoadingPage";

const AdminDashboard = () => {
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
        title="Loading Admin Dashboard"
        subtitle="Preparing employees, reports, and settings..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F5F8] dark:bg-[#0f172a]">
      <div className="flex min-h-screen">
        <AdminSidebar
          activeItem={activeSection}
          onSelect={(item) => setActiveSection(item)}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden p-3 sm:p-5 lg:p-6">
          <TopHeader
            user={{ name: userDetails?.name || "Admin", role: userDetails?.role || "Admin", avatar: null }}
            role="admin"
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
          <main className="flex-1">
            <AdminContent
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

export default AdminDashboard;
