import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/feed");
    } else {
      navigate("/onboarding");
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-pulse">
        <div className="w-16 h-16 rounded-full gradient-primary" />
      </div>
    </div>
  );
};

export default Index;
