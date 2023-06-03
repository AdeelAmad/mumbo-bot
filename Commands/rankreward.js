const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('levelreward')
        .setDescription("Add or remove level rewards for a server")
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add a level reward")
                .addRoleOption(option => option.setName('role').setDescription('The role you wish to reward').setRequired(true))
                .addIntegerOption(option => option.setName('level').setDescription('The level the role should be assigned at').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription("Remove a level reward")
                .addRoleOption(option => option.setName('role').setDescription('The role you wish to remove from the rewards').setRequired(true))
        ),

    async execute(interaction) {

        if (interaction.guild != null) {
            await interaction.deferReply();

            response = await axios.get('https://api.agradehost.com/management/', {
                "data": {"id": interaction.guildId},
                auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
            });

            if (interaction.member.permissions.has('ADMINISTRATOR')) {
                if (response['data']['leveling']) {
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
                        setEmbed.setTitle(`Successfully added ${interaction.options.getRole('role').name} as a reward for level ${interaction.options.getInteger('level')}.`)

                        member = await interaction.guild.members.fetch('744992005158862939');

                        if (interaction.guild.roles.comparePositions(member.roles.highest, interaction.options.getRole('role')) > 0) {
                            await axios.post('https://api.agradehost.com/leveling/rankrewards/', {
                                "guild_id": interaction.guildId,
                                "role_id": interaction.options.getRole('role').id,
                                "level": interaction.options.getInteger('level')
                            }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(async function () {
                                setEmbed.setTitle(`You have already added this role as a reward. Remove then readd to change the level it's awarded at.`);
                            });
                        } else {
                            setEmbed.setTitle(`The bot's highest permission ${member.roles.highest.name} is below ${interaction.options.getRole('role').name}. Please make the bot's higher before retrying.`);
                        };

                    } else if (interaction.options.getSubcommand() === 'remove') {
                        setEmbed.setTitle(`Successfully removed ${interaction.options.getRole('role').name} as a reward.`)
                        await axios.delete('https://api.agradehost.com/leveling/rankrewards/', {
                            "data": {
                                "role_id": interaction.options.getRole('role').id
                            },
                            auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                        }).catch(async function () {
                            setEmbed.setTitle(`This role is not a current level reward.`);
                        });
                    };

                    await interaction.editReply({embeds: [setEmbed], ephemeral: false});
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