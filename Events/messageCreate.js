const axios = require('axios')

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Makes sure message happens in a regular text channel
        if (message.guild != null) {
            //check if the counting module is enabled
            response = await axios.get('http://127.0.0.1:8000/management/', {
                "data": {"id": message.guildId},
                auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
            });

            if (response['data']['counting']) {

                // Retrieve all counting related data
                const response = await axios.get('http://127.0.0.1:8000/counting/', {
                    "data": {"id": message.guildId},
                    auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                });
                const last_count = response['data']['last_count'];
                const last_counter = response['data']['last_counter'];
                const channel = response['data']['channel'];

                // Check if the channel is in the counting channel
                if (message.channelId == channel) {
                    if (Number(message.cleanContent)) {
                        new_count = message.cleanContent;
                        if (last_count + 1 == new_count) {
                            if (last_counter != message.author.id) {
                                axios.put('http://127.0.0.1:8000/counting/', {
                                    "id": message.guildId,
                                    "channel": channel,
                                    "last_count": new_count,
                                    "last_counter": message.author.id
                                }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                            } else {
                                message.delete();
                                if (!message.author.bot) {
                                    message.author.send("Counting too fast can be bad for your health, let somoene else have a turn");
                                }
                            }
                        } else {
                            message.delete();
                            if (!message.author.bot) {
                                message.author.send("Now that doesn't seem to be the next number");
                            }
                        }
                    } else {
                        message.delete();
                        if (!message.author.bot) {
                            message.author.send("Come on, you gotta send a number");
                        };
                    };
                };
            };

            //if leveling enabled
            if (response['data']['leveling']) {
                if (!message.author.bot) {
                    userdata = await axios.get('http://127.0.0.1:8000/leveling/user/', {
                        "data": {
                            "id": message.author.id,
                            "guild_id": message.guildId
                        }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                    }).catch(async function () {
                        await axios.post('http://127.0.0.1:8000/leveling/user/', {
                            "id": message.author.id,
                            "guild_id": message.guildId
                        }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                    });

                    userdata = await axios.get('http://127.0.0.1:8000/leveling/user/', {
                        "data": {
                            "id": message.author.id,
                            "guild_id": message.guildId
                        }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                    });

                    //UPDATE TIME AFTER DONE TESTING
                    if (Date.now() - Date.parse(userdata['data']['last_message']) > 1) {

                        guildlevelingdata = await axios.get('http://127.0.0.1:8000/leveling/', {
                            "data": {
                                "id": message.guildId,
                            }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                        });

                        oldxp = userdata['data']['xp'];
                        awardedxp = Math.floor((Math.random() * (10) + 15)*guildlevelingdata['data']['global_boost']);
                        newxp = oldxp + awardedxp;

                        await axios.put('http://127.0.0.1:8000/leveling/user/', {
                            "id": message.author.id,
                            "guild_id": message.guildId,
                            "xp": newxp
                        }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});

                        if (oldxp > 315616) {
                            oldlevel = Math.floor((oldxp + 684383)/20000);
                        } else {
                            oldlevel = Math.floor(Math.sqrt(oldxp) * 0.089);
                        };

                        if (newxp > 315616) {
                            newlevel = Math.floor((newxp + 684383)/20000);
                        } else {
                            newlevel = Math.floor(Math.sqrt(newxp) * 0.089);
                        };

                        if (oldlevel != newlevel) {
                            message.guild.channels.fetch(guildlevelingdata['data']['levelupchannel']).then(channel => channel.send(`:tada: Congratulations <@${message.author.id}> on reaching level ${newlevel}`)).catch(function () {message.channel.send(`:tada: Congratulations <@${message.author.id}> on reaching level ${newlevel}`)});
                        };

                        ranks = await axios.get('http://127.0.0.1:8000/leveling/rankrewards/', {
                            "data": {
                                "guild_id": message.guildId,
                            }, auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}
                        });

                        for (const [key, value] of Object.entries(ranks['data'])) {

                            // Set User XP
                            rankdata = value;

                            // Detemine Ranks To Be Given
                            if (newlevel >= rankdata['level']) {
                                // Give Rank
                                message.member.roles.add(rankdata['role_id']).catch(function () {return;});
                            } else if (newlevel < rankdata['level']) {
                                // Remove Rank
                                message.member.roles.remove(rankdata['role_id']).catch(function () {return;});
                            };
                        };
                    };
                };
            };
        };
    },
};