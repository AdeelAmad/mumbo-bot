const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios')
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('migrate')
        .setDescription("Migrate bot settings and userdata from the old bot. Won't work if you didn't use old mumbo."),
    async execute(interaction) {

        if (interaction.guild != null) {
            await interaction.deferReply();

            response = await axios.get('https://api.agradehost.com/management/', {
                "data": {"id": interaction.guildId},
                auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
            });
            if (interaction.member.permissions.has('ADMINISTRATOR')) {

                const setEmbed = new EmbedBuilder()
                    .setColor('#ef6459')
                    //Mumbo website link
                    .setAuthor({
                        name: 'Mumbo AFK - Docs',
                        iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                        url: 'https://mumbobot.xyz/commands/'
                    })
                    .setTimestamp();

                setEmbed.setTitle(`Data Migrated. Due to changes in the leveling algorithms, level ranks are not imported and will need to be readded manually.`);

                await axios.get('https://api.agradehost.com/management/migrate/', {
                    "data": {"id": interaction.guildId},
                    auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                }).catch(function (err) {
                    setEmbed.setTitle(`This server's data has been migrated, level ranks are not imported and will need to be readded manually. During the migration we noticed something off. Should any of your data be missing, feel free to contact leep#4160.`);
                });

                await interaction.editReply({embeds: [setEmbed]});
            } else {
                await interaction.editReply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
            };
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};