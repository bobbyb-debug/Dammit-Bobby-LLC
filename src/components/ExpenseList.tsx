
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Expense } from "@/types";
import { deleteExpense } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface ExpenseListProps {
  expenses: Expense[];
  title?: string;
  description?: string;
  limit?: number;
  showSearch?: boolean;
  onExpensesChanged?: () => void;
}

const ExpenseList = ({
  expenses,
  title = "Recent Expenses",
  description,
  limit,
  showSearch = false,
  onExpensesChanged,
}: ExpenseListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredExpenses = expenses.filter(expense => 
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayExpenses = limit ? filteredExpenses.slice(0, limit) : filteredExpenses;

  const handleDelete = (expenseId: string) => {
    if (window.confirm("Delete this expense? This cannot be undone.")) {
      deleteExpense(expenseId);
      toast({
        title: "Expense deleted",
        description: "The expense has been removed successfully."
      });
      if (onExpensesChanged) {
        onExpensesChanged();
      } else {
        window.location.reload();
      }
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
            <Label htmlFor="search" className="sr-only">Search Expenses</Label>
            <Input
              id="search"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No expenses found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(expense.date, "MMM dd, yyyy")}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {expense.description}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(expense.id)}
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

export default ExpenseList;
