const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('set-role', {
      aliases: ['set-role', 'role', 'رتبة'],
      cooldown: 10000,
      ratelimit: 2,
      channel: "guild",
      userPermissions: ["ADMINISTRATOR"],
      args: [
        {
          id: "role",
          type: "role",
          prompt: {
            start: `**يجب عليك الان إرسال id الرتبة او منشن الرتبة الان**`,
            retry: `**حاول مره أخرى. أرسل الرتبة بطريقة صحيحة**`
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
    let oldguildrole = this.client.guilds_settings.get(message.guild.id, 'quran_role');
    if (!oldguildrole) {
      return `**يجب عليك تجهيز سيرفرك فالبداية \`${this.client.config.prefix}تجهيز\`**`;
    } else {
      this.client.guilds_settings.set(message.guild.id, 'quran_role', args.role.id);
      return `**تم تغير الرتبة المسؤولة عن تشغيل القران الكريم**`;
    }
  }
}