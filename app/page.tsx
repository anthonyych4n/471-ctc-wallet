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
      <h1 className="text-5xl font-extrabold text-blue-700 mb-8 mt-6 text-center drop-shadow-sm">
        CTC Wallet 
      </h1>

      {/* Inner Box */}
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <p className="text-center text-gray-600 mb-8 text-lg">
          Your personal finance tracker. Monitor your spending, track budgets, and stay in control of your money.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-700">Track Expenses</h2>
            <p className="text-gray-600 mt-2">Add, view, and categorize your expenses in one place.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-green-700">View Analytics</h2>
            <p className="text-gray-600 mt-2">Visualize your income vs. expenses over time.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-yellow-700">Budget Planning</h2>
            <p className="text-gray-600 mt-2">Set monthly budgets and track how you’re doing.</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-purple-700">Secure & Private</h2>
            <p className="text-gray-600 mt-2">Your data stays yours – encrypted and safe.</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>      
    </div>
  );
}
