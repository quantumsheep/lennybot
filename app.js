const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

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

        client.user.setActivity(`Lenny in ${servers.length} servers with a total of ${members} members.`, {
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
                name: 'Types of lenny',
                value: Object.keys(lennys).join(', ')
            }
        ]
    });

    const lennysKeys = Object.keys(lennys);

    const sendLenny = (msg, lenny, message = '') => {
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
    };

    client.on('message', msg => {
        if (msg.author.bot) return;

        if (msg.content.indexOf(config.prefix) === 0 || msg.content.indexOf(`<@${client.user.id}>`) === 0) {
            const [, ...args] = msg.content.trim().split(/ +/g);

            if (msg.deletable) {
                msg.delete();
            }

            if (args.length <= 0) {
                return msg.channel.send(lennys.default);
            }

            const lenny = args.shift().toLowerCase();

            const message = args.join(' ');

            if (lenny === 'help') {
                msg.channel.send(helpEmbed);
            } else if (lenny === 'random') {
                const randomLenny = lennysKeys[Math.floor(Math.random() * lennysKeys.length)];

                sendLenny(msg, randomLenny, message);
            } else if (lenny in lennys) {
                sendLenny(msg, lenny, message);
            } else {
                msg.channel.send('This lenny is unknown ( ͡° ʖ̯ ͡°)')
            }
        }
    });
});

client.on('error', err => {
    console.log(err);
});

client.login(config.token);