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
    'nothappy': '( ͡° ʖ̯ ͡°)',
    'attack': '(∩ ͡° ͜ʖ ͡°)⊃━☆ﾟ. * ･ ｡ﾟ',
    'wick': ` ̿̿ ̿̿ ̿̿ ̿'̿'̵͇̿з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿`,
    'straya': '( ͜。 ͡ʖ ͜。)',
    'peek': '( ͡° ͜ʖ├┬┴┬',
    'blush': '( ͡°⁄ ⁄ ͜⁄ ⁄ʖ⁄ ⁄ ͡°)',
    'flip': '（╯ ͡ ͠° ͟ل͜ ͡°）╯︵ ┻━┻',
    'bill': '－－＝Ξ[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]',
    'love': '✧･ﾟ: *✧･ﾟ♡*( ͡˘̴ ͜ ʖ̫ ͡˘̴ )*♡･ﾟ✧*:･ﾟ✧',
    'loveya': '( ♥ ͜ʖ ♥)'
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
            args.shift()

            if (args.length >= 1) {
                const lenny = args.shift().toLowerCase();

                const message = args.join(' ');

                if (lenny === 'help') {
                    msg.channel.send(helpEmbed);
                } else if (lenny in lennys) {
                    msg.channel.send(lennys[lenny] + (message ? ' ' + message : ''));
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