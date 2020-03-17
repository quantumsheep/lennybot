const Discord = require('discord.js')
const DBL = require('dblapi.js')

const config = require('./config.json')
const lennys = require('./lennys')
const lennys_keys = Object.keys(lennys)

const client = new Discord.Client()
client.on('error', console.error)

const dbl = new DBL(config.discordbotstoken, client)
dbl.on('error', console.error)

/**
 * 
 * @param {Discord.Message} message 
 * @param {string} key 
 * @param {string} text 
 */
function send_lenny(message, key, text = '') {
  const lenny = lennys[key]

  if (typeof lennys[key] === 'string') {
    return message.channel.send(`${lenny} ${text}`)
  } else {
    return message.channel.send(text, new Discord.MessageAttachment(lenny.path))
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
  })

  client.on('message', msg => {
    if (msg.author.bot) return
    if (!msg.content.startsWith(config.prefix) && !msg.content.startsWith(`<@${client.user.id}>`)) return

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

client.login(config.token)
