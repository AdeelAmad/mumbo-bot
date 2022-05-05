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
            })

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
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            ;

            //if leveling enabled
            if (response['data']['leveling']) {
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

                if (Date.now() - Date.parse(userdata['data']['last_message']) > 59999) {
                    oldxp = userdata['data']['xp'];
                    awardedxp = Math.floor(Math.random() * (10) + 15);
                    newxp = oldxp + awardedxp;

                    axios.put('http://127.0.0.1:8000/leveling/user/', {
                        "id": message.author.id,
                        "guild_id": message.guildId,
                        "xp": newxp
                    }, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}});
                };
            };
        };
    },
}