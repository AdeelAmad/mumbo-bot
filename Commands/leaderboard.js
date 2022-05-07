const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('axios')
'use strict';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription("Get the leaderboard of a server"),

    async execute(interaction) {

        await interaction.deferReply();

        response = await axios.get('http://127.0.0.1:8000/management/', {
            "data": {"id": interaction.guildId},
            auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
        });

        if (response['data']['leveling']) {

            leaderboarddata = await axios.get('http://127.0.0.1:8000/leveling/leaderboard/', {
                "data": {
                    "id": interaction.guildId
                }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
            });

            const setEmbed = new MessageEmbed()
                .setColor('#ef6459')
                .setTitle(`Leaderboard for ${interaction.guild.name}`)

                //Mumbo website link
                .setAuthor({
                    name: 'Mumbo AFK - Docs',
                    iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                    url: 'https://mumbobot.xyz/commands/'
                })
                .setTimestamp();

            leaderboardresponse = "";

            for (const [key, value] of Object.entries(leaderboarddata['data'])) {

                // Set User XP
                userxp = value;

                // Calculate User Level Given XP
                if (userxp > 315616) {
                    userlevel = Math.floor((userxp + 684383)/20000);
                } else {
                    userlevel = Math.floor(Math.sqrt(userxp) * 0.089);
                };

                leaderboardresponse = leaderboardresponse + `${key} | ${userlevel}\n`;
            };

            if (leaderboardresponse == ""){
                leaderboardresponse = "No Users Have Levels On This Server"
            };

            setEmbed.addField("Top Users", leaderboardresponse);

            await interaction.editReply({embeds: [setEmbed]});

        } else {
            await interaction.editReply({content: "This server doesn't have leveling turned on", ephemeral: true})
        };
    },
};