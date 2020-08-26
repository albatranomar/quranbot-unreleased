const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('leave-server', {
      aliases: ['leave-server', 'plsleave', 'leave-guild'],
      cooldown: 10000,
      ratelimit: 2,
      ownerOnly: true,
      channel: "guild",
      args: [
        {
          id: "guild",
          type: "guild",
          prompt: {
            start: `**يجب عليك الأن إرسال ايدي السيرفر المطلوب**`,
            retry: `**أعد المحاولة. أرسل ايدي السيرفر المطلوب بشكل صحيح**`
          }
        },
        {
          id: "rus",
          type: /^(yes|no|نعم|لا)$/i,
          prompt: {
            start: `**هل أنت متأكد؟ أكتب \`نعم\`**`,
            retry: `**يجب ان يكون جوابك ب \`نعم او لا\`**`
          }
        }
      ]
    });
  }
  /**
   * 
   * @param {Discord.Message} message 
   * @param {*} args 
   */
  exec(message, args) {
    console.log(args.rus.match.input)
    if (['yes', 'نعم'].includes(args.rus.match.input)) {
      args.guild.leave().then((g) => {
        this.client.ownerID.forEach(o => this.client.users.cache.get(o).send(`**Left From ${g.name}**`));
      });
    } else message.util.reply(`**تم إلغاء العملية**`);
  }
}