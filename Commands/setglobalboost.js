const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setserverboost')
        .setDescription('Sets the server wide xp boost')
        .addNumberOption(option => option.setName('boost').setDescription('Set the server wide xp boost').setRequired(true)),

    async execute(interaction) {

        if (interaction.guild != null) {
            const setEmbed = new EmbedBuilder()
                .setColor('#ef6459')
                .setTitle(`Successfully set ${interaction.options.getNumber('boost')} to the server boost.`)

                //Mumbo website link
                .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://mumbobot.xyz/commands/'})
                .setTimestamp()

            if (interaction.member.permissions.has('ADMINISTRATOR')) {
                const response = await axios.get('https://api.agradehost.com/leveling/', {"data": {"id": interaction.guildId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

                axios.put('https://api.agradehost.com/leveling/', {
                    "id": interaction.guildId,
                    "global_boost": interaction.options.getNumber('boost'),
                    "levelupchannel": response['data']['levelupchannel'],
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