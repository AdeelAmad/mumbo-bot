const fs = require('node:fs');
const path = require('node:path');

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { token } = require('./config.json');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const { AutoPoster } = require('topgg-autoposter')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages] });

const username = "bot";
const password = "%a_938xZeT_VcY8J7uN7GGHnw4auuvVQ";

const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0NDk5MjAwNTE1ODg2MjkzOSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjUzMjc3MzE2fQ.Vt1p0W9zWl2R1nbmg0PPORPhZCb-SxyQ66hPVIbXqsg', client)

ap.on('posted', () => {
    console.log('Posted stats to Top.gg!')
})

Sentry.init({
  dsn: "https://36d42ebd71e147fca3dfd661f4015daa@o1237600.ingest.sentry.io/6387936",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);