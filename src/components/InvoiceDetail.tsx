import { useState, useRef } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types";
import { companyInfo, updateInvoiceStatus } from "@/lib/data";
import { Download, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
      description: `Invoice #${invoice.number} has been marked as ${status}.`,
    });
    onInvoiceUpdated?.();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    toast({
      title: "Generating PDF...",
      description: "This may take a moment.",
    });

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    pdf.addImage(imgData, "PNG", (pdfWidth - imgWidth) / 2, 20, imgWidth, imgHeight);
    pdf.save(`Invoice-${invoice.number}.pdf`);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Invoice #${invoice.number} from Dammit Bobby LLC`);
    const body = encodeURIComponent(
      `Please find attached Invoice #${invoice.number}.\nAmount Due: $${invoice.total.toFixed(
        2
      )}\nDue Date: ${format(invoice.dueDate, "MM/dd/yyyy")}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;

    toast({
      title: "Email client opened",
      description: "Please attach the downloaded PDF before sending.",
    });
  };

  return (
    <div>
      {!isPrinting && (
        <div className="flex justify-between mb-4 no-print">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Invoice #{invoice.number}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
          <div className="flex gap-2">
            {invoice.status !== "paid" && (
              <>
                <Button onClick={() => handleStatusChange("paid")}>Mark as Paid</Button>
                <Button onClick={() => handleStatusChange("overdue")}>Mark as Overdue</Button>
              </>
            )}
            <Button className="outline" onClick={handleDownloadPDF}><Download className="w-4 h-4 mr-2" />PDF</Button>
            <Button className="outline" onClick={handleEmail}><Mail className="w-4 h-4 mr-2" />Email</Button>
          </div>
        </div>
      )}

      <div ref={printRef} className="bg-white border rounded-lg p-6 shadow invoice-container print:p-0">
        <header className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">INVOICE</h1>
            <p className="text-sm">{companyInfo.name}</p>
            <p className="text-sm">{companyInfo.address}</p>
            <p className="text-sm">{companyInfo.city}, {companyInfo.state} {companyInfo.zip}</p>
            <p className="text-sm mt-2">{companyInfo.email}</p>
            <p className="text-sm">{companyInfo.phone}</p>
          </div>
          <img src="/logo.svg" alt="Logo" className="h-24 w-auto" />
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 p-3 rounded">
            <h3 className="font-semibold text-sm mb-1">Bill To</h3>
            <p>{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
            <p>{invoice.clientCity}, {invoice.clientState} {invoice.clientZip}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <h3 className="font-semibold text-sm mb-1">Invoice Info</h3>
            <p>Invoice #: {invoice.number}</p>
            <p>Invoice Date: {format(invoice.date, "MM/dd/yyyy")}</p>
            <p>Due Date: {format(invoice.dueDate, "MM/dd/yyyy")}</p>
          </div>
        </section>

        <table className="w-full invoice-table mb-6">
          <thead>
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>Description</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Rate</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.jobs.map((job, index) => {
              const isCustom = !job.cabin;
              const rate = isCustom
                ? job.hourlyRate
                : job.bedCount
                  ? job.total / job.bedCount
                  : job.total;

              return (
                <tr key={job.id}>
                  <td>{index + 1}</td>
                  <td>{isCustom ? "Custom Service" : "VFT Cleaning"}</td>
                  <td>
                    {isCustom
                      ? `${job.serviceName} (${job.startTime}–${job.endTime})`
                      : `${job.cabin} ${format(job.date, "MMM do, h:mm a")}`}
                  </td>
                  <td className="text-center">{isCustom ? job.hoursWorked : job.bedCount}</td>
                  <td className="text-right">${rate.toFixed(2)}</td>
                  <td className="text-right">${job.total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="text-right space-y-1">
            <div className="font-semibold text-lg">Total: ${invoice.total.toFixed(2)}</div>
            {invoice.status === "overdue" && (
              <div className="text-red-600 font-medium border-t pt-2">Overdue since {format(invoice.dueDate, "MM/dd/yyyy")}</div>
            )}
          </div>
        </div>

        <footer className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
          <p>Payment methods: Venmo @dammit-bobby, PayPal dammitbobby@example.com</p>
          <p className="mt-1">Thank you for your business!</p>
        </footer>
      </div>
    </div>
  );
};

export default InvoiceDetail;
