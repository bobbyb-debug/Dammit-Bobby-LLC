
import { useState } from "react";
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
import { Job } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JobListProps {
  jobs: Job[];
  title?: string;
  description?: string;
  limit?: number;
  showSearch?: boolean;
}

const JobList = ({
  jobs,
  title = "Recent Jobs",
  description,
  limit,
  showSearch = false,
}: JobListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredJobs = jobs.filter(job => 
    job.cabin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayJobs = limit ? filteredJobs.slice(0, limit) : filteredJobs;

  // TODO: Add editing logic later
  // For now, just stub handlers
  const handleEdit = (jobId: string) => {
    alert(`Editing job ${jobId} (feature coming soon)`);
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm("Delete this job? This cannot be undone.")) {
      // import deleteJob from data
      import("@/lib/data").then(({ deleteJob }) => {
        deleteJob(jobId);
        window.location.reload();
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        
        {showSearch && (
          <div className="mt-2 md:mt-0 md:w-72">
            <Label htmlFor="search" className="sr-only">Search Jobs</Label>
            <Input
              id="search"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No jobs found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Cabin</TableHead>
                  <TableHead>Beds</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{format(job.date, "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(job.date, "h:mm a")}</TableCell>
                    <TableCell>{job.cabin}</TableCell>
                    <TableCell>{job.bedCount}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {job.notes}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${job.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        className="text-blue-600 hover:underline mr-2"
                        onClick={() => handleEdit(job.id)}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(job.id)}
                        title="Delete"
                      >
                        Delete
                      </button>
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

export default JobList;

