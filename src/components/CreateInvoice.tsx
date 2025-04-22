
import { useState, FormEvent } from "react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Job, Invoice } from "@/types";
import { getJobs, addInvoice, getNextInvoiceNumber } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const allJobs = getJobs().sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientState, setClientState] = useState("");
  const [clientZip, setClientZip] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 15), "yyyy-MM-dd"));
  
  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const calculateTotal = () => {
    return allJobs
      .filter(job => selectedJobs.includes(job.id))
      .reduce((sum, job) => sum + job.total, 0);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (selectedJobs.length === 0) {
      toast({
        title: "No jobs selected",
        description: "Please select at least one job to create an invoice.",
        variant: "destructive"
      });
      return;
    }
    
    if (!clientName || !clientAddress || !clientCity || !clientState || !clientZip) {
      toast({
        title: "Missing client information",
        description: "Please fill in all client details.",
        variant: "destructive"
      });
      return;
    }
    
    const jobsForInvoice = allJobs.filter(job => selectedJobs.includes(job.id));
    const total = jobsForInvoice.reduce((sum, job) => sum + job.total, 0);
    
    const newInvoice: Omit<Invoice, "id"> = {
      number: getNextInvoiceNumber(),
      date: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      jobs: jobsForInvoice,
      clientName,
      clientAddress,
      clientCity,
      clientState,
      clientZip,
      status: "pending",
      total
    };
    
    const createdInvoice = addInvoice(newInvoice);
    
    toast({
      title: "Invoice created",
      description: `Invoice #${createdInvoice.number} has been created successfully.`
    });
    
    navigate(`/invoices/${createdInvoice.id}`);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
          <CardDescription>
            Select jobs and enter client information to generate an invoice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Full name or business"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAddress">Street Address</Label>
                  <Input
                    id="clientAddress"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Street address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientCity">City</Label>
                  <Input
                    id="clientCity"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientState">State</Label>
                  <Input
                    id="clientState"
                    value={clientState}
                    onChange={(e) => setClientState(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientZip">ZIP</Label>
                  <Input
                    id="clientZip"
                    value={clientZip}
                    onChange={(e) => setClientZip(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invoice Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Select Jobs</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      Preview Selected
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Selected Jobs</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Cabin</TableHead>
                            <TableHead>Beds</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allJobs
                            .filter(job => selectedJobs.includes(job.id))
                            .map(job => (
                              <TableRow key={job.id}>
                                <TableCell>{format(job.date, "MMM dd, yyyy")}</TableCell>
                                <TableCell>{job.cabin}</TableCell>
                                <TableCell>{job.bedCount}</TableCell>
                                <TableCell>{job.notes}</TableCell>
                                <TableCell className="text-right">
                                  ${job.total.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          <TableRow>
                            <TableCell colSpan={4} className="text-right font-medium">
                              Total:
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              ${calculateTotal().toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Cabin</TableHead>
                      <TableHead>Beds</TableHead>
                      <TableHead className="hidden md:table-cell">Notes</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allJobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No jobs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      allJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={selectedJobs.includes(job.id)}
                              onCheckedChange={() => toggleJobSelection(job.id)}
                            />
                          </TableCell>
                          <TableCell>{format(job.date, "MMM dd")}</TableCell>
                          <TableCell>{job.cabin}</TableCell>
                          <TableCell>{job.bedCount}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                            {job.notes}
                          </TableCell>
                          <TableCell className="text-right">
                            ${job.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {selectedJobs.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-right font-medium">
                          Total Selected:
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${calculateTotal().toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Button type="submit" disabled={selectedJobs.length === 0}>
              Create Invoice
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateInvoice;
