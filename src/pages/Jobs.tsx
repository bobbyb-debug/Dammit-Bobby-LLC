
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getJobs } from "@/lib/data";
import JobList from "@/components/JobList";

const Jobs = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const jobs = getJobs();
  
  // Sort jobs by date
  const sortedJobs = [...jobs].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Find upcoming jobs (today and future)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const upcomingJobs = sortedJobs.filter(job => job.date >= today);
  const pastJobs = sortedJobs.filter(job => job.date < today);

  const refreshJobs = () => {
    setRefreshKey(key => key + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Manage and track your cleaning jobs
          </p>
        </div>
        
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/jobs/new">Log New Job</Link>
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming Jobs</TabsTrigger>
          <TabsTrigger value="past">Past Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <JobList 
            jobs={upcomingJobs} 
            title="Upcoming Jobs"
            description="Jobs scheduled for today and future dates"
            showSearch={true}
            onJobsChanged={refreshJobs}
          />
        </TabsContent>
        
        <TabsContent value="past">
          <JobList 
            jobs={pastJobs} 
            title="Past Jobs"
            description="Previously completed cleaning jobs"
            showSearch={true}
            onJobsChanged={refreshJobs}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Jobs;
