const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription("Check a user's level")
        .addUserOption(option => option.setName('user').setDescription('The user you wish to view the level of').setRequired(false)),

    async execute(interaction) {

        response = await axios.get('http://127.0.0.1:8000/management/', {
            "data": {"id": interaction.guildId},
            auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
        });

        if (response['data']['leveling']) {
            //USER LEVEL CHECKING CODE START
            if (interaction.options.getUser('user')) {
                user = interaction.options.getUser('user')
            } else {
                user = interaction.member.user;
            };
            if (!user.bot) {

                await axios.post('http://127.0.0.1:8000/leveling/user/', {
                    "id": user.id,
                    "guild_id": interaction.guildId
                }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function () {return;});

                userdata = await axios.get('http://127.0.0.1:8000/leveling/user/', {
                    "data": {
                        "id": user.id,
                        "guild_id": interaction.guildId
                    }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                });
                //USER LEVEL CHECKING CODE END

                const setEmbed = new MessageEmbed()
                    .setColor('#ef6459')
                    .setTitle(`Level for ${user.tag}`)

                    //Mumbo website link
                    .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', url: 'https://deelio.gitbook.io/mumbo-afk/'})
                    .addField("Level LEVEL GOES HERE", `${userdata['data']['xp']}/TOTAL XP FOR LEVEL GOES HERE | PERCENTAGE GOES HERE%`)
                    .setTimestamp();


                await interaction.reply({embeds: [setEmbed], ephemeral: false});
            } else {
                await interaction.reply({content: "Bots can't have levels silly!", ephemeral: true})
            };
        } else {
            await interaction.reply({content: "This server doesn't have leveling turned on", ephemeral: true})
        };
    },
};