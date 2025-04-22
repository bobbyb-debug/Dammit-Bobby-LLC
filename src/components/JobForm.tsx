
import { useState, FormEvent } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCabinRates, calculateJobTotal, addJob } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const JobForm = ({ onJobAdded }: { onJobAdded?: () => void }) => {
  const { toast } = useToast();
  const cabinRates = getCabinRates();
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [cabin, setCabin] = useState<string>("");
  const [bedCount, setBedCount] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");
  const [total, setTotal] = useState<number>(0);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!date || !cabin || parseFloat(bedCount) <= 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newJob = addJob({
      date: new Date(date),
      cabin,
      bedCount: parseFloat(bedCount),
      notes,
      total,
    });
    
    toast({
      title: "Job added",
      description: `Job for ${cabin} has been added successfully.`
    });
    
    // Reset form
    setDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setCabin("");
    setBedCount("0");
    setNotes("");
    setTotal(0);
    
    if (onJobAdded) {
      onJobAdded();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log New Cleaning Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="cabin">Cabin</Label>
              <Select
                value={cabin}
                onValueChange={handleCabinChange}
              >
                <SelectTrigger id="cabin">
                  <SelectValue placeholder="Select cabin" />
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
              <Label htmlFor="bedCount">Number of Beds</Label>
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
                  step="0.01"
                  readOnly
                  className="bg-muted"
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

          <Button type="submit" className="w-full">
            Save Job
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobForm;
