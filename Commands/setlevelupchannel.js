const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlevelupchannel')
        .setDescription('Sets the channel for level up messages to be sent in')
        .addChannelOption(option => option.setName('channel').setDescription('Select a channel for level up messages to be sent in').setRequired(true)),

    async execute(interaction) {
        const setEmbed = new MessageEmbed()
            .setColor('#ef6459')
            .setTitle(`Successfully set ${interaction.options.getChannel('channel')} to the level up channel.`)

            //Mumbo website link
            .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://deelio.gitbook.io/mumbo-afk/'})
            .setTimestamp()

        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            const response = await axios.get('http://127.0.0.1:8000/leveling/', {"data": {"id": interaction.guildId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

            axios.put('http://127.0.0.1:8000/leveling/', {
                "id": interaction.guildId,
                "global_boost": response['data']['global_boost'],
                "levelupchannel": interaction.options.getChannel('channel')['id'],
            }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

            await interaction.reply({embeds: [setEmbed]});
        } else {
            await interaction.reply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
        }
    },
};