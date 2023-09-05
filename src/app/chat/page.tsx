"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "~/ui/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "~/ui/ui/textarea";

const formSchema = z.object({
  text: z.string().min(3),
});

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const chats = useQuery(api.functions.chats.get, {});

  const postChat = useMutation(api.functions.chats.post);

  const chatsRef = useRef<HTMLDivElement>(null);

  const [scrollToBottom, setScrollToBottom] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    const name = localStorage.getItem("name");
    if (!name) {
      return router.replace("/");
    }
    setLoading(false);

    // I want to run this only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollToBottom) {
      chatsRef.current?.scrollTo({
        top: chatsRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  // I want to run this only when chats change, it will automatically update the scrollToBottom state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  const handleSubmit = async ({ text }: z.infer<typeof formSchema>) => {
    const name = localStorage.getItem("name");
    if (text && name) {
      await postChat({
        body: text,
        user: name,
      });
      form.reset();
    }
  };

  const handleScroll = () => {
    if (!chatsRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = chatsRef.current;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    if (scrollBottom < 100 && !scrollToBottom) {
      setScrollToBottom(true);
    } else if (scrollBottom > 100 && scrollToBottom) {
      setScrollToBottom(false);
    }
  };

  return (
    <main className="flex max-h-screen min-h-screen flex-col gap-8 p-24">
      <div
        ref={chatsRef}
        onScroll={handleScroll}
        className="flex flex-1 flex-col gap-2 overflow-y-scroll"
      >
        {chats?.map(({ _id, text, user }) => (
          <div
            key={_id.toString()}
            className="flex flex-col gap-4 rounded-sm border p-4 shadow-md"
          >
            <span className="text-lg font-semibold">{user}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex w-full gap-2"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    className="flex-1"
                    placeholder="Your message..."
                    disabled={loading}
                    rows={3}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="w-auto px-8" type="submit" disabled={loading}>
            Send
          </Button>
        </form>
      </Form>
    </main>
  );
}
