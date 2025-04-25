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

  const filteredJobs = jobs.filter((job) =>
    (job.cabin + job.serviceName + job.notes).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayJobs = limit ? filteredJobs.slice(0, limit) : filteredJobs;

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>

        {showSearch && (
          <div className="mt-2 md:mt-0 md:w-72">
            <Label htmlFor="search" className="sr-only">
              Search Jobs
            </Label>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayJobs.map((job) => {
                  const isCabin = !!job.cabin;

                  return (
                    <TableRow key={job.id}>
                      <TableCell>{format(new Date(job.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        {isCabin ? "Cabin" : "Service"}
                      </TableCell>
                      <TableCell className="whitespace-pre-line">
                        {isCabin ? (
                          <>
                            <div><strong>Cabin:</strong> {job.cabin}</div>
                            <div><strong>Beds:</strong> {job.bedCount}</div>
                          </>
                        ) : (
                          <>
                            <div><strong>Service:</strong> {job.serviceName}</div>
                            <div><strong>Time:</strong> {job.startTime}–{job.endTime}</div>
                            <div><strong>Hours:</strong> {job.hoursWorked}</div>
                            <div><strong>Rate:</strong> ${job.hourlyRate}</div>
                          </>
                        )}
                        {job.notes && <div className="text-xs text-muted-foreground mt-1">📝 {job.notes}</div>}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${job.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobList;
