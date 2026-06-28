'use client';

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ThemeToggle from '@/components/ThemeToggle'

export default function VerifyUser() {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast({
                title: 'Success',
                description: response.data.message,
            })

            router.replace('/sign-in')
        } catch (error) {
            console.error('Error during sign-up:', error);

            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: 'Sign Up Failed',
                description: axiosError.response?.data.message,
                variant: 'destructive',
            });
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-12 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md transition-colors relative">
                {/* Floating ThemeToggle in the top right of the card */}
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-slate-900 dark:text-white">
                        Verify Your Account
                    </h1>
                    <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">Verification Code</FormLabel>
                                    <Input {...field} placeholder="Enter your code" className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
