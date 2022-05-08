const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription("Check a user's level")
        .addUserOption(option => option.setName('user').setDescription('The user you wish to view the level of').setRequired(false)),

    async execute(interaction) {

        if (interaction.guild != null) {
            await interaction.deferReply();

            response = await axios.get('https://api.mumbobot.xyz/management/', {
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

                    await axios.post('https://api.mumbobot.xyz/leveling/user/', {
                        "id": user.id,
                        "guild_id": interaction.guildId
                    }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function () {return;});

                    userdata = await axios.get('https://api.mumbobot.xyz/leveling/user/', {
                        "data": {
                            "id": user.id,
                            "guild_id": interaction.guildId
                        }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                    });
                    //USER LEVEL CHECKING CODE END

                    // Set User XP
                    userxp = userdata['data']['xp'];

                    // Calculate User Level Given XP
                    if (userxp > 315616) {
                        userlevel = Math.floor((userxp + 684383)/20000);
                    } else {
                        userlevel = Math.floor(Math.sqrt(userxp) * 0.089);
                    };

                    // Calculate XP For User's Next Level
                    if (userlevel > 50) {
                        userxpfornextlevel = Math.floor((20000 * (userlevel+1)) - 684383);
                    } else {
                        userxpfornextlevel = Math.floor(Math.pow((userlevel + 1), 2)/Math.pow(0.089, 2));
                    };

                    // Calculate XP For User's Current Level
                    if (userlevel > 50) {
                        userxpforcurrentlevel = Math.floor((20000 * (userlevel)) - 684383);
                    } else {
                        userxpforcurrentlevel = Math.floor(Math.pow((userlevel), 2)/Math.pow(0.089, 2));
                    };

                    const setEmbed = new MessageEmbed()
                        .setColor('#ef6459')
                        .setTitle(`Level for ${user.tag}`)

                        //Mumbo website link
                        .setAuthor({name: 'Mumbo AFK - Docs', iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj', url: 'https://mumbobot.xyz/commands/'})
                        .addField(`Level ${userlevel}`, `${userxp-userxpforcurrentlevel}/${userxpfornextlevel-userxpforcurrentlevel} | ${Math.floor(((userxp-userxpforcurrentlevel)/(userxpfornextlevel-userxpforcurrentlevel))*100)}%`)
                        .setTimestamp();


                    await interaction.editReply({embeds: [setEmbed], ephemeral: false});
                } else {
                    await interaction.editReply({content: "Bots can't have levels silly!", ephemeral: true})
                };
            } else {
                await interaction.editReply({content: "This server doesn't have leveling turned on", ephemeral: true})
            };
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};