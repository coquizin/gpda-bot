import { createClient } from "@supabase/supabase-js";
import { config } from "@config/config";
import { UserData } from "@entities/User";

const supabaseUrl = config.SUPABASE_URL;
const supabaseKey = config.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const listUsers = async () => {
  let { data, error } = await supabase.from("user").select("*");

  if (error) {
    console.log(error);
    return;
  }

  console.log(data);
};

export const getUserData = async ({
  id_discord,
  puuid,
}: {
  id_discord?: string;
  puuid?: string;
}): Promise<UserData | null> => {
  if (id_discord) {
    let { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id_discord", id_discord);

    if (error) {
      throw new Error("Error getting user data");
    }

    if (data) {
      return data[0];
    }
  }

  if (puuid) {
    let { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("puuid", puuid);

    if (error) {
      throw new Error("Error getting user data");
    }

    if (data) {
      return data[0];
    }
  }

  return null;
};

export const createUserData = async (data: Omit<UserData, "id">) => {
  let { error } = await supabase
    .from("user")
    .insert([
      {
        gameName: data.gameName,
        tagLine: data.tagLine,
        id_discord: data.id_discord,
        puuid: data.puuid,
        region: data.region,
        server: data.server,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    throw new Error("Error creating user data");
  }

  return;
};

export const updateUserData = async (data: UserData) => {
  let { error } = await supabase
    .from("user")
    .update({
      gameName: data.gameName,
      tagLine: data.tagLine,
      puuid: data.puuid,
      region: data.region,
      server: data.server,
    })
    .eq("id", data.id);

  if (error) {
    console.log(error);
    throw new Error("Error updating user data");
  }

  return;
};
