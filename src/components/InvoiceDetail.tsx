
import { useState, useRef } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types";
import { companyInfo, updateInvoiceStatus } from "@/lib/data";
import { 
  Download,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceDetailProps {
  invoice: Invoice;
  onInvoiceUpdated?: () => void;
}

const InvoiceDetail = ({ invoice, onInvoiceUpdated }: InvoiceDetailProps) => {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    }
  };

  const handleStatusChange = (status: Invoice["status"]) => {
    updateInvoiceStatus(invoice.id, status);
    toast({
      title: "Status updated",
      description: `Invoice #${invoice.number} has been marked as ${status}.`
    });
    if (onInvoiceUpdated) {
      onInvoiceUpdated();
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Invoice #${invoice.number} from Dammit Bobby LLC`);
    const body = encodeURIComponent(`Please find attached Invoice #${invoice.number} from Dammit Bobby LLC.\n\nAmount Due: $${invoice.total.toFixed(2)}\nDue Date: ${format(invoice.dueDate, "MM/dd/yyyy")}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    
    toast({
      title: "Email client opened",
      description: "Please attach the invoice PDF before sending."
    });
  };

  // Calculate totals
  const subtotal = invoice.jobs.reduce((sum, job) => sum + job.total, 0);

  return (
    <div>
      {!isPrinting && (
        <div className="mb-6 flex flex-wrap gap-2 items-center justify-between no-print">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold">Invoice #{invoice.number}</h2>
            <div 
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(invoice.status)}`}
            >
              {invoice.status}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {invoice.status !== "paid" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange("paid")}
                >
                  Mark as Paid
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange("overdue")}
                >
                  Mark as Overdue
                </Button>
              </>
            )}
            <Button
              variant="outline" 
              size="sm"
              onClick={handleEmail}
            >
              <Mail size={16} className="mr-2" />
              Email
            </Button>
            <Button
              variant="default" 
              size="sm"
              onClick={handlePrint}
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      )}

      <div 
        ref={printRef}
        className={`invoice-container max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-8 print:p-0 print:shadow-none ${isPrinting ? '' : 'border'}`}
      >
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue mb-1">INVOICE</h1>
            <div className="text-sm">
              <p className="font-semibold">{companyInfo.name}</p>
              <p>{companyInfo.address}</p>
              <p>{companyInfo.city}, {companyInfo.state} {companyInfo.zip}</p>
            </div>
            <div className="text-sm mt-2">
              <p>{companyInfo.email}</p>
              <p>{companyInfo.phone}</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <img src="/logo.svg" alt={companyInfo.name} className="h-24 w-auto" />
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-sm mb-2">Bill to</h3>
            <p className="font-medium">{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
            <p>{invoice.clientCity}, {invoice.clientState} {invoice.clientZip} USA</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-sm mb-2">Ship to</h3>
            <p className="font-medium">{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
            <p>{invoice.clientCity}, {invoice.clientState} {invoice.clientZip} USA</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-gray-50 p-4 rounded mb-10">
          <h3 className="font-semibold text-sm mb-2">Invoice details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Invoice no.</p>
              <p>{invoice.number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Terms</p>
              <p>Due on receipt</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Invoice date</p>
              <p>{format(invoice.date, "MM/dd/yyyy")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due date</p>
              <p>{format(invoice.dueDate, "MM/dd/yyyy")}</p>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="overflow-x-auto mb-10">
          <table className="w-full invoice-table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Product or service</th>
                <th>Description</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Rate</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.jobs.map((job, index) => {
                // Calculate the rate based on the total and bed count
                const rate = job.bedCount ? (job.total / job.bedCount).toFixed(2) : job.total.toFixed(2);
                
                return (
                  <tr key={job.id}>
                    <td>{index + 1}.</td>
                    <td>VFT Cleaning</td>
                    <td>
                      {job.cabin} {format(job.date, "MMM do")} {format(job.date, "h:mm-")}
                      {format(new Date(job.date.getTime() + 2 * 60 * 60 * 1000), "h:mm")}
                    </td>
                    <td className="text-center">{job.bedCount}</td>
                    <td className="text-right">${rate}</td>
                    <td className="text-right">${job.total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Invoice Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-2 font-medium">
              <span>Total</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
            
            {invoice.status === "overdue" && (
              <div className="flex justify-between py-2 text-red-600 font-bold border-t">
                <span>Overdue</span>
                <span>{format(invoice.dueDate, "MM/dd/yyyy")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods (optional) */}
        <div className="text-sm text-center text-gray-600 pt-6 border-t">
          <p>Payment methods: Venmo @dammit-bobby, PayPal dammitbobby@example.com</p>
          <p className="mt-1">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
