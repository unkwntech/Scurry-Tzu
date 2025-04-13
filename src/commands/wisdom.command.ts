import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import list from "../wisdom";

const arrayShuffle = (input: any[]) => {
    let array: any[] = [];
    Object.assign(array, input);
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
};

const wisdom: string[] = arrayShuffle(list);

export default {
    init: async () => {
        console.log(`\t${wisdom.length} Wisdom`);
    },
    data: new SlashCommandBuilder()
        .setName("wisdom")
        .setDescription("Prompts Scurry Tzu to dispense a nibble of wisdom."),
    execute: async (interaction: ChatInputCommandInteraction) => {
        var wis = wisdom.shift();
        wisdom.push(wis ?? "");

        interaction.reply(wis ?? "");
    },
};
