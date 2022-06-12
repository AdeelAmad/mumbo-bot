const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Information about commands"),
    async execute(interaction) {
        await interaction.reply({content: "You can access mumbo's command documentation here: https://mumbobot.xyz/getting-started", ephemeral: true});
    },
};