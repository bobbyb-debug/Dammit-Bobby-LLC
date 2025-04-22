
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getInvoices } from "@/lib/data";
import InvoiceList from "@/components/InvoiceList";

const Invoices = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const invoices = getInvoices();

  const refreshInvoices = () => {
    setRefreshKey(key => key + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Create and manage client invoices
          </p>
        </div>
        
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/invoices/new">Create New Invoice</Link>
        </Button>
      </div>
      
      <InvoiceList 
        invoices={invoices} 
        title="All Invoices"
        showControls={true}
      />
    </div>
  );
};

export default Invoices;
