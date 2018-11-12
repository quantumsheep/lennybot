const Discord = require("discord.js");
const config = require("./config.json");
const DBL = require("dblapi.js");

const client = new Discord.Client();
const dbl = new DBL(config.discordbotstoken, client);

dbl.on('error', e => {
    console.log(`Oops! ${e}`);
});

const lennys = {
    'default': '( ͡° ͜ʖ ͡°)',
    'tripping': '( ͡◉ ͜ʖ ͡◉)',
    'sensual': '(͠≖ ͜ʖ͠≖)',
    'communist': '(☭ ͜ʖ ☭)',
    'nothappy': '( ͡° ʖ̯ ͡°)',
    'magic': '(∩ ͡° ͜ʖ ͡°)⊃━☆ﾟ. * ･ ｡ﾟ',
    'wick': ` ̿̿ ̿̿ ̿̿ ̿'̿'̵͇̿з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿`,
    'straya': '( ͜。 ͡ʖ ͜。)',
    'peek': '( ͡° ͜ʖ├┬┴┬',
    'blush': '( ͡°⁄ ⁄ ͜⁄ ⁄ʖ⁄ ⁄ ͡°)',
    'tableflip': '（╯ ͡ ͠° ͟ل͜ ͡°）╯︵ ┻━┻',
    'unflip': '┬──┬ ノ( ͡° ل͜ ͡°ノ)',
    'bill': '－－＝Ξ[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]',
    'love': '✧･ﾟ: *✧･ﾟ♡*( ͡˘̴ ͜ ʖ̫ ͡˘̴ )*♡･ﾟ✧*:･ﾟ✧',
    'loveya': '( ♥ ͜ʖ ♥)',
    'flex': 'ᕦ( ͡° ͜ʖ ͡°)ᕤ',
    'reversed': '(͡ ° ͜ʖ ͡ °)',
    'shrug': '¯\\\\\_( ͡° ͜ʖ ͡°)\\_/¯',
    'sword': '<:::::[]=¤( ͠° ͟ʖ ͡°)',
    'sword2': '<:::::[]=¤( ͡° ͜ʖ ͡°)',
    'fisticuffs': '(ง ͠° ͟ل͜ ͡°)ง',
    'thumbsup': '( ͡⚆ ͜ʖ ͡⚆)∩╮',
    'bird': '( ͡° ͜ʖ ͡°)╭∩╮',
    'dna': {
        path: './adnlenny.gif'
    },
}

client.on('ready', () => {
    console.log(`I am ready!  ̿̿ ̿̿ ̿̿ ̿'̿'̵͇̿з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿`);

    const updateStats = () => {
        const servers = client.guilds.array();
        const members = servers.map(x => x.memberCount).reduce((a, b) => a + b, 0);

        client.user.setActivity(`Lenny in ${servers.length} servers with a total of ${members} members. /lenny help`, {
            type: 'PLAYING'
        });
    };

    updateStats();
    setInterval(updateStats, 3600000);

    const helpEmbed = new Discord.RichEmbed({
        thumbnail: {
            url: client.user.avatarURL
        },
        color: '000000',
        title: "Lenny's help",
        description: `Type \`/lenny\` or mention me (<@${client.user.id}>) to access all lenny's commands.`,
        fields: [
            {
                name: 'help',
                value: `Open the help information panel (the one you're looking at right now)`
            },
            {
                name: 'random',
                value: `Send a random lenny`
            },
            {
                name: 'Invitation link',
                value: `<https://bit.ly/2x47KIB>`
            },
            {
                name: 'Help Lenny to spread all over the world',
                value: `<https://discordbots.org/bot/473762588497281024/vote>`
            },
            {
                name: 'Types of lenny',
                value: Object.keys(lennys).join(', ')
            }
        ]
    });

    const lennysKeys = Object.keys(lennys);

    /**
     * 
     * @param {Discord.Message} msg 
     * @param {string} lenny 
     * @param {string} message 
     */
    const sendLenny = async (msg, lenny, message = '') => {
        try {
            if (message) {
                message = ' ' + message;
            } else {
                message = '';
            }

            if (typeof lennys[lenny] === 'string') {
                message = lennys[lenny] + message;

                msg.channel.send(message);
            } else {
                msg.channel.send(message, new Discord.Attachment(lennys[lenny].path));
            }
        } catch (e) {
            console.log(e);
        }
    };

    client.on('message', async msg => {
        try {
            if (msg.author.bot) return;

            if (msg.content.indexOf(config.prefix) === 0 || msg.content.indexOf(`<@${client.user.id}>`) === 0) {
                const [, ...args] = msg.content.trim().split(/ +/g);

                if (msg.deletable) {
                    await msg.delete();
                }

                if (args.length <= 0) {
                    return await msg.channel.send(lennys.default);
                }

                const lenny = args.shift().toLowerCase();

                const message = args.join(' ');

                if (lenny === 'help') {
                    return msg.channel.send(helpEmbed);
                } else if (lenny === 'random') {
                    const randomLenny = lennysKeys[Math.floor(Math.random() * lennysKeys.length)];

                    return await sendLenny(msg, randomLenny, message);
                } else if (lenny in lennys) {
                    return await sendLenny(msg, lenny, message);
                } else {
                    return await msg.channel.send('This lenny is unknown ( ͡° ʖ̯ ͡°)')
                }
            }
        } catch (e) {
            console.log(e);
        }
    });
});

client.on('error', err => {
    if (err !== 'ECONNRESET') {
        console.log(err);
    }
});

client.login(config.token);