import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoCardProps {
    Icon: any;
    name: string;
    description: string;
    href: string;
    cta: string;
    background: ReactNode;
    className?: string;
}

export function BentoCard({ Icon, name, description, href, cta, background, className }: BentoCardProps) {
    return (
        <div
            className={cn(
                "group relative col-span-1 flex overflow-hidden rounded-xl border border-gray-200 bg-white p-8",
                className
            )}
        >
            {background}
            <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6" />
                    <h3 className="text-lg font-medium">{name}</h3>
                </div>
                <p className="mt-4 text-sm text-gray-600">{description}</p>
                <a
                    href={href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-900"
                >
                    {cta}
                    <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </a>
            </div>
        </div>
    );
}

interface BentoGridProps {
    className?: string;
    children?: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
                className
            )}
        >
            {children}
        </div>
    );
} 