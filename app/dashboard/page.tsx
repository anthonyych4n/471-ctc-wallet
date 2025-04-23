'use client';

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardData {
  accounts: any[];
  investments: any[];
  savingsGoals: any[];
  recurringExpenses: any[];
  alerts: any[];
}

interface ChartAreaInteractiveProps {
  accounts: any[];
}

interface SectionCardsProps {
  accounts: any[];
  investments: any[];
  savingsGoals: any[];
  recurringExpenses: any[];
  alerts: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    accounts: [],
    investments: [],
    savingsGoals: [],
    recurringExpenses: [],
    alerts: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/sign-in');
          return;
        }

        const userId = session.user.id;

        // Fetch all data in parallel
        const [
          accountsRes,
          investmentsRes,
          savingsGoalsRes,
          recurringExpensesRes,
          alertsRes,
        ] = await Promise.all([
          fetch(`/api/accounts?userId=${userId}`),
          fetch(`/api/investments?userId=${userId}`),
          fetch(`/api/savings-goals?userId=${userId}`),
          fetch(`/api/recurring-expenses?userId=${userId}`),
          fetch(`/api/alerts?userId=${userId}`),
        ]);

        const [
          accounts,
          investments,
          savingsGoals,
          recurringExpenses,
          alerts,
        ] = await Promise.all([
          accountsRes.json(),
          investmentsRes.json(),
          savingsGoalsRes.json(),
          recurringExpensesRes.json(),
          alertsRes.json(),
        ]);

        setData({
          accounts,
          investments,
          savingsGoals,
          recurringExpenses,
          alerts,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive accounts={data.accounts} />
                <DataTable data={data.accounts} />
                <SectionCards
                  accounts={data.accounts}
                  savingsGoals={data.savingsGoals}
                  recurringExpenses={data.recurringExpenses}
                  alerts={data.alerts}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
