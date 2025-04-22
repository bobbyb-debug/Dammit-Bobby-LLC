
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to the dashboard
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  
  return null;
};

export default Index;
