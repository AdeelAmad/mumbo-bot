const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, ChannelType } = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcountingchannel')
        .setDescription('Sets the channel for the bot to monitor for counting')
        .addChannelOption(option => option.setName('channel').setDescription('Select a channel to set for counting moderation').setRequired(true)),

    async execute(interaction) {

        if (interaction.guild != null) {
            const setEmbed = new EmbedBuilder()
                .setColor('#ef6459')
                .setTitle(`Successfully set ${interaction.options.getChannel('channel').name} to the counting channel.`)

                //Mumbo website link
                .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://mumbobot.xyz/commands/'})
                .setTimestamp()

            if (interaction.member.permissions.has('ADMINISTRATOR')) {

                if (interaction.options.getChannel('channel').type == ChannelType.GuildText) {
                    const response = await axios.get('https://api.mumbobot.xyz/counting/', {"data": {"id": interaction.guildId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

                    axios.put('https://api.mumbobot.xyz/counting/', {
                        "id": interaction.guildId,
                        "channel": interaction.options.getChannel('channel')['id'],
                        "last_count": response['data']['last_count'],
                        "last_counter": response['data']['last_counter']
                    }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})

                    await interaction.reply({embeds: [setEmbed]});
                } else {
                    await interaction.reply({content: "That isn't a text channel silly!", ephemeral: true});
                };
            } else {
                await interaction.reply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
            };
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};
