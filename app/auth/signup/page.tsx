"use client"

import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { signupSchema } from "@/schemas/auth"
import z from "zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { error } from "console"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"


export default function SignUp() {
    const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    startTransition(async ()=>{
        await authClient.signUp.email({
            email: data.email,
            name: data.name,
            password: data.password,
            fetchOptions: {
                onSuccess: () =>  {
                    toast.success("Account created Successfully")
                    router.push("/")
                },
                onError: (error) => {
                    toast.error(error.error.message)
                },
            }
        })
      }
    )}

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Start building and learning with LearnNext
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)} //first react hookform validates the data
              className="space-y-4"
            >
              {/* Name */}
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Email */}
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Password */}
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
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
                            :   <span>Sign Up</span>
                            }
                            </Button>
            </form>
          </Form>

          {/* Footer actions */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              <span className="font-bold">Login</span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
