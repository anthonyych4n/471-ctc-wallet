import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-ctcColourSet-purpleVib">CTC Wallet</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-ctcColourSet-lavender px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ctcColourSet-lavender/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctcColourSet-lavender"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}