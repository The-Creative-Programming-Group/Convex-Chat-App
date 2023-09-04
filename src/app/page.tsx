"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HomePage() {
  const chats = useQuery(api.chats.get);
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {chats?.map(({ _id, text }: { _id: string, text: string}) => (
            <div key={_id.toString()}>{text}</div>
        ))}
      </main>
  )
}
