
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to Dammit Bobby LLC</h1>
      <p className="text-xl text-muted-foreground max-w-md">
  Service tracking, job logging, and invoice generation for cleaning, labor, and more.
</p>

      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link to="/dashboard">
          <Button size="lg" className="gap-2">
            Go to Dashboard
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
