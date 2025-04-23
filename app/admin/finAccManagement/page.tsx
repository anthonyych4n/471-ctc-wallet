"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PencilIcon, TrashIcon, PlusIcon, Search } from "lucide-react"
import { useState } from "react"

// some mock data for users for now
const initialUsers = [
        { id: "123456", name: "John Doe", email: "john@example.com", financialAccount: "Credit Card" },
        { id: "123457", name: "Jane Smith", email: "jane@example.com", financialAccount: "Savings Account" },
        { id: "placeholder-3", name: "Admin User", email: "admin@example.com", financialAccount: "Checking Account" },
        { id: "placeholder-4", name: "My King Lebron", email: "lebronovermj@example.com", financialAccount: "HFSA" },
        { id: "placeholder-5", name: "Ashton Hall", email: "ashall@example.com", financialAccount: "TFSA" },
];

export default function FinAccPage() {
  // mock states for now --> to be replaced with actual database operations
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  
  // filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // delete user function
  const handleDeleteUser = (userId: string) => {
    // mock for now
    setUsers(users.filter(user => user.id !== userId));
    console.log(`Delete user with ID: ${userId}`);
  };
  
  const handleEditUser = (userId: string) => {
    // mock for now
    console.log(`Edit user with ID: ${userId}`);
    // functionality to edit user goes here

  };
  
  const handleAddUser = () => {
    // mock for now
    console.log("Add new user");
    // functionality to add new user goes here
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold">Financial Account Management</CardTitle>
                      <Button 
                        onClick={handleAddUser}
                        className="bg-ctcColourSet-purpleVib hover:bg-opacity-90"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add New Account
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search accounts..."
                          className="w-full pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Financial Account</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    {user.financialAccount}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEditUser(user.id)}
                                    title="Edit account"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(user.id)}
                                    title="Delete account"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                No accounts found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Total accounts: {filteredUsers.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}