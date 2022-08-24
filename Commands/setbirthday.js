const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbirthday')
        .setDescription('Sets your birthday to work with Mumbo Reminders™')
        .addStringOption(option =>
            option.setName('month')
                .setDescription('The month you were born in')
                .setRequired(true)
                .addChoices({name: 'January', value: 'jan'}, {name: 'February', value: 'feb'}, {name: 'March', value: 'mar'}, {name: 'April', value: 'apr'}, {name: 'May', value: 'may'}, {name: 'June', value: 'jun'
                }, {name: 'July', value: 'jul'}, {name: 'August', value: 'aug'}, {name: 'September', value: 'sep'}, {name: 'October', value: 'oct'}, {name: 'November', value: 'nov'}, {name: 'December', value: 'dec'}))
        .addIntegerOption(option => option.setName("day").setDescription('The day you were born on').setRequired(true)),

    async execute(interaction) {
        const setEmbed = new MessageEmbed()
            .setColor('#ef6459')
            .setTitle(`Successfully set ${interaction.options.getString('month')}/${interaction.options.getInteger('day')} to your birthday.`)

            //Mumbo website link
            .setAuthor({
                name: 'Mumbo AFK - Docs',
                iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                URL: 'https://mumbobot.xyz/commands/'
            })
            .setTimestamp()

        // const response = await axios.get('https://api.mumbobot.xyz/voicechannels/', {"data": {"id": interaction.guildId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

        // axios.put('https://api.mumbobot.xyz/voicechannels/', {
        //     "id": interaction.guildId,
        //     "channel_id": response['data']['channel_id'],
        //     "category": response['data']['category'],
        //     "bitrate": interaction.options.getInteger('bitrate')
        // }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})

        await interaction.reply({embeds: [setEmbed]});

    },
};