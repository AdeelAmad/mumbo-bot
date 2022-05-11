const {SlashCommandBuilder} = require('@discordjs/builders');
const prettyMilliseconds = require("pretty-ms");
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rewards')
        .setDescription('See all available level rewards for the server'),

    async execute(interaction) {
        if (interaction.guild != null) {


            statresponse = axios.get('https://api.mumbobot.xyz/management/', {"data": {"id": interaction.guild.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})

            await interaction.reply({setEmbeds: [], ephemeral: true});

        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};