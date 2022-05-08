const axios = require('axios')

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        console.log(`Bot has been added to guild ${guild.id}`)
        await axios.post('https://api.mumbobot.xyz/management/', {"id": guild.id}, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function (error) { return; });
    },
};