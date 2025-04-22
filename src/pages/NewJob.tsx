
import { useNavigate } from "react-router-dom";
import JobForm from "@/components/JobForm";

const NewJob = () => {
  const navigate = useNavigate();
  
  const handleJobAdded = () => {
    navigate("/jobs");
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Log New Job</h1>
        <p className="text-muted-foreground">
          Enter the details of your cleaning job
        </p>
      </div>
      
      <JobForm onJobAdded={handleJobAdded} />
    </div>
  );
};

export default NewJob;
