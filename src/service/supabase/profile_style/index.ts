import { createClient } from "@supabase/supabase-js";
import { config } from "@config/config";
import { ProfileUser } from "@entities/User";

const supabaseUrl = config.SUPABASE_URL;
const supabaseKey = config.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const createUserStyle = async (
  id_discord: string,
  champion: string,
  skin: number
) => {
  const { data, error } = await supabase
    .from("profile_user")
    .insert([{ id_discord: id_discord, champion: champion, skin: skin }])
    .select();

  if (error) {
    console.log(error);
    throw new Error("Error creating user data");
  }

  return;
};

export const updateSkin = async (
  id_discord: string,
  champion: string,
  skin: number
) => {
  const style = await getUserStyle(id_discord);

  if (!style) {
    await createUserStyle(id_discord, champion, skin);

    return;
  }

  let { error } = await supabase
    .from("profile_user")
    .update({ champion: champion, skin: skin })
    .eq("id_discord", id_discord)
    .select();

  if (error) {
    console.log(error);
    throw new Error("Error updating user data");
  }

  return;
};

export const getUserStyle = async (
  id_discord: string
): Promise<ProfileUser | null> => {
  const { data, error } = await supabase
    .from("profile_user")
    .select()
    .eq("id_discord", id_discord);

  if (error) {
    console.log(error);
    throw new Error("Error getting user data");
  }

  return data[0];
};
