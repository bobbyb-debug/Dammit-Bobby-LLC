
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from "@/types";
import { getCabinRates, calculateJobTotal, updateJob } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface JobEditDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobUpdated: () => void;
}

const JobEditDialog = ({ job, open, onOpenChange, onJobUpdated }: JobEditDialogProps) => {
  const { toast } = useToast();
  const cabinRates = getCabinRates();
  const [date, setDate] = useState<string>("");
  const [cabin, setCabin] = useState<string>("");
  const [bedCount, setBedCount] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (job) {
      setDate(format(job.date, "yyyy-MM-dd'T'HH:mm"));
      setCabin(job.cabin);
      setBedCount(job.bedCount.toString());
      setNotes(job.notes);
      setTotal(job.total);
    }
  }, [job]);

  const handleCabinChange = (cabinName: string) => {
    setCabin(cabinName);
    const parsedBedCount = parseFloat(bedCount) || 0;
    setTotal(calculateJobTotal(cabinName, parsedBedCount));
  };

  const handleBedCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBedCount = e.target.value;
    setBedCount(newBedCount);
    
    const parsedBedCount = parseFloat(newBedCount) || 0;
    if (cabin) {
      setTotal(calculateJobTotal(cabin, parsedBedCount));
    }
  };

  const handleSubmit = () => {
    if (!job) return;
    
    if (!date || !cabin || parseFloat(bedCount) < 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedJob = updateJob({
      ...job,
      date: new Date(date),
      cabin,
      bedCount: parseFloat(bedCount),
      notes,
      total,
    });
    
    toast({
      title: "Job updated",
      description: `Job for ${cabin} has been updated successfully.`
    });
    
    onOpenChange(false);
    onJobUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date and Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cabin">Service Type</Label>
              <Select
                value={cabin}
                onValueChange={handleCabinChange}
              >
                <SelectTrigger id="cabin">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {cabinRates.map((rate) => (
                    <SelectItem key={rate.id} value={rate.name}>
                      {rate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedCount">Number of Beds/Hours</Label>
              <Input
                id="bedCount"
                type="number"
                step="0.25"
                value={bedCount}
                onChange={handleBedCountChange}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total">Total Price</Label>
              <div className="flex items-center">
                <span className="mr-1 text-lg font-medium">$</span>
                <Input
                  id="total"
                  type="number"
                  value={total.toFixed(2)}
                  onChange={(e) => setTotal(parseFloat(e.target.value))}
                  step="0.01"
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobEditDialog;
