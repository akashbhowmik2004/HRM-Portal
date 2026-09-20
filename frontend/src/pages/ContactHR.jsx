import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { api } from "../apis/axios";

const ContactHR = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.issue) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post("/issues", formData);
      showToast("Your issue has been submitted successfully.", "success");
      setFormData({ name: "", email: "", issue: "" });
      navigate("/");
    } catch (error) {
      console.error("Failed to submit issue:", error);
      showToast("Failed to submit issue. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col font-sans">
      <div className="p-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-soft w-full max-w-[500px] border border-gray-100/80">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
              Contact HR
            </h2>
            <p className="text-gray-500 text-sm">
              Please provide your details and describe the issue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all text-gray-800 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all text-gray-800 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Issue Description
              </label>
              <textarea
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                placeholder="Describe your issue..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all text-gray-800 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactHR;
