
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CabinRate } from "@/types";
import { 
  getCabinRates, 
  updateCabinRate, 
  addCabinRate, 
  deleteCabinRate 
} from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const CabinRates = () => {
  const { toast } = useToast();
  const [cabinRates, setCabinRates] = useState<CabinRate[]>(getCabinRates());
  
  const [editingRate, setEditingRate] = useState<CabinRate | null>(null);
  const [newRate, setNewRate] = useState<Omit<CabinRate, "id">>({
    name: "",
    baseRate: 0,
    bedRate: 0,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const handleUpdateRate = () => {
    if (!editingRate) return;
    
    updateCabinRate(editingRate);
    setCabinRates(getCabinRates());
    
    toast({
      title: "Rate updated",
      description: `${editingRate.name} rates have been updated.`
    });
    
    setEditingRate(null);
  };
  
  const handleAddRate = () => {
    if (!newRate.name || newRate.baseRate <= 0 || newRate.bedRate <= 0) {
      toast({
        title: "Invalid rate info",
        description: "Please provide a name and valid rates.",
        variant: "destructive"
      });
      return;
    }
    
    addCabinRate(newRate);
    setCabinRates(getCabinRates());
    
    toast({
      title: "Cabin added",
      description: `${newRate.name} has been added to your cabins.`
    });
    
    setNewRate({
      name: "",
      baseRate: 0,
      bedRate: 0,
    });
  };
  
  const handleDeleteRate = () => {
    if (!deleteId) return;
    
    const rateToDelete = cabinRates.find(r => r.id === deleteId);
    if (!rateToDelete) return;
    
    deleteCabinRate(deleteId);
    setCabinRates(getCabinRates());
    
    toast({
      title: "Cabin deleted",
      description: `${rateToDelete.name} has been removed from your cabins.`
    });
    
    setDeleteId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cabin Rates</CardTitle>
        <CardDescription>
          Manage the base rates and per-bed cleaning fees for each cabin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Rates</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Cabin</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Cabin</DialogTitle>
                  <DialogDescription>
                    Enter the cabin name and cleaning rates
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="newName">Cabin Name</Label>
                    <Input
                      id="newName"
                      value={newRate.name}
                      onChange={(e) => setNewRate({...newRate, name: e.target.value})}
                      placeholder="e.g. Cedar Lodge"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newBaseRate">Base Rate ($)</Label>
                      <Input
                        id="newBaseRate"
                        type="number"
                        value={newRate.baseRate}
                        onChange={(e) => setNewRate({...newRate, baseRate: parseFloat(e.target.value) || 0})}
                        min="0"
                        step="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newBedRate">Per Bed Rate ($)</Label>
                      <Input
                        id="newBedRate"
                        type="number"
                        value={newRate.bedRate}
                        onChange={(e) => setNewRate({...newRate, bedRate: parseFloat(e.target.value) || 0})}
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddRate}>Add Cabin</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cabin Name</TableHead>
                  <TableHead>Base Rate</TableHead>
                  <TableHead>Per Bed Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cabinRates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No cabins configured
                    </TableCell>
                  </TableRow>
                ) : (
                  cabinRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.name}</TableCell>
                      <TableCell>${rate.baseRate.toFixed(2)}</TableCell>
                      <TableCell>${rate.bedRate.toFixed(2)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingRate(rate)}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Cabin Rate</DialogTitle>
                              <DialogDescription>
                                Update the rates for {editingRate?.name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {editingRate && (
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Cabin Name</Label>
                                  <Input
                                    id="name"
                                    value={editingRate.name}
                                    onChange={(e) => setEditingRate({
                                      ...editingRate,
                                      name: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="baseRate">Base Rate ($)</Label>
                                    <Input
                                      id="baseRate"
                                      type="number"
                                      value={editingRate.baseRate}
                                      onChange={(e) => setEditingRate({
                                        ...editingRate,
                                        baseRate: parseFloat(e.target.value) || 0
                                      })}
                                      min="0"
                                      step="5"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="bedRate">Per Bed Rate ($)</Label>
                                    <Input
                                      id="bedRate"
                                      type="number"
                                      value={editingRate.bedRate}
                                      onChange={(e) => setEditingRate({
                                        ...editingRate,
                                        bedRate: parseFloat(e.target.value) || 0
                                      })}
                                      min="0"
                                      step="0.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button onClick={handleUpdateRate}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteId(rate.id)}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {rate.name}</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove this cabin and its rates.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteRate}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CabinRates;
