import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Header from "@/components/Header";

export default async function Home() {
  return (
    <div>
      <Header></Header>
    <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {/* Main Title Outside the Box */}
      <h1 className="text-5xl font-extrabold text-ctcColourSet-purpleVib mb-8 mt-6 text-center drop-shadow-sm">
        CTC Wallet 
      </h1>

      {/* Inner Box */}
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <p className="text-center text-gray-600 mb-8 text-lg">
          Your personal finance tracker. Monitor your spending, track budgets, and stay in control of your money.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-ctcColourSet-seafoam p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-ctcColourSet-greenVib">Track Expenses</h2>
            <p className="text-gray-600 mt-2">Add, view, and categorize your expenses in one place.</p>
          </div>
          <div className="bg-ctcColourSet-bubblegum p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-ctcColourSet-redVib">View Analytics</h2>
            <p className="text-gray-600 mt-2">Visualize your income vs. expenses over time.</p>
          </div>
          <div className="bg-ctcColourSet-peach p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-ctcColourSet-orangeVib">Budget Planning</h2>
            <p className="text-gray-600 mt-2">Set monthly budgets and track how you’re doing.</p>
          </div>
          <div className="bg-ctcColourSet-lavender p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-purple-700">Secure & Private</h2>
            <p className="text-gray-600 mt-2">Your data stays yours – encrypted and safe.</p>
          </div>
        </div>

        <div className="mt-10 text-center space-x-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-ctcColourSet-lavender text-white font-semibold rounded-lg shadow hover:bg-ctcColourSet-purpleVib transition"
          >
            Go to  User Dashboard
          </a>

          {/* button for admin dashboard */}
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-ctcColourSet-lavender text-white font-semibold rounded-lg shadow hover:bg-ctcColourSet-purpleVib transition ml-4"
            >
            Go to Admin Dashboard
          </a>



        </div>
      </div>
    </main>      
    </div>
  );
}
