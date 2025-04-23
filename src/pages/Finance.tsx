
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getExpenses } from "@/lib/data";
import ExpenseList from "@/components/ExpenseList";
import ExpenseForm from "@/components/ExpenseForm";
import ProfitChart from "@/components/ProfitChart";

const Finance = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const expenses = getExpenses();
  
  const sortedExpenses = [...expenses].sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleDataChanged = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">
          Track your business income, expenses, and profitability
        </p>
      </div>
      
      <ProfitChart key={`chart-${refreshKey}`} />
      
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid grid-cols-2 md:w-[400px] mb-8">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="add">Add New Expense</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses">
          <ExpenseList 
            expenses={sortedExpenses} 
            showSearch={true}
            onExpensesChanged={handleDataChanged}
          />
        </TabsContent>
        
        <TabsContent value="add">
          <div className="max-w-2xl">
            <ExpenseForm onExpenseAdded={handleDataChanged} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
