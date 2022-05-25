const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection, generateDependencyReport } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType  } = require('@discordjs/voice');
const { createReadStream } = require('node:fs');
const axios = require('axios')


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        client.user.setActivity("v1.0.2 /help");

        const player = createAudioPlayer();

        const resource = createAudioResource(createReadStream('./events/audio/afk.mp3', {
            inputType: StreamType.OggOpus,
        }));

        player.play(resource);

        player.on('idle', () => {
            const resource = createAudioResource(createReadStream('./events/audio/afk.mp3', {
                inputType: StreamType.OggOpus,
            }));
            player.play(resource);
        });


        for (guild of client.guilds.cache) {

            guildsettings = await axios.get('https://api.mumbobot.xyz/management/', {"data": {"id": guild[0]}, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function () {
                await axios.post('https://api.mumbobot.xyz/management/', {"id": guild[0]}, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function (error) { return; });
            });

            if (guild[1].afkChannelId != null) {
                const connection = joinVoiceChannel({
                    channelId: guild[1].afkChannelId,
                    guildId: guild[0],
                    adapterCreator: guild[1].voiceAdapterCreator,
                });

                guild[1].members.fetch('744992005158862939').then((member) => {
                    member.edit({mute: false, deaf: true}).catch(function (error){return;});
                });

                const subscription = connection.subscribe(player);

                if (!guildsettings['data']['afkmusic']) {
                    connection.destroy();
                };
            };
        };
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};