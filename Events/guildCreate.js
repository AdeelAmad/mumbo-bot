const axios = require('axios')

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        await axios.post('http://127.0.0.1:8000/management/', {"id": guild.id}, {auth: {username: "bot", password: "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ"}}).catch(function (error) { return; });
    },
};