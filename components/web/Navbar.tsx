"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/web/theme-toggle"
import { useConvexAuth } from "convex/react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SearchInput } from "@/components/web/SearchInput"

export function Navbar() {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const router = useRouter()
    return (
        <header className="border-b">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
                aria-label="Primary Navigation"
            >
                {/* Left: Brand + Links */}
                <div className="flex items-center gap-8">
                    {/* Brand */}
                    <Link
                        href="/"
                        className="text-xl font-semibold tracking-tight"
                    >
                        LearnNext
                    </Link>

                    {/* Nav Links */}
                    <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <li>
                            <Link href="/" className="hover:text-primary">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="hover:text-primary">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="/create" className="hover:text-primary">
                                Create
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center gap-3">
                    <SearchInput limit={12} />
                    {isLoading ? null : isAuthenticated ?
                        (
                            < Button variant="outline" onClick={()=> authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        toast.success("Logged out successfully");
                                        router.push("/")
                                    },
                                    onErrror: () => {toast.error("Error Logging out!");},
                                }
                            })}> Logout
                            </Button>
                        ) :
                        (<>
                            < Button variant="outline" asChild>
                                <Link href="/auth/login">Login</Link>
                            </Button>

                            <Button variant='outline' asChild>
                                <Link href="/auth/signup">Sign Up</Link>
                            </Button>
                        </>
                        )}
                    <ThemeToggle />
                </div>
            </nav>
        </header >
    )
}
