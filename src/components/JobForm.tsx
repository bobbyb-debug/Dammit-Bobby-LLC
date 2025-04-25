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
  const [serviceName, setServiceName] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");
  const [total, setTotal] = useState<number>(0);

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculateHoursWorked = () => {
    if (!startTime || !endTime) return 0;
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    return Math.max(0, (end - start) / 60);
  };

  const updateTotal = () => {
    const hours = calculateHoursWorked();
    if (cabin) {
      const parsedBedCount = parseFloat(bedCount) || 0;
      setTotal(calculateJobTotal(cabin, parsedBedCount));
    } else {
      const rate = parseFloat(hourlyRate) || 0;
      setTotal(parseFloat((rate * hours).toFixed(2)));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const hoursWorked = calculateHoursWorked();

    if (!date || (!cabin && !serviceName)) {
      toast({
        title: "Missing info",
        description: "Please fill in date and either cabin or service name.",
        variant: "destructive"
      });
      return;
    }

    const newJob = addJob({
      date: new Date(date),
      cabin: cabin || undefined,
      bedCount: cabin ? parseFloat(bedCount) : undefined,
      serviceName: cabin ? undefined : serviceName,
      startTime: cabin ? undefined : startTime,
      endTime: cabin ? undefined : endTime,
      hoursWorked: cabin ? undefined : hoursWorked,
      hourlyRate: cabin ? undefined : parseFloat(hourlyRate),
      notes,
      total,
      createdAt: new Date(),
    });

    toast({ title: "Job added", description: `Job for ${cabin || serviceName} saved.` });

    setDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setCabin("");
    setBedCount("0");
    setServiceName("");
    setStartTime("");
    setEndTime("");
    setHourlyRate("0");
    setNotes("");
    setTotal(0);

    if (onJobAdded) onJobAdded();
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
              <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cabin">Cabin</Label>
              <Select value={cabin} onValueChange={(val) => { setCabin(val); updateTotal(); }}>
                <SelectTrigger id="cabin">
                  <SelectValue placeholder="Select cabin (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {cabinRates.map((rate) => (
                    <SelectItem key={rate.id} value={rate.name}>{rate.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!cabin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service Name</Label>
                <Input id="service" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourly">Hourly Rate ($)</Label>
                <Input
                  id="hourly"
                  type="number"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => { setHourlyRate(e.target.value); updateTotal(); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Input id="start" type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); updateTotal(); }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Input id="end" type="time" value={endTime} onChange={(e) => { setEndTime(e.target.value); updateTotal(); }} />
              </div>
            </div>
          )}

          {cabin && (
            <div className="space-y-2">
              <Label htmlFor="bedCount">Number of Beds</Label>
              <Input
                id="bedCount"
                type="number"
                step="0.25"
                value={bedCount}
                onChange={(e) => { setBedCount(e.target.value); updateTotal(); }}
                min="0"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Total</Label>
            <div className="flex items-center">
              <span className="mr-1 text-lg font-medium">$</span>
              <Input type="number" readOnly value={total.toFixed(2)} className="bg-muted" />
            </div>
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
