"use client"

import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { loginSchema } from "@/schemas/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"

export default function Login() {
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const router = useRouter();

    function onSubmit(data: z.infer<typeof loginSchema>) {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged in Successfully!");
                        router.push("/")
                    },
                    onError: () => {
                        toast.error("Error in Loggging In!")
                    }
                }
            }
            )
        })
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Log in to continue using LearnNext
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >{isPending ? 
                            <>
                                <Loader2 className="animate-spin size-4" />
                                <span>Loading...</span>
                            </>
                            :   <span>Log In</span>
                            }
                            </Button>
                        </form>
                    </Form>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don’t have an account?{" "}
                        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                            <span className="font-bold">Sign Up</span>
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
