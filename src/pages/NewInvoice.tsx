
import CreateInvoice from "@/components/CreateInvoice";

const NewInvoice = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
        <p className="text-muted-foreground">
          Select jobs and client details to generate an invoice
        </p>
      </div>
      
      <CreateInvoice />
    </div>
  );
};

export default NewInvoice;
