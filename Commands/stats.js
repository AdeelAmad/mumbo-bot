const { SlashCommandBuilder } = require('@discordjs/builders');
const prettyMilliseconds = require("pretty-ms");
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Bot stats and uptime'),
    async execute(interaction) {

        membercount = 0;
        for (guild of interaction.client.guilds.cache) {
            membercount = membercount + guild[1].memberCount;
        };

        requesttime = Date.now();

        statresponse = await axios.get('http://127.0.0.1:8000/management/', {"data": {"id": interaction.guild.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).then(function () {
            responsetime = Date.now();
        });

        await interaction.reply({content: `\`\`\`Uptime: ${prettyMilliseconds(interaction.client.uptime)} \nGateway Ping: ${interaction.client.ws.ping}ms\nREST Ping: ${responsetime-requesttime}ms\nGuilds: ${interaction.client.guilds.cache.size}\nMembers: ${membercount}\`\`\``, ephemeral: true});
    },
};