"use server";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

type AddFeed = {
  description: string;
  date: Date;
  time: Date;
};

export async function addFeed({ description, date, time }: AddFeed) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");
  const supabase = createClient(await cookies());
  const payload = {
    description,
    date: date.toISOString().slice(0, 10),
    time: time.toTimeString().slice(0, 8),
    user_id: user.id,
  };
  console.log("FROM ACTION", payload, user);
  const { data, error } = await supabase.from("feed_history").insert([payload]);
  if (error) throw new Error(error.message);
  console.log(JSON.stringify(data), JSON.stringify(error));
}
