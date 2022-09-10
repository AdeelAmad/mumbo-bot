const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('All birthday related commands that work with Mumbo Reminders™')
        .addSubcommand(subcommand=>
            subcommand
            .setName('set')
            .setDescription("Set your birthday globally")
            .addStringOption(option =>
                option.setName('month')
                    .setDescription('The month you were born in')
                    .setRequired(true)
                    .addChoices({name: 'January', value: '1'}, {name: 'February', value: '2'}, {name: 'March', value: '3'}, {name: 'April', value: '4'}, {name: 'May', value: '5'}, {name: 'June', value: '6'
                    }, {name: 'July', value: '7'}, {name: 'August', value: '8'}, {name: 'September', value: '9'}, {name: 'October', value: '10'}, {name: 'November', value: '11'}, {name: 'December', value: '12'}))
                .addIntegerOption(option => option.setName("day").setDescription('The day you were born on').setRequired(true))
        )
        .addSubcommand(subcommand=>
            subcommand
                .setName('next')
                .setDescription("The next birthday coming up")
        ),

    async execute(interaction) {
        if (interaction.guild != null) {
            if (interaction.options.getSubcommand() === 'set') {

                const setEmbed = new EmbedBuilder()
                .setColor('#ef6459')
                .setTitle(`Successfully set ${interaction.options.getString('month')}/${interaction.options.getInteger('day')} to your birthday.`)

                //Mumbo website link
                .setAuthor({
                    name: 'Mumbo AFK - Docs',
                    iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                    URL: 'https://mumbobot.xyz/commands/'
                })
                .setTimestamp()

                await axios.post('https://api.mumbobot.xyz/users/birthday/', {
                    "user_id": interaction.user.id}, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function () {return;});

                axios.put('https://api.mumbobot.xyz/users/birthday/', {
                    "user_id": interaction.user.id,
                    "month": interaction.options.getString('month'),
                    "day": interaction.options.getInteger('day')
                }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}})

                await interaction.reply({embeds: [setEmbed]});

            } else if (interaction.options.getSubcommand() === 'next') {

                await interaction.deferReply();

                birthdate = null;
                cont = true;

                userdata = await axios.get('https://api.mumbobot.xyz/users/birthday/', {
                    "data": {
                        "user_id": ""
                    }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                });

                for (const [key, value] of Object.entries(userdata['data'])) {
                    if (cont === true){
                        try {
                            guildmember = await interaction.guild.members.fetch(key);
                            birthdate = `${value[0]}/${value[1]}`
                            cont = false;
                        }
                        catch (e) {
                            console.log(e)
                            return;
                        }
                    }
                }

                const setEmbed = new EmbedBuilder()
                    .setColor('#ef6459')
                    .setTitle(`It is ${guildmember.user.username}'s birthday next on ${birthdate}`)

                    //Mumbo website link
                    .setAuthor({
                        name: 'Mumbo AFK - Docs',
                        iconURL: 'https://yt3.ggpht.com/ytc/AAUvwni0ozzH6cUECFiETyHuOudWQieak6Wf1Y8su3LBlg=s900-c-k-c0x00ffffff-no-rj',
                        URL: 'https://mumbobot.xyz/commands/'
                    })
                    .setTimestamp()

                await interaction.editReply({embeds: [setEmbed]});
            };
        } else {
            await interaction.reply({
                content: "This command cannot be used in DMs",
                ephemeral: true
            });
        };
    },
};