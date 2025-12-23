import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("pantora_user");
    if (user) {
      navigate("/home");
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-pulse">
        <div className="w-16 h-16 rounded-full gradient-primary" />
      </div>
    </div>
  );
};

export default Index;
