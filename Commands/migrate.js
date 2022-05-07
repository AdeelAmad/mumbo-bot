const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('migrate')
        .setDescription("Migrate bot settings and userdata from the old bot. Won't work if you didn't use old mumbo."),
    async execute(interaction) {


        await interaction.reply('Data migrated');
    },
};