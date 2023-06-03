const { SlashCommandBuilder } = require('discord.js');
const {EmbedBuilder} = require('discord.js');
const {ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Change bot settings for the server'),

    async execute(interaction) {

        if (interaction.guild != null) {
            if (interaction.member.permissions.has('ADMINISTRATOR')) {

                const setEmbed = new EmbedBuilder()
                    .setColor('#ef6459')
                    .setTitle(`Settings panel v1.0`)

                    //Mumbo website link
                    .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://mumbobot.xyz/commands/'})
                    .setTimestamp()

                id = interaction.member.id;
                response = await axios.get('https://api.agradehost.com/management/', {"data": {"id": interaction.guildId}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

                function determineColor (module) {
                    if (response['data'][module] === true) {
                        return 3;
                    } else {
                        return 4;
                    }
                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('counting')
                            .setLabel('Counting')
                            .setStyle(determineColor('counting')),
                        new ButtonBuilder()
                            .setCustomId('voicechannel')
                            .setLabel('Voice Channels')
                            .setStyle(determineColor('voicechannel')),
                        new ButtonBuilder()
                            .setCustomId('leveling')
                            .setLabel('Leveling')
                            .setStyle(determineColor('leveling')),
                        new ButtonBuilder()
                            .setCustomId('afkmusic')
                            .setLabel('AFK Music')
                            .setStyle(determineColor('afkmusic')),
                        new ButtonBuilder()
                            .setCustomId('waifu')
                            .setLabel('Waifu')
                            .setStyle(determineColor('waifu'))
                    );


                await interaction.reply({embeds: [setEmbed], components: [row]});



                const filter = (interaction) => {
                    if (interaction.user.id === id && interaction.customId == "counting" || interaction.customId == "leveling" || interaction.customId == "voicechannel" || interaction.customId == "afkmusic" || interaction.customId == "waifu") return true;
                    if (interaction.customId == "lock" || interaction.customId == "unlock") return;
                    return interaction.reply({content: "You cannot use this button", ephemeral: true});
                };

                const collector = interaction.channel.createMessageComponentCollector({filter, time: 150000})

                collector.on('collect', async i => {

                    const id = i.customId;

                    counting = response['data']['counting']
                    voicechannel = response['data']['voicechannel']
                    leveling = response['data']['leveling']
                    afkmusic = response['data']['afkmusic']
                    waifu = response['data']['waifu']

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
                            break;
                        case 'waifu':
                            waifu = !response['data']['waifu']
                            break;
                    }

                    response = await axios.put('https://api.agradehost.com/management/', {
                        "id": interaction.guildId,
                        "counting": counting,
                        "voicechannel": voicechannel,
                        "leveling": leveling,
                        "afkmusic": afkmusic,
                        "waifu": waifu,
                        "alert": response['data']['alert']
                    }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function (error) {return;})

                    function determineColor (module) {
                        if (response['data'][module] === true) {
                            return 3;
                        } else {
                            return 4;
                        }
                    }

                    const newrow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('counting')
                                .setLabel('Counting')
                                .setStyle(determineColor('counting')),
                            new ButtonBuilder()
                                .setCustomId('voicechannel')
                                .setLabel('Voice Channels')
                                .setStyle(determineColor('voicechannel')),
                            new ButtonBuilder()
                                .setCustomId('leveling')
                                .setLabel('Leveling')
                                .setStyle(determineColor('leveling')),
                            new ButtonBuilder()
                                .setCustomId('afkmusic')
                                .setLabel('AFK Music')
                                .setStyle(determineColor('afkmusic')),
                            new ButtonBuilder()
                                .setCustomId('waifu')
                                .setLabel('Waifu')
                                .setStyle(determineColor('waifu'))
                        );

                    await i.update({embeds: [setEmbed], components: [newrow]}).catch(function (error) {return;});
                });

                collector.on('end', async i => {
                    await interaction.editReply({content: "This Panel Has Expired. Run /settings to make a new one", components: [], embeds: []}).catch(function (error) {return;});
                });


            } else {
                await interaction.reply({
                    content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake",
                    ephemeral: true
                });
            };
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};