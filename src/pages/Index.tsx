import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/onboarding");
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
