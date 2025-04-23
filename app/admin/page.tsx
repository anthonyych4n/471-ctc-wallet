import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserIcon, CreditCardIcon } from "lucide-react"

export default function AdminPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
                
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Management Card */}
                    <Card className="hover:shadow-md transition-shadow md:h-64 flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <UserIcon className="h-6 w-6" />
                          User Management
                        </CardTitle>
                        <CardDescription className="text-base">
                          View, edit, and delete user accounts in the system
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-end">
                        <Link 
                          href="/admin/users"
                          className="w-full text-center px-4 py-3 bg-ctcColourSet-purpleVib text-white rounded-md hover:bg-opacity-90 transition-colors text-lg"
                        >
                          Manage Users
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Financial Accounts Card */}
                    <Card className="hover:shadow-md transition-shadow md:h-64 flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <CreditCardIcon className="h-6 w-6" />
                          Financial Accounts
                        </CardTitle>
                        <CardDescription className="text-base">
                          Manage user financial accounts, transactions, and settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-end">
                        <Link 
                          href="/admin/finAccManagement"
                          className="w-full text-center px-4 py-3 bg-ctcColourSet-purpleVib text-white rounded-md hover:bg-opacity-90 transition-colors text-lg"
                        >
                          Manage Accounts
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-16 text-center text-gray-600">
                    <p className="text-lg">Welcome to the CTC Wallet Admin Panel</p>
                    <p className="mt-2">Use the options above to manage users and their financial accounts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}