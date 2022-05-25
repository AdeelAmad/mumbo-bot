const {SlashCommandBuilder} = require('@discordjs/builders');
const prettyMilliseconds = require("pretty-ms");
const axios = require('axios')
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rewards')
        .setDescription('See all available level rewards for the server'),

    async execute(interaction) {
        if (interaction.guild != null) {
            await interaction.deferReply();

            response = await axios.get('https://api.mumbobot.xyz/management/', {
                "data": {"id": interaction.guildId},
                auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
            });

            if (response['data']['leveling']) {
                const setEmbed = new MessageEmbed()
                    .setColor('#ef6459')
                    //Mumbo website link
                    .setAuthor({
                        name: 'Mumbo AFK - Docs',
                        iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                        url: 'https://mumbobot.xyz/commands/'
                    })
                    .setTimestamp()
                    .setTitle(`Ranks for ${interaction.guild}`);

                rankresponse = "";

                ranks = await axios.get('https://api.mumbobot.xyz/leveling/rankrewards/', {
                    "data": {"guild_id": interaction.guildId},
                    auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                }).catch(function () {
                    return;
                });

                if (ranks) {
                    for (const [key, value] of Object.entries(ranks['data'])) {
                        rankresponse = rankresponse + `<@&${value['role_id']}> - Level: ${value['level']}\n`;
                    };
                };

                if (rankresponse == ""){
                    rankresponse = "There are no rank rewards in this server";
                };

                setEmbed.addField("Ranks:", rankresponse);




                await interaction.editReply({embeds: [setEmbed], ephemeral: false});
            } else {
                await interaction.editReply({content: "This server doesn't have leveling turned on", ephemeral: true})
            };
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};