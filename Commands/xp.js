const { SlashCommandBuilder } = require('discord.js');
const {EmbedBuilder} = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription("Add or remove XP from a user")
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add XP to a user")
                .addUserOption(option => option.setName('user').setDescription('The user you wish to add xp to').setRequired(true))
                .addIntegerOption(option => option.setName('xp').setDescription('The amount of XP').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription("Remove XP from a user")
                .addUserOption(option => option.setName('user').setDescription('The user you wish to remove xp from').setRequired(true))
                .addIntegerOption(option => option.setName('xp').setDescription('The amount of XP').setRequired(true))
        ),

    async execute(interaction) {

        if (interaction.guild != null) {
            await interaction.deferReply();

            response = await axios.get('https://api.mumbobot.xyz/management/', {
                "data": {"id": interaction.guildId},
                auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
            });
            if (interaction.member.permissions.has('ADMINISTRATOR')) {

                if (response['data']['leveling']) {

                    //USER LEVEL CHECKING CODE START
                    user = interaction.options.getUser('user');
                    xp = interaction.options.getInteger('xp');

                    if (!user.bot) {

                        await axios.post('https://api.mumbobot.xyz/leveling/user/', {
                            "id": user.id,
                            "guild_id": interaction.guildId
                        }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function () {
                            return;
                        });

                        userdata = await axios.get('https://api.mumbobot.xyz/leveling/user/', {
                            "data": {
                                "id": user.id,
                                "guild_id": interaction.guildId
                            }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                        });
                        //USER LEVEL CHECKING CODE END

                        const setEmbed = new EmbedBuilder()
                            .setColor('#ef6459')
                            //Mumbo website link
                            .setAuthor({
                                name: 'Mumbo AFK - Docs',
                                iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                                url: 'https://mumbobot.xyz/commands/'
                            })
                            .setTimestamp();

                        if (interaction.options.getSubcommand() === 'add') {
                            await axios.put('https://api.mumbobot.xyz/leveling/user/', {
                                "id": user.id,
                                "guild_id": interaction.guildId,
                                "xp": userdata['data']['xp']+xp
                            }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

                            setEmbed.setTitle(`Added ${xp} XP to ${user.tag}`);
                        } else if (interaction.options.getSubcommand() === 'remove') {
                            await axios.put('https://api.mumbobot.xyz/leveling/user/', {
                                "id": user.id,
                                "guild_id": interaction.guildId,
                                "xp": userdata['data']['xp']-xp
                            }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                            setEmbed.setTitle(`Removed ${xp} XP from ${user.tag}`);
                        };

                        await interaction.editReply({embeds: [setEmbed], ephemeral: false});
                    } else {
                        await interaction.editReply({content: "Bots can't have xp silly!", ephemeral: true})
                    }
                    ;
                } else {
                    await interaction.editReply({content: "This server doesn't have leveling turned on", ephemeral: true})
                };
            } else {
                await interaction.editReply({content: "You do not have the permissions to run this command. Please talk to and admin if you believe this is a mistake", ephemeral: true});
            };
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};