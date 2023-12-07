import {
  SlashCommandBuilder,
  CommandInteraction,
  GuildMember,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("user")
  .setDescription("Provides information about the user.");

export async function execute(interaction: CommandInteraction) {
  const user = interaction.user;
  const member = interaction.member as GuildMember | null;

  if (member) {
    await interaction.reply(
      `This command was run by ${user.username}, who joined on ${member.joinedAt}.`
    );
  } else {
    await interaction.reply(
      "Unable to retrieve user information in this context."
    );
  }
}
