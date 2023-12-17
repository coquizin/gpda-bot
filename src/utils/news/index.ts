import { News } from "@entities/News";
import { EmbedBuilder } from "discord.js";

export const newsEmbed = (news: News) => {
  const embed = new EmbedBuilder();

  if (news?.title) {
    embed.setTitle(news?.title);
  }

  if (news?.author) {
    embed.setAuthor({ name: news?.author });
  }

  if (news?.source.name) {
    embed.setFooter({
      text: news?.source.name,
    });
  }

  if (news?.description) {
    embed.setDescription(news?.description);
  }

  if (news?.url) {
    embed.setURL(news?.url);
  }

  if (news?.urlToImage) {
    embed.setImage(news?.urlToImage);
  }

  if (news?.publishedAt) {
    embed.setTimestamp(new Date(news?.publishedAt));
  }

  return embed;
};
