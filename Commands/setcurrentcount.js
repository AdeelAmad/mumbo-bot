const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcurrentcount')
        .setDescription('Sets the current count of the counting channel')
        .addIntegerOption(option => option.setName('count').setDescription('Set the current count of the counting channel').setRequired(true)),

    async execute(interaction) {

        if (interaction.guild != null) {
            const setEmbed = new EmbedBuilder()
                .setColor('#ef6459')
                .setTitle(`Successfully set ${interaction.options.getInteger('count')} to the current count.`)

                //Mumbo website link
                .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://mumbobot.xyz/commands/'})
                .setTimestamp()

            if (interaction.member.permissions.has('ADMINISTRATOR')) {
                const response = await axios.get('https://api.mumbobot.xyz/counting/', {"data": {"id": interaction.guildId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

                axios.put('https://api.mumbobot.xyz/counting/', {
                    "id": interaction.guildId,
                    "channel": response['data']['channel'],
                    "last_count": interaction.options.getInteger('count'),
                    "last_counter": response['data']['last_counter']
                }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})


                await interaction.reply({embeds: [setEmbed]});
            } else {
                await interaction.reply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
            }
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};