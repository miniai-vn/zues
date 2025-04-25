"use client";



import dynamic from 'next/dynamic'

const BotComponent = dynamic(() => import('../bot/botPage'), {
  ssr: false
})

export default function Home() {



  return <BotComponent />
}
