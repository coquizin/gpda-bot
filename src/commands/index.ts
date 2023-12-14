import * as pingModule from "./utility/ping";
import * as userModule from "./utility/user";
import * as serverModule from "./utility/server";
import * as lolmeModule from "./league/lolme";
import * as setLoLModule from "./league/league";
import * as dogModule from "./restAPI/dog";
import * as lolhistoryModule from "./league/lolHist";
import * as upLoLModule from "./league/leagueup";
import * as skinUpModule from "./league/setskin";
import * as skinModule from "./league/skin";
import * as lolProfileModule from "./league/lolprofile";
import * as lolSpecModule from "./league/lolspec";
import * as perguntaModule from "./gpt/gpt";
import * as newsModule from "./news/news";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

// Definindo tipos para os módulos
interface Command {
  data: SlashCommandBuilder | any;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

interface Commands {
  ping: Command;
  user: Command;
  server: Command;
  dog: Command;
  lolme: Command;
  league: Command;
  lolhist: Command;
  leagueup: Command;
  setskin: Command;
  skin: Command;
  lolprofile: Command;
  lolspec: Command;
  pergunta: Command;
  news: Command;
}

// Criando um objeto com os módulos e suas propriedades de comando
export const commands: Commands = {
  ping: pingModule,
  user: userModule,
  server: serverModule,
  lolme: lolmeModule,
  dog: dogModule,
  league: setLoLModule,
  lolhist: lolhistoryModule,
  leagueup: upLoLModule,
  setskin: skinUpModule,
  skin: skinModule,
  lolprofile: lolProfileModule,
  lolspec: lolSpecModule,
  pergunta: perguntaModule,
  news: newsModule,
};
