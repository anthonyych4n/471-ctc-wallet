"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "../hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, PieChart } from "lucide-react"

// transaction categories with colors
const categories = {
  "Groceries": { color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  "Dining": { color: "bg-orange-100 text-orange-800 border-orange-200" },
  "Entertainment": { color: "bg-purple-100 text-purple-800 border-purple-200" },
  "Transportation": { color: "bg-blue-100 text-blue-800 border-blue-200" },
  "Housing": { color: "bg-slate-100 text-slate-800 border-slate-200" },
  "Utilities": { color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  "Subscriptions": { color: "bg-pink-100 text-pink-800 border-pink-200" },
  "Shopping": { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "Health": { color: "bg-red-100 text-red-800 border-red-200" },
  "Income": { color: "bg-green-100 text-green-800 border-green-200" },
}

// dummy data for now
const transactionData = [
  { id: "T001", date: "2024-06-30", description: "Paycheck", amount: 2400, type: "Income", category: "Income", account: "Checking" },
  { id: "T002", date: "2024-06-29", description: "Safeway", amount: -128.45, type: "Expense", category: "Groceries", account: "Credit Card" },
  { id: "T003", date: "2024-06-29", description: "Shoppers", amount: -32.50, type: "Expense", category: "Entertainment", account: "Credit Card" },
  { id: "T004", date: "2024-06-28", description: "Uber", amount: -24.75, type: "Expense", category: "Transportation", account: "Credit Card" },
  { id: "T005", date: "2024-06-27", description: "Seniores", amount: -15.30, type: "Expense", category: "Dining", account: "Credit Card" },
  { id: "T006", date: "2024-06-25", description: "Netflix", amount: -15.99, type: "Expense", category: "Subscriptions", account: "Credit Card" },
  { id: "T007", date: "2024-06-25", description: "Spotify", amount: -9.99, type: "Expense", category: "Subscriptions", account: "Credit Card" },
  { id: "T008", date: "2024-06-24", description: "Amazon", amount: -67.82, type: "Expense", category: "Shopping", account: "Credit Card" },
  { id: "T009", date: "2024-06-21", description: "Electric Bill", amount: -85.42, type: "Expense", category: "Utilities", account: "Checking" },
  { id: "T010", date: "2024-06-20", description: "Rent Payment", amount: -1200, type: "Expense", category: "Housing", account: "Checking" },
  { id: "T011", date: "2024-06-18", description: "Pharmacy", amount: -42.50, type: "Expense", category: "Health", account: "Credit Card" },
  { id: "T012", date: "2024-06-15", description: "Paycheck", amount: 2400, type: "Income", category: "Income", account: "Checking" },
  { id: "T013", date: "2024-06-15", description: "Lebron's Shop", amount: -87.32, type: "Expense", category: "Groceries", account: "Credit Card" },
  { id: "T014", date: "2024-06-14", description: "Starbucks", amount: -5.25, type: "Expense", category: "Dining", account: "Credit Card" },
  { id: "T015", date: "2024-06-13", description: "Gas Station", amount: -45.67, type: "Expense", category: "Transportation", account: "Credit Card" },
  { id: "T016", date: "2024-06-10", description: "Hudson Bay", amount: -128.91, type: "Expense", category: "Shopping", account: "Credit Card" },
  { id: "T017", date: "2024-06-08", description: "CBC TV", amount: -12.99, type: "Expense", category: "Subscriptions", account: "Credit Card" },
  { id: "T018", date: "2024-06-07", description: "Phone Bill", amount: -75, type: "Expense", category: "Utilities", account: "Checking" },
  { id: "T019", date: "2024-06-05", description: "Doctor Visit", amount: -25, type: "Expense", category: "Health", account: "Credit Card" },
  { id: "T020", date: "2024-06-04", description: "Water Bill", amount: -45.33, type: "Expense", category: "Utilities", account: "Checking" },
  { id: "T021", date: "2024-06-01", description: "Paycheck", amount: 2400, type: "Income", category: "Income", account: "Checking" },
  { id: "T022", date: "2024-05-29", description: "Kroger", amount: -98.45, type: "Expense", category: "Groceries", account: "Credit Card" },
  { id: "T023", date: "2024-05-27", description: "Olive Garden", amount: -43.21, type: "Expense", category: "Dining", account: "Credit Card" },
  { id: "T024", date: "2024-05-25", description: "Netflix", amount: -15.99, type: "Expense", category: "Subscriptions", account: "Credit Card" },
  { id: "T025", date: "2024-05-20", description: "Rent Payment", amount: -1200, type: "Expense", category: "Housing", account: "Checking" },
  { id: "T026", date: "2024-05-15", description: "Paycheck", amount: 2400, type: "Income", category: "Income", account: "Checking" },
  { id: "T027", date: "2024-05-11", description: "Costco", amount: -245.78, type: "Expense", category: "Groceries", account: "Credit Card" },
  { id: "T028", date: "2024-05-10", description: "Internet Bill", amount: -65.99, type: "Expense", category: "Utilities", account: "Checking" },
  { id: "T029", date: "2024-05-05", description: "Spotify", amount: -9.99, type: "Expense", category: "Subscriptions", account: "Credit Card" },
  { id: "T030", date: "2024-05-01", description: "Paycheck", amount: 2400, type: "Income", category: "Income", account: "Checking" },
]

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("All")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // filter transactions by date range
  const dateFilteredTransactions = transactionData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  // filter by search term and category
  const filteredTransactions = dateFilteredTransactions.filter((transaction) => {
    const matchesSearch = 
      searchTerm === "" || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = 
      categoryFilter === "All" || 
      transaction.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // this helps calculate the total expenses by category
  // and the total expenses overall
  const categoryTotals = dateFilteredTransactions.reduce((acc: Record<string, number>, transaction) => {
    if (transaction.type === "Expense") {
      const absAmount = Math.abs(transaction.amount)
      acc[transaction.category] = (acc[transaction.category] || 0) + absAmount
    }
    return acc
  }, {} as Record<string, number>)

  // calculate total expenses
  const totalExpenses = Object.values(categoryTotals).reduce((sum: any, amount: any) => sum + amount, 0)

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Spending Analysis</CardTitle>
        <CardDescription>
          <span>View and analyze your transactions by category</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
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
              {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).map(([category, total]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${categories[category as keyof typeof categories].color.split(" ")[0]} mr-2`}></div>
                    <span className="text-sm">{category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">${(total as number).toFixed(2)}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(((total as number) / totalExpenses) * 100).toFixed(1)}%)
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
          <div className="w-full lg:w-2/3">
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
                  {Object.keys(categories).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* transactions table */}
            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${categories[transaction.category as keyof typeof categories].color}`}>
                            {transaction.category}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${
                          transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          ${transaction.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
