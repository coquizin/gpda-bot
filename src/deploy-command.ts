import { REST, Routes } from "discord.js";
import { commands } from "@commands/index";
import { config } from "@config/config";

const commandsData = Object.values(commands).map((com) => com.data);

const rest = new REST({ version: "10" }).setToken(config.TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, guildId), {
      body: commandsData,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
