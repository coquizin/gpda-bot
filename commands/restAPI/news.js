const { SlashCommandBuilder } = require("discord.js");

// Supondo que haja uma função ou API para buscar notícias aeroespaciais/aeronáuticas
async function fetchAerospaceNews() {
  // Lógica para buscar notícias do mundo aeroespacial ou aeronáutico
  // Pode ser uma solicitação para uma API externa que forneça essas notícias
  // Retornar um array de notícias relevantes
  return [
    {
      title: "Título da Notícia 1",
      description: "Descrição da Notícia 1...",
      url: "https://exemplo.com/noticia1",
    },
    {
      title: "Título da Notícia 2",
      description: "Descrição da Notícia 2...",
      url: "https://exemplo.com/noticia2",
    },
    // Mais notícias, se disponíveis...
  ];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("news")
    .setDescription("Displays latest news from the aerospace industry"),
  async execute(interaction) {
    const news = await fetchAerospaceNews();

    if (news.length === 0) {
      return interaction.reply(
        "Não foi possível encontrar notícias no momento."
      );
    }

    const newsEmbeds = news.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
    }));

    interaction.reply({ embeds: newsEmbeds });
  },
};
