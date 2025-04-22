
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
import { useToast } from "@/hooks/use-toast";
import { companyInfo } from "@/lib/data";
import CabinRates from "@/components/CabinRates";

const Settings = () => {
  const { toast } = useToast();
  const [company, setCompany] = useState({ ...companyInfo });
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, this would save to localStorage or a backend API
    toast({
      title: "Settings saved",
      description: "Your company information has been updated"
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your company information and rates
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company details that appear on invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={company.state}
                      onChange={(e) => setCompany({ ...company, state: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={company.zip}
                      onChange={(e) => setCompany({ ...company, zip: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <Button type="submit">Save Company Info</Button>
            </form>
          </CardContent>
        </Card>
        
        <CabinRates />

        <Card>
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
            <CardDescription>
              Configure payment methods to display on invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="venmo">Venmo Username</Label>
                <Input
                  id="venmo"
                  placeholder="@your-venmo-username"
                  defaultValue="@dammit-bobby"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paypal">PayPal Email</Label>
                <Input
                  id="paypal"
                  type="email"
                  placeholder="your-email@example.com"
                  defaultValue="dammitbobby@example.com"
                />
              </div>
            </div>
            
            <Button className="mt-6">Save Payment Options</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
