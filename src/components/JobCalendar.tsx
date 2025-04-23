
import { useState } from "react";
import { format, isEqual, isSameDay, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types";
import JobList from "./JobList";
import { cn } from "@/lib/utils";

interface JobCalendarProps {
  jobs: Job[];
}

const JobCalendar = ({ jobs }: JobCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  
  const jobsForSelectedDate = jobs.filter(job => isSameDay(job.date, selectedDate));
  
  const refreshJobs = () => {
    setRefreshKey(key => key + 1);
  };
  
  const jobsByDate = jobs.reduce((acc, job) => {
    const dateStr = format(job.date, "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        <Card>
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasJobs: (date) => 
                  !!jobsByDate[format(date, "yyyy-MM-dd")]?.length
              }}
              modifiersStyles={{
                hasJobs: { 
                  fontWeight: "bold", 
                  textDecoration: "underline", 
                  textDecorationColor: "rgba(147, 51, 234, 0.5)" 
                }
              }}
              components={{
                DayContent: (props) => {
                  const dateStr = format(props.date, "yyyy-MM-dd");
                  const dayJobs = jobsByDate[dateStr] || [];
                  return (
                    <div className="relative">
                      <div>{props.date.getDate()}</div>
                      {dayJobs.length > 0 && (
                        <Badge
                          className={cn(
                            "absolute -bottom-1 right-0 h-4 min-w-4 p-0 flex items-center justify-center",
                            isSameDay(props.date, selectedDate) ? "bg-white text-primary" : "bg-primary"
                          )}
                          variant={isSameDay(props.date, selectedDate) ? "outline" : "default"}
                        >
                          {dayJobs.length}
                        </Badge>
                      )}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Jobs for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          
          {jobsForSelectedDate.length === 0 ? (
            <p className="text-muted-foreground">No jobs scheduled for this date.</p>
          ) : (
            <JobList 
              jobs={jobsForSelectedDate}
              title={`Jobs on ${format(selectedDate, "MMM d")}`}
              showSearch={false}
              onJobsChanged={refreshJobs}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCalendar;
