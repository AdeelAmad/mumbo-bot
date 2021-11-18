const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leepisnotdillon')
        .setDescription('Nothing'),
    async execute(interaction) {
        await interaction.reply('Leep is not Dillon!');
    },
};