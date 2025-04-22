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
  { id: "9754", name: "John Doe", email: "john@example.com", role: "User", status: "Active", created: "2024-01-15" },
  { id: "2007", name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", created: "2024-02-03" },
  { id: "4593", name: "Admin User", email: "admin@example.com", role: "Admin", status: "Active", created: "2023-12-01" },
  { id: "3003", name: "My King Lebron", email: "lebronovermj@example.com", role: "User", status: "Inactive", created: "2024-03-10" },
  { id: "7852", name: "Ashton Hall", email: "ashall@example.com", role: "User", status: "Active", created: "2024-01-30" },
];

export default function UsersPage() {
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
                      <CardTitle className="text-2xl font-bold">User Management</CardTitle>
                      <Button 
                        onClick={handleAddUser}
                        className="bg-ctcColourSet-purpleVib hover:bg-opacity-90"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add New User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search users..."
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
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
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
                                  {/* role colours for admin vs user */}
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    user.role === "Admin" 
                                      ? "bg-purple-100 text-purple-800" 
                                      : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {user.role}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    user.status === "Active" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-gray-100 text-gray-800"
                                  }`}>
                                    {user.status}
                                  </span>
                                </TableCell>
                                <TableCell>{new Date(user.created).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEditUser(user.id)}
                                    title="Edit user"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(user.id)}
                                    title="Delete user"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                No users found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Total users: {filteredUsers.length}</p>
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