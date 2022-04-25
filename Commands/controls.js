const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {MessageActionRow, MessageButton} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('controls')
        .setDescription('Access the controls for a voice channel'),

    async execute(interaction) {
        const setEmbed = new MessageEmbed()
            .setColor('#ef6459')
            .setTitle(`Control panel v1.0`)

            //Mumbo website link
            .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', URL: 'https://deelio.gitbook.io/mumbo-afk/'})
            .setTimestamp()

        id = interaction.member.id
        channelid = interaction.member.voice.channelId

        console.log(channelid)

        channeldata = await axios.get('http://127.0.0.1:8000/voicechannels/channel/', {"data": {"id": channelid}}).catch(async function (error) {
            await interaction.reply({
                content: "You are not in a voice channel.",
                ephemeral: true
            });
        });

        if (channeldata) {
            if (channeldata['data']['owner'] == id) {
                const row = new MessageActionRow()
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

                await interaction.reply({embeds: [setEmbed], components: [row]});
            } else {
                await interaction.reply({
                    content: "You have to own the channel to be able to control it.",
                    ephemeral: true
                });
            };
        };

        const filter = (interaction) => {
            if (interaction.user.id === id) return true;
            return interaction.reply({content: "You cannot use this button"});
        };

        const collector = interaction.channel.createMessageComponentCollector({filter, time: 60000})

        collector.on('collect', async i => {

            const id = i.customId;

            channelid = interaction.member.voice.channelId

            switch (id) {
                case 'lock':
                    interaction.guild.channels.fetch(channelid).then(async (channel) => {
                        interaction.followUp({
                            content: `${channel.name} has been locked`,
                            ephemeral: true
                        });
                        channel.permissionOverwrites.edit(channel.guild.id, { CONNECT : false });
                    });
                    break;
                case 'unlock':
                    interaction.guild.channels.fetch(channelid).then(async (channel) => {
                        interaction.followUp({
                            content: `${channel.name} has been unlocked`,
                            ephemeral: true
                        });
                        channel.permissionOverwrites.edit(channel.guild.id, { CONNECT: null });
                    });
                    break;
            };

            const newrow = new MessageActionRow()
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
            i.update({embeds: [setEmbed], components: [newrow]})
        });

        collector.on('end', async i => {
            await interaction.editReply({content: "This Panel Has Expired. Run /controls to make a new one", components: [], embeds: []}).catch(function (error) {return;});
        });
    },
};