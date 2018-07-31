const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('roleUpdate', (oldRole, newRole) => {
    console.log(oldRole, newRole);
})

client.on('message', msg => {
    if (msg.author.bot) return;

    if (msg.content.indexOf(config.prefix) === 0 || msg.isMentioned(client.user)) {
        if (msg.deletable) {
            msg.delete();
        }

        msg.channel.send('( ͡° ͜ʖ ͡°)');
    }
});

client.on('error', err => {
    console.log(err);
});

client.login(config.token);