const axios = require('axios')

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        await axios.post('https://api.agradehost.com/management/', {"id": guild.id}, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function (error) { return; });
        console.log(`Bot has been added to guild ${guild.id}`)
    },
};
