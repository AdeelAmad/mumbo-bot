const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcreatecategory')
        .setDescription('Sets the category for voice channels to be created in')
        .addChannelOption(option => option.setName('category').setDescription('Select a category for voice channels to be created in').setRequired(true))
        .setDefaultPermission(false),

    async execute(interaction) {
        const setEmbed = new MessageEmbed()
            .setColor('#ef6459')
            .setTitle(`Successfully set ${interaction.options.getChannel('category')} to the create category.`)

            //Mumbo website link
            .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://deelio.gitbook.io/mumbo-afk/'})
            .setTimestamp()

        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            const response = await axios.get('http://127.0.0.1:8000/voicechannels/', {"data": {"id": interaction.guildId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

            axios.put('http://127.0.0.1:8000/voicechannels/', {
                "id": interaction.guildId,
                "channel_id": response['data']['channel_id'],
                "category": interaction.options.getChannel('category')['id'],
                "bitrate": response['data']['bitrate']
            }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})

            await interaction.reply({embeds: [setEmbed]});
        } else {
            await interaction.reply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
        }
    },
};