
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getInvoices } from "@/lib/data";
import InvoiceDetailComponent from "@/components/InvoiceDetail";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState(
    getInvoices().find(inv => inv.id === id)
  );
  
  useEffect(() => {
    if (!invoice) {
      // Invoice not found
      navigate("/invoices", { replace: true });
    }
  }, [invoice, navigate]);
  
  const handleInvoiceUpdated = () => {
    setInvoice(getInvoices().find(inv => inv.id === id));
  };
  
  if (!invoice) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate("/invoices")}
        >
          Back to Invoices
        </Button>
      </div>
      
      {/* Fixed: Component is self-contained and doesn't need props */}
      <InvoiceDetailComponent />
    </div>
  );
};

export default InvoiceDetail;
