const { SlashCommandBuilder } = require('@discordjs/builders');
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Server uptime and data'),
    async execute(interaction) {
        await interaction.reply({content: `Node-2 Instance online for ${prettyMilliseconds(interaction.client.uptime)}`, ephemeral: true});
    },
};