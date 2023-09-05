"use client";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "~/ui/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/ui/form";
import { Button } from "~/ui/button";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
});

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const userMutation = useMutation(api.functions.users.post);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async ({ name }: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await userMutation({
        name: name,
      });
      localStorage.setItem("name", name);
      return router.push("/chat");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const name = localStorage.getItem("name");
    if (name) {
      router.push("/chat");
    } else {
      router.prefetch("/chat");
      setLoading(false);
    }

    // I want to run this only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" disabled={loading} {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. This name is not unique,
                  anyone can use it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            Sign in
          </Button>
        </form>
      </Form>
    </main>
  );
}
