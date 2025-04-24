"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  PencilIcon,
  PieChart,
  PlusIcon,
  Search,
  TrashIcon,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useIsMobile } from "../hooks/use-mobile";

type CategoryKey =
  | "Groceries"
  | "Dining"
  | "Entertainment"
  | "Transportation"
  | "Housing"
  | "Utilities"
  | "Subscriptions"
  | "Shopping"
  | "Health"
  | "Income";

type Category = {
  id: string;
  name: string;
  color: string;
};

const categories: Record<CategoryKey, Category> = {
  Groceries: {
    id: "1",
    name: "Groceries",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  Dining: {
    id: "2",
    name: "Dining",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  Entertainment: {
    id: "3",
    name: "Entertainment",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  Transportation: {
    id: "4",
    name: "Transportation",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  Housing: {
    id: "5",
    name: "Housing",
    color: "bg-slate-100 text-slate-800 border-slate-200",
  },
  Utilities: {
    id: "6",
    name: "Utilities",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  Subscriptions: {
    id: "7",
    name: "Subscriptions",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
  Shopping: {
    id: "8",
    name: "Shopping",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  Health: {
    id: "9",
    name: "Health",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  Income: {
    id: "10",
    name: "Income",
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

const transactionFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Amount must be a number",
  }),
  type: z.enum(["CREDIT", "DEBIT"]),
  category_id: z.string().min(1, "Category is required"),
  account_id: z.string().min(1, "Account is required"),
  transaction_date: z.string().min(1, "Date is required"),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface Transaction {
  id: string;
  transaction_date: string;
  description: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  category: {
    id: string;
    name: string;
  };
  account: {
    id: string;
    type: string;
  };
}

interface ChartAreaInteractiveProps {
  accounts: any[];
}

interface FormFieldProps {
  field: ControllerRenderProps<
    TransactionFormValues,
    keyof TransactionFormValues
  >;
}

export function ChartAreaInteractive({ accounts }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const supabase = createClientComponentClient();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      type: "DEBIT",
      category_id: "",
      account_id: "",
      transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const [transactionsRes, categoriesRes] = await Promise.all([
          supabase
            .from("transactions")
            .select(
              `
              *,
              category:categories(*),
              account:financial_accounts(*)
            `
            )
            .eq("user_id", session.user.id)
            .order("transaction_date", { ascending: false }),
          supabase.from("categories").select("*"),
        ]);

        if (transactionsRes.error) throw transactionsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;

        setTransactions(transactionsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      if (editingTransaction) {
        // Update existing transaction
        const { error } = await supabase
          .from("transactions")
          .update({
            description: data.description,
            amount: Number(data.amount),
            type: data.type,
            category_id: data.category_id,
            account_id: data.account_id,
            transaction_date: data.transaction_date,
          })
          .eq("id", editingTransaction.id);

        if (error) throw error;
        toast.success("Transaction updated successfully");
      } else {
        // Create new transaction
        const { error } = await supabase.from("transactions").insert([
          {
            user_id: session.user.id,
            description: data.description,
            amount: Number(data.amount),
            type: data.type,
            category_id: data.category_id,
            account_id: data.account_id,
            transaction_date: data.transaction_date,
          },
        ]);

        if (error) throw error;
        toast.success("Transaction created successfully");
      }

      setIsOpen(false);
      setEditingTransaction(null);
      form.reset();
      // Refresh transactions
      const { data: newTransactions, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          category:categories(*),
          account:financial_accounts(*)
        `
        )
        .eq("user_id", session.user.id)
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      setTransactions(newTransactions || []);
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Failed to save transaction");
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId);

      if (error) throw error;

      toast.success("Transaction deleted successfully");
      setTransactions(transactions.filter((t) => t.id !== transactionId));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    form.reset({
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString(),
      type: transaction.type,
      category_id: transaction.category.id,
      account_id: transaction.account.id,
      transaction_date: transaction.transaction_date.split("T")[0],
    });
    setIsOpen(true);
  };

  // filter transactions by date range
  const dateFilteredTransactions = transactions.filter((item) => {
    const date = new Date(item.transaction_date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // filter by search term and category
  const filteredTransactions = dateFilteredTransactions.filter(
    (transaction) => {
      const matchesSearch =
        searchTerm === "" ||
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.category.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        transaction.category.name === categoryFilter;

      return matchesSearch && matchesCategory;
    }
  );

  // calculate total expenses by category
  const categoryTotals = dateFilteredTransactions.reduce(
    (acc: Record<string, number>, transaction) => {
      if (transaction.type === "DEBIT") {
        const absAmount = Math.abs(transaction.amount);
        acc[transaction.category.name] =
          (acc[transaction.category.name] || 0) + absAmount;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // calculate total expenses
  const totalExpenses = Object.values(categoryTotals).reduce(
    (sum, amount) => sum + amount,
    0
  );

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Spending Analysis</CardTitle>
          <CardDescription>Loading transactions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Spending Analysis</CardTitle>
        <CardDescription>
          <span>View and analyze your transactions by category</span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction
                    ? "Edit Transaction"
                    : "Add New Transaction"}
                </DialogTitle>
                <DialogDescription>
                  {editingTransaction
                    ? "Update your transaction details"
                    : "Add a new transaction to track your spending"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }: FormFieldProps) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }: FormFieldProps) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }: FormFieldProps) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CREDIT">Credit</SelectItem>
                            <SelectItem value="DEBIT">Debit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }: FormFieldProps) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(categories).map(
                              ([name, category]) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="account_id"
                    render={({ field }: FormFieldProps) => (
                      <FormItem>
                        <FormLabel>Account</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.type} - ${account.balance.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transaction_date"
                    render={({ field }: FormFieldProps) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      {editingTransaction ? "Update" : "Create"} Transaction
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="flex w-40" aria-label="Select time range">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* category breakdown */}
          <div className="w-full lg:w-1/3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <PieChart className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="text-sm font-medium">Category Breakdown</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([category, total]) => (
                  <div
                    key={category}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${(categories as any)[category]?.color.split(" ")[0] || "bg-gray-100"} mr-2`}
                      ></div>
                      <span className="text-sm">{category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        ${total.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({((total / totalExpenses) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-medium">Total Expenses:</span>
                <span className="font-medium">${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* search and filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {Object.keys(categories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* transactions table */}
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${(categories as any)[transaction.category.name]?.color || "bg-gray-100 text-gray-800 border-gray-200"}`}
                      >
                        {transaction.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.account.type}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${transaction.type === "DEBIT" ? "text-red-600" : "text-green-600"}`}
                    >
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
