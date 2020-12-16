const Discord = require('discord.js')
const DBL = require('dblapi.js')
const logger = require('./logger')

const lennys = require('./lennys')
const lennys_keys = Object.keys(lennys)

const client = new Discord.Client()
client.on('error', e => logger.error(`${e.name}: ${e.message}\n${e.stack}`))

const dbl = new DBL(process.env.DBL_TOKEN, client)
dbl.on('error', e => logger.error(`${e.name}: ${e.message}\n${e.stack}`))

/**
 * @param {Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel} channel 
 * @param {string} text 
 * @param {Discord.MessageAttachment} attachment 
 */
function send_lenny_channel(channel, text, attachment = null) {
  return channel.send(text, attachment);
}

/**
 * @param {Discord.Message} message 
 * @param {string} key 
 * @param {string} text 
 */
function send_lenny(message, key, text = '') {
  const lenny = lennys[key]

  if (message.guild) {
    logger.log(`(guild|${message.guild.name}|${message.guild.id}|text=${!!text}) - ${key}`)
  } else if (message.author) {
    logger.log(`(user|${message.author.username}#${message.author.discriminator}|${message.author.id}|text=${!!text}) - ${key}`)
  }

  if (typeof lennys[key] === 'string') {
    send_lenny_channel(message.channel, `${lenny} ${text}`);
  } else {
    send_lenny_channel(message.channel, text, new Discord.MessageAttachment(lenny.path));
  }
}

async function set_status() {
  try {
    if (client.ws.status !== 0) return

    const servers = client.guilds.cache.array()
    const members = servers.map(x => x.memberCount).reduce((a, b) => a + b, 0)

    return await client.user.setActivity(`Lenny in ${servers.length} servers with a total of ${members} members. /lenny help`, {
      type: 'PLAYING',
    })
  } catch (e) { }
}

setInterval(set_status, 3600000)

client.on('ready', () => {
  console.log(`I am ready!  ̿̿ ̿̿ ̿̿ ̿'̿'̵͇̿з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿`)

  set_status()

  const help = new Discord.MessageEmbed({
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
        name: 'Source code',
        value: `<https://github.com/QuantumSheep/lennybot>`
      },
      {
        name: 'Help Lenny to spread all over the world',
        value: `<https://discordbots.org/bot/473762588497281024/vote>`
      },
      {
        name: 'Types of lenny',
        value: lennys_keys.join(', ')
      }
    ]
  });

  client.on('raw', async (packet) => {
    if (packet.t === 'INTERACTION_CREATE') {
      const options = packet.d.data?.options;
      const type = options ? options.find(option => option.name === 'type')?.value : 'default';

      const channel = await client.channels.fetch(packet.d.channel_id, true);

      if (channel.type === 'text' || channel.type === 'dm' || channel.type === 'news') {
        /** @type {Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel} */
        const textChannel = channel;
        const lenny = lennys[type ?? 'default'];

        if (typeof lenny === 'string') {
          send_lenny_channel(textChannel, `${lenny}`);
        } else {
          send_lenny_channel(textChannel, '', new Discord.MessageAttachment(lenny.path));
        }
      }
    }
  });

  client.on('message', msg => {
    if (msg.author.bot) return
    if (!msg.content.startsWith(process.env.PREFIX) && !msg.content.startsWith(`<@${client.user.id}>`)) return

    const [, ...args] = msg.content.trim().split(/ +/g)

    if (msg.deletable) {
      msg.delete()
    }

    if (args.length === 0) {
      return send_lenny(msg, 'default')
    }

    const option = args.shift().toLowerCase()
    const text = args.join(' ')

    if (option === 'help') {
      return msg.channel.send(help)
    }

    if (option === 'random') {
      return send_lenny(msg, lennys_keys[Math.floor(Math.random() * lennys_keys.length)], text)
    }

    if (option in lennys) {
      return send_lenny(msg, option, text)
    }

    msg.channel.send('This lenny is unknown ( ͡° ʖ̯ ͡°) - This message will disappear in 10 seconds').then(sended => {
      setTimeout(async () => {
        try {
          if (client.ws.status !== 0 && sended.deletable) {
            sended.delete()
          }
        } catch (e) { }
      }, 10000)
    })
  })
})

client.login(process.env.DISCORD_TOKEN)
