
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInvoice, updateInvoiceStatus } from "@/lib/data";
import { Invoice } from "@/types";
import { generateInvoicePDF } from "@/lib/pdf";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const inv = getInvoice(id);
      setInvoice(inv);
    }
  }, [id]);

  const handleStatusChange = (status: "pending" | "paid" | "overdue") => {
    if (id) {
      const updatedInvoice = updateInvoiceStatus(id, status);
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
      }
    }
  };

  if (!invoice) {
    return <div>Loading invoice...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice #{invoice.number}</h1>
          <p className="text-muted-foreground">
            View and manage invoice details
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button 
            onClick={() => navigate('/invoices')}
            variant="outline"
          >
            Back to Invoices
          </Button>
          <Button 
            onClick={() => generateInvoicePDF(invoice.id, "invoice-content")} 
            variant="outline" 
            className="ml-auto"
          >
            Download PDF
          </Button>
        </div>
      </div>

      <div id="invoice-content" className="bg-white p-6 rounded-lg shadow-sm">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
            <CardDescription>Details for invoice #{invoice.number}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Client Information</h3>
                <p>Name: {invoice.clientName}</p>
                <p>Address: {invoice.clientAddress}</p>
                <p>{invoice.clientCity}, {invoice.clientState} {invoice.clientZip}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Invoice Details</h3>
                <p>Date: {format(invoice.date, "MMM dd, yyyy")}</p>
                <p>Due Date: {format(invoice.dueDate, "MMM dd, yyyy")}</p>
                <p>
                  Status:{" "}
                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "outline"  // Changed from "success" to "outline"
                        : invoice.status === "overdue"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </p>
                <div className="flex space-x-2">
                  {invoice.status !== "paid" && (
                    <Button size="sm" onClick={() => handleStatusChange("paid")}>
                      Mark as Paid
                    </Button>
                  )}
                  {invoice.status !== "pending" && (
                    <Button size="sm" onClick={() => handleStatusChange("pending")}>
                      Mark as Pending
                    </Button>
                  )}
                  {invoice.status !== "overdue" && (
                    <Button size="sm" onClick={() => handleStatusChange("overdue")}>
                      Mark as Overdue
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Jobs Included</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Beds/Hours</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>{format(job.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{job.cabin}</TableCell>
                        <TableCell>{job.bedCount}</TableCell>
                        <TableCell className="max-w-xs truncate">{job.notes}</TableCell>
                        <TableCell className="text-right">${job.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold">Total: ${invoice.total.toFixed(2)}</h2>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetail;
