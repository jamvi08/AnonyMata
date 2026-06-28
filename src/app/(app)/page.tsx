"use client"

import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Mail } from 'lucide-react'

function page() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300">
            AnonyMata - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          className="w-full max-w-xs" plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}>
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 shadow-sm text-slate-800 dark:text-slate-100">
                      <CardHeader className="font-bold text-slate-900 dark:text-white">
                        {
                          message.title
                        }
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                        <Mail className="flex-shrink-0 text-slate-500 dark:text-slate-400" />
                        <div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-4 md:p-6 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-850 text-xs sm:text-sm transition-colors">
        © 2026 AnonyMata. Developed with ❤️ by Janhavi. All rights reserved.
      </footer>
    </>
  )
}

export default page