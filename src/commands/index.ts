import * as pingModule from "./utility/ping";
import * as userModule from "./utility/user";
import * as serverModule from "./utility/server";
import * as lolmeModule from "./league/lolme";
import * as setLoLModule from "./league/league";
import * as dogModule from "./restAPI/dog";
import * as lolhistoryModule from "./league/lolHist";
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
};
