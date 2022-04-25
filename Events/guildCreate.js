const axios = require('axios')

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        await axios.post('http://127.0.0.1:8000/management/', {"id": guild.id}).catch(function (error) { return; });
    },
};