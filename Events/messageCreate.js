const axios = require('axios')

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Makes sure message happens in a regular text channel
        if (message.guild != null) {
            //check if the coutning module is enabled

            //if counting enabled:

                // Retrieve all counting related data
                const response = await axios.get('http://127.0.0.1:8000/counting/', {"data": {"id": message.guildId}});
                const last_count = response['data']['last_count'];
                const last_counter = response['data']['last_counter'];
                const channel = response['data']['channel'];

                // Check if the channel is in the counting channel
                if (message.channelId == channel) {
                    if (Number(message.cleanContent)) {
                        new_count = message.cleanContent;
                        if (last_count+1  == new_count) {
                            if (last_counter != message.author.id) {
                                axios.put('http://127.0.0.1:8000/counting/', {
                                    "id": message.guildId,
                                    "channel": channel,
                                    "last_count": new_count,
                                    "last_counter": message.author.id
                                });
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
                    }
                }


            //if leveling enabled
        }
    },
};