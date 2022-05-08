const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {MessageActionRow, MessageButton} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('controls')
        .setDescription('Access the controls for a voice channel'),

    async execute(interaction) {
        if (interaction.guild != null) {
            const setEmbed = new MessageEmbed()
                .setColor('#ef6459')
                .setTitle(`Control panel v1.0`)

                //Mumbo website link
                .setAuthor({
                    name: 'Mumbo AFK - Docs',
                    iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                    URL: 'https://mumbobot.xyz/commands/'
                })
                .setTimestamp()

            id = interaction.member.id
            channelid = interaction.member.voice.channelId

            channeldata = await axios.get('https://api.mumbobot.xyz/voicechannels/channel/', {
                "data": {"id": channelid},
                auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
            }).catch(async function (error) {
                await interaction.reply({
                    content: "You are not in a voice channel.",
                    ephemeral: true
                });
            });

            if (channeldata) {
                if (channeldata['data']['owner'] == id) {
                    const controlrow = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('lock')
                                .setLabel('Lock Channel')
                                .setStyle("DANGER"),
                            new MessageButton()
                                .setCustomId('unlock')
                                .setLabel('Unlock Channel')
                                .setStyle("SUCCESS"),
                            new MessageButton()
                                .setCustomId('nomic')
                                .setLabel('Create No Mic')
                                .setStyle("SECONDARY")
                                .setDisabled(true)
                        );

                    await interaction.reply({embeds: [setEmbed], components: [controlrow]});


                    const filter = (interaction) => {
                        if ((interaction.user.id === id) && interaction.customId == "lock" || interaction.customId == "unlock") return true;
                        if (interaction.customId == "counting" || interaction.customId == "leveling" || interaction.customId == "voicechannel" || interaction.customId == "afkmusic") return;
                        return interaction.reply({content: "You cannot use this button", ephemeral: true});
                    };

                    const controlcollector = interaction.channel.createMessageComponentCollector({filter, time: 60000})

                    controlcollector.on('collect', async i => {

                        const id = i.customId;

                        channelid = interaction.member.voice.channelId

                        switch (id) {
                            case 'lock':
                                interaction.guild.channels.fetch(channelid).then(async (channel) => {
                                    interaction.followUp({
                                        content: `${channel.name} has been locked`,
                                        ephemeral: true
                                    });
                                    channel.permissionOverwrites.edit(channel.guild.id, {CONNECT: false});
                                });
                                break;
                            case 'unlock':
                                interaction.guild.channels.fetch(channelid).then(async (channel) => {
                                    interaction.followUp({
                                        content: `${channel.name} has been unlocked`,
                                        ephemeral: true
                                    });
                                    channel.permissionOverwrites.edit(channel.guild.id, {CONNECT: null});
                                });
                                break;
                        }
                        ;

                        const controlnewrow = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('lock')
                                    .setLabel('Lock Channel')
                                    .setStyle("DANGER"),
                                new MessageButton()
                                    .setCustomId('unlock')
                                    .setLabel('Unlock Channel')
                                    .setStyle("SUCCESS"),
                                new MessageButton()
                                    .setCustomId('nomic')
                                    .setLabel('Create No Mic')
                                    .setStyle("SECONDARY")
                                    .setDisabled(true),
                            );
                        i.update({embeds: [setEmbed], components: [controlnewrow]}).catch(function (error) {
                            return;
                        });
                    });

                    controlcollector.on('end', async i => {
                        await interaction.editReply({
                            content: "This Panel Has Expired. Run /controls to make a new one",
                            components: [],
                            embeds: []
                        }).catch(function (error) {
                            return;
                        });
                    });

                } else {
                    await interaction.reply({
                        content: "You have to own the channel to be able to control it.",
                        ephemeral: true
                    });
                };
            };
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};
