"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useCompletion } from 'ai/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messagesSchema } from '@/schemas/messagesSchema'
import { z } from 'zod'
import { toast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import ThemeToggle from '@/components/ThemeToggle'

const initialMessages = "What inspired you to become what you are today?||Do you have any special hobby?||Do you believe in ghosts?"

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split('||')
}

const PublicProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams<{ username: string }>()
  const username = params.username

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessages
  })

  const form = useForm<z.infer<typeof messagesSchema>>({
    resolver: zodResolver(messagesSchema),
    defaultValues: {
      content: ''
    }
  })

  const messageContent = form.watch('content')

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  const onSubmit = async (data: z.infer<typeof messagesSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username
      })

      toast({
        title: response.data.message,
        variant: 'default',
      });

      form.reset({ content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      await complete('')
    } catch (error) {
      console.log("Error fetching suggested messages: ", error as any)
      toast({
        title: 'Could not suggest messages',
        description: "Error while fetching the suggested messages from the server.",
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-100 transition-colors py-12 px-4 md:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl p-6 md:p-8 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 transition-colors relative">
        {/* Corner ThemeToggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 text-center text-slate-900 dark:text-white">
          Public Profile Link
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Send Anonymous Message to @{username}
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none w-full p-4 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 h-32 text-sm shadow-sm transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="w-full sm:w-auto">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent} className="w-full sm:w-auto px-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 my-8">
          <div className="space-y-2">
            <Button
              onClick={fetchSuggestedMessages}
              className="my-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
              disabled={isSuggestLoading}
            >
              Suggest Messages
            </Button>
            <p className="text-sm text-slate-500 dark:text-slate-400">Click on any message below to select it.</p>
          </div>
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Messages Suggestions</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3 pt-4">
              {error ? (
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                    ⚠️ Google Gemini API is offline or key is missing. Displaying offline fallback suggestions:
                  </p>
                  <div className="flex flex-col space-y-2">
                    {parseStringMessages(initialMessages).map((message, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="mb-2 text-left justify-start h-auto py-2.5 px-4 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all text-xs sm:text-sm whitespace-normal font-normal"
                        onClick={() => handleMessageClick(message)}
                      >
                        {message}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                parseStringMessages(completion || initialMessages).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2 text-left justify-start h-auto py-2.5 px-4 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all text-xs sm:text-sm whitespace-normal font-normal"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6 border-slate-200 dark:border-slate-850" />
        <div className="text-center">
          <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">Create Your Account</Button>
          </Link>
        </div>
      </div>
      
      {/* Minimal Creator Watermark Footer */}
      <div className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-600">
        AnonyMata is custom developed by <span className="font-semibold text-slate-500 dark:text-slate-500">Janhavi</span>.
      </div>
    </div>
  )
}

export default PublicProfile