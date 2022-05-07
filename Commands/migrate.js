const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios')
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('migrate')
        .setDescription("Migrate bot settings and userdata from the old bot. Won't work if you didn't use old mumbo."),
    async execute(interaction) {

        await interaction.deferReply();

        response = await axios.get('http://127.0.0.1:8000/management/', {
            "data": {"id": interaction.guildId},
            auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
        });
        if (interaction.member.permissions.has('ADMINISTRATOR')) {

            const setEmbed = new MessageEmbed()
                .setColor('#ef6459')
                //Mumbo website link
                .setAuthor({
                    name: 'Mumbo AFK - Docs',
                    iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                    url: 'https://mumbobot.xyz/commands/'
                })
                .setTimestamp();

            setEmbed.setTitle(`Data Migrated`);

            await axios.get('http://127.0.0.1:8000/management/migrate/', {
                "data": {"id": interaction.guildId},
                auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
            }).catch(function () {
                setEmbed.setTitle(`An error occured while migrating. Either this server has already been migrated or the old bot didn't have any data for this server.`);
            });

            await interaction.editReply({embeds: [setEmbed]});
        } else {
            await interaction.editReply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
        };
    },
};