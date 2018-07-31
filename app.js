const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

/**
 * Try to delete a message
 * 
 * @param {Discord.Message} msg 
 */
const tryDelete = msg => {
    if (msg.deletable) {
        msg.delete();
    }
}

const lennys = {
    'default': '( ͡° ͜ʖ ͡°)',
    'tripping': '( ͡◉ ͜ʖ ͡◉)',
    'sensual': '(͠≖ ͜ʖ͠≖)',
    'communist': '(☭ ͜ʖ ☭)',
    'nothappy': '( ͡° ʖ̯ ͡°)'
}

client.on('ready', () => {
    console.log('I am ready!');

    const helpEmbed = new Discord.RichEmbed({
        color: '000000',
        title: "Lenny's help",
        description: `Type \`/lenny\` or mention me (<@${client.user.id}>) to access all lenny's commands.`,
        fields: [
            {
                name: 'help',
                value: `Open the help information panel (the one you're looking at right now)`
            },
            {
                name: 'Types of lenny',
                value: Object.keys(lennys).join(', ')
            }
        ]
    });

    client.on('message', msg => {
        if (msg.author.bot) return;
    
        if (msg.content.indexOf(config.prefix) === 0 || msg.content.indexOf(`<@${client.user.id}>`) === 0) {
            const args = msg.content.trim().split(/ +/g);
            const command = args.shift().toLowerCase();
    
            if (args[0]) {
                if (args[0] === 'help') {
                    msg.channel.send(helpEmbed);
                } else if (args[0] in lennys) {
                    msg.channel.send(lennys[args[0]]);
                } else {
                    msg.channel.send('This lenny is unknown ( ͡° ʖ̯ ͡°)')
                }
            } else {
                msg.channel.send('( ͡° ͜ʖ ͡°)');
            }
    
            tryDelete(msg);
        }
    });
});

client.on('error', err => {
    console.log(err);
});

client.login(config.token);