const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval', 'evl'],
      cooldown: 10000,
      ratelimit: 2,
      ownerOnly: true,
      args: [
        {
          id: "code",
          match: "rest",
          default: "console.log('Hello World');"
        }
      ]
    });
  }

  exec(message, args) { 
    try {
      const code = args.code;
      let evaled = eval(code);
      let rawEvaled = evaled;
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      let embed = new Discord.MessageEmbed()
        .setTitle(`Evaluated in ${Math.round(this.client.ws.ping)}ms`)
        .addField(":inbox_tray: Input", `\`\`\`js\n${code}\n\`\`\``)
        .addField(":outbox_tray: Output", `\`\`\`js\n${this.clean(evaled).replace(this.client.token, "Are you retarded?")}\n\`\`\``)
        .addField('Type', `\`\`\`xl\n${(typeof rawEvaled).substr(0, 1).toUpperCase() + (typeof rawEvaled).substr(1)}\n\`\`\``)
        .setColor('GREEN');
      message.channel.send({ embed });
    } catch (err) {

      message.channel.send(`\`ERROR\` \`\`\`js\n${this.clean(err)}\n\`\`\``);
    }
  }
  clean(text) {
    if (typeof (text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
  }
}