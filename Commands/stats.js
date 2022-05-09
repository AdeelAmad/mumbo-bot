const {SlashCommandBuilder} = require('@discordjs/builders');
const prettyMilliseconds = require("pretty-ms");
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Bot stats and uptime'),

    async execute(interaction) {
        if (interaction.guild != null) {

            membercount = 0;
            for (guild of interaction.client.guilds.cache) {
                membercount = membercount + guild[1].memberCount;

                if (interaction.user.id == 297140281931988995){
                    console.log(`Guild Name: ${guild[1].name} \n Member Count: ${guild[1].memberCount} \n Guild Id: ${guild[0]}`)
                };
            };

            requesttime = Date.now();

            statresponse = await axios.get('https://api.mumbobot.xyz/management/', {"data": {"id": interaction.guild.id}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).then(function () {
                responsetime = Date.now();
            });

            await interaction.reply({content: `\`\`\`Uptime: ${prettyMilliseconds(interaction.client.uptime)} \nGateway Ping: ${interaction.client.ws.ping}ms\nREST Ping: ${responsetime-requesttime}ms\nGuilds: ${interaction.client.guilds.cache.size}\nMembers: ${membercount}\`\`\``, ephemeral: true});

        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};