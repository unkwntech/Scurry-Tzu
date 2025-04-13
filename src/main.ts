import { Client, Collection, Events, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

//https://discord.com/oauth2/authorize?client_id=1360997101080805647&scope=bot%20applications.commands

//load variables from .env
require("dotenv").config();

const client = new Client({
    intents: ["Guilds"],
});

client.commands = new Collection();

//Log to console when bot is ready to recieve commands.
client.once("ready", async () => {
    console.log("Ready");
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
});

//Load commands
const foldersPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(foldersPath);
const commands = [];
for (const file of commandFiles) {
    if (file.endsWith(".map")) continue;
    const filePath = path.join(foldersPath, file);
    const command = require(filePath).default;
    if (command === undefined) continue;
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
        console.info(`Setting Up\t${command.data.name}`);

        if ("init" in command) {
            command.init();
        }
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.warn(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

const restClient = new REST().setToken(process.env.DISCORD_BOT_TOKEN);
(async () => {
    await restClient.put(
        Routes.applicationCommands(process.env.DISCORD_OAUTH_CLIENT_ID),
        {
            body: commands,
        }
    );

    client.login(process.env.DISCORD_TOKEN);
})();

//Connect the bot
client.login(process.env.DISCORD_BOT_TOKEN);

function exitHandler(options: any, code: number) {}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
