const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {MessageActionRow, MessageButton} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Change bot settings for the server'),

    async execute(interaction) {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {

            const setEmbed = new MessageEmbed()
                .setColor('#ef6459')
                .setTitle(`Settings panel v1.0`)

                //Mumbo website link
                .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://deelio.gitbook.io/mumbo-afk/'})
                .setTimestamp()

            id = interaction.member.id
            response = await axios.get('http://127.0.0.1:8000/management/', {"data": {"id": interaction.guildId}})

            function determineColor (module) {
                if (response['data'][module] === true) {
                    return "SUCCESS";
                } else {
                    return "DANGER";
                }
            }

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('counting')
                        .setLabel('Counting')
                        .setStyle(determineColor('counting')),
                    new MessageButton()
                        .setCustomId('voicechannel')
                        .setLabel('Voice Channels')
                        .setStyle(determineColor('voicechannel')),
                    new MessageButton()
                        .setCustomId('leveling')
                        .setLabel('Leveling')
                        .setStyle(determineColor('leveling')),
                    new MessageButton()
                        .setCustomId('afkmusic')
                        .setLabel('AFK Music')
                        .setStyle(determineColor('afkmusic')),
                );


            await interaction.reply({embeds: [setEmbed], components: [row]});




            const filter = (interaction) => {
                if (interaction.user.id === id) return true;
                return interaction.reply({content: "You cannot use this button"});
            };

            const collector = interaction.channel.createMessageComponentCollector({filter, time: 150000})

            collector.on('collect', async i => {

                const id = i.customId;

                counting = response['data']['counting']
                voicechannel = response['data']['voicechannel']
                leveling = response['data']['leveling']
                afkmusic = response['data']['afkmusic']

                switch (id) {
                    case 'counting':
                        counting = !response['data']['counting'];
                        break;
                    case 'voicechannel':
                        voicechannel = !response['data']['voicechannel']
                        break;
                    case 'leveling':
                        leveling = !response['data']['leveling']
                        break;
                    case 'afkmusic':
                        afkmusic = !response['data']['afkmusic']
                }

                response = await axios.put('http://127.0.0.1:8000/management/', {
                    "id": interaction.guildId,
                    "counting": counting,
                    "voicechannel": voicechannel,
                    "leveling": leveling,
                    "afkmusic": afkmusic,
                    "alert": response['data']['alert']
                })

                function determineColor (module) {
                    if (response['data'][module] === true) {
                        return "SUCCESS";
                    } else {
                        return "DANGER";
                    }
                }

                const newrow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('counting')
                            .setLabel('Counting')
                            .setStyle(determineColor('counting')),
                        new MessageButton()
                            .setCustomId('voicechannel')
                            .setLabel('Voice Channels')
                            .setStyle(determineColor('voicechannel')),
                        new MessageButton()
                            .setCustomId('leveling')
                            .setLabel('Leveling')
                            .setStyle(determineColor('leveling')),
                        new MessageButton()
                            .setCustomId('afkmusic')
                            .setLabel('AFK Music')
                            .setStyle(determineColor('afkmusic')),
                    );

                await i.update({content: "Enable or disable modules:", components: [newrow]})
            });





        } else {
            await interaction.reply({
                content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake",
                ephemeral: true
            });
        };
    },
};