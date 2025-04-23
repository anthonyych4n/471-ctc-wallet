import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Header from "@/components/Header";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

const features = [
  {
    Icon: FileTextIcon,
    name: "Change these and we can add videos of the dashboard to these cards later :)",
    description: "We automatically save your files as you type.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search through all your finances.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Analytics",
    description: "Visualize your finacial data",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Expense Tracking",
    description: "Track recurring expenses",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Alerts",
    description:
      "Get real-time alerts and notifications.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export default async function Home() {
  return (
<div>
  <Header />

  <main className="h-1/2 bg-white text-ctcColourSet-purpleVib flex flex-col items-center px-6 pt-20 pb-24">
    {/* Main Title */}
      <h1 className="text-6xl md:text-7xl font-semibold text-center leading-tight tracking-tight max-w-4xl">
        CTC Wallet
      </h1>

    {/* Subtitle */}
      <p className="text-xl md:text-2xl text-center text-gray-700 mt-6 max-w-2xl">
        Take control of your money. Track spending, plan budgets, and view insights – all in one beautiful app.
      </p>

    {/* Features Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 max-w-5xl w-full">
      <div>
        <h2 className="text-2xl font-medium">Track Expenses</h2>
        <p className="text-gray-600 mt-2">Add, view, and categorize your expenses seamlessly.</p>
      </div>
      <div>
        <h2 className="text-2xl font-medium">View Analytics</h2>
        <p className="text-gray-600 mt-2">Visualize your spending trends and financial health.</p>
      </div>
      <div>
        <h2 className="text-2xl font-medium">Budget Planning</h2>
        <p className="text-gray-600 mt-2">Set monthly budgets and monitor your progress with ease.</p>
      </div>
      <div>
        <h2 className="text-2xl font-medium">Secure & Private</h2>
        <p className="text-gray-600 mt-2">All your data is encrypted and remains on your device.</p>
      </div>
    </div>

    {/* Call to Action */}
    <div className="mt-20 flex flex-col sm:flex-row gap-4">

      <a
        href="/dashboard"
        className="px-8 py-4 bg-ctcColourSet-lavender text-white text-lg font-medium rounded-md hover:bg-gray-800 transition"
      >
        Go to User Dashboard
      </a>

      <a
        href="/admin"
        className="px-8 py-4 bg-gray-200 text-black text-lg font-medium rounded-md hover:bg-gray-300 transition"
      >
        Go to Admin Dashboard
      </a>
      
    </div>
  </main>
  <div className="flex flex-col justify-center items-center text-black bg-ctcColourSet-seafoam">
    <h1 className="text-6xl md:text-7xl font-semibold text-center leading-tight tracking-tight max-w-4xl py-10">
      Features
    </h1>
  <BentoGrid className="lg:grid-rows-3 w-1/2 py-5 mb-20">
        {features.map((feature) => (
        <BentoCard key={feature.name} {...feature}/>
        ))}
      </BentoGrid>
  </div>
  
</div>
  );
}
