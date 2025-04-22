
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Invoice } from "@/types";

interface InvoiceListProps {
  invoices: Invoice[];
  title?: string;
  description?: string;
  limit?: number;
  showControls?: boolean;
}

const InvoiceList = ({
  invoices,
  title = "Recent Invoices",
  description,
  limit,
  showControls = false,
}: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredInvoices = invoices
    .filter(invoice => 
      (statusFilter === "all" || invoice.status === statusFilter) &&
      (invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       invoice.number.includes(searchTerm))
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const displayInvoices = limit ? filteredInvoices.slice(0, limit) : filteredInvoices;

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "overdue":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        
        {showControls && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <div className="w-full sm:w-auto">
              <Label htmlFor="statusFilter" className="sr-only">Filter by Status</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger id="statusFilter" className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <Input
                id="search"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No invoices found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link to={`/invoices/${invoice.id}`} className="text-brand-blue hover:underline">
                        {invoice.number}
                      </Link>
                    </TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{format(invoice.date, "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(invoice.dueDate, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <span className={`capitalize font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${invoice.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
