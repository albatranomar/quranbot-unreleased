const Discord = require("discord.js");
const { Command } = require('discord-akairo');

module.exports = class extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'hlp', 'h', 'commands', 'cmds'],
      cooldown: 10000,
      ratelimit: 2
    });
  }

  exec(message) {
    let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setColor("RANDOM")
      .setThumbnail("https://cdn.discordapp.com/avatars/692060368780001300/94e577ebe3a8970c72ccbbca968309f8.webp")
      .addField('**`أوامر الإدارة`**', `**⇩**`)
      .addField('**-تكرار**', `**تكرار المقطع المشغل**`)
      .addField('**-تحديد**', `**تعين روم الاوامر (أختياري)**`)
      .addField('**`أوامر الإستماع`**', `**⇩**`)
      .addField('**-القران**', `**امر تشغيل,-القران كامل لتشغيل سورة معينة -البقرة 100 يمكنك اسخدام سور اخرى**`)
      .addField('**-حالي**', `**عرض ما تستمع اليه الان**`)
      .addField('**-تعليق**', `**ايقاف سماع القران الكريم مؤقتا**`)
      .addField('**-الانتظار**', `**امر لعرض قائمة الانتظار.**`)
      .addField('**-استئنف**', `**بدء الإستماع الى القران الكريم من جديد**`)
      .addField('**-تخطي**', `**امر التخطي.عمل تخطي للمقطع الذي تستمع اليه والانتقال الى المقطع التالي في قائمة الانتظار**`)
      .addField('**-توقف**', `**مسح قائمة الإنتظار**`)
      .addField('**-صوت**', `**تعديل مستوى صوت القران الكريم [1-100]**`)
      .addField('**`أوامر عامة`**', `**⇩**`)
      .addField('**-help**', `**امر المساعدة**`)
      .addField('**-inv**', `**اضافة البوت الى سيرفرك**`)
      .addField('**-سرعة**', `**معرفة سرعة البوت**`)
      .addField('**-القراء**', `**عرض القراء الذي يمكن الأستماع إليهم**`)
      .addField('**-اية**', `**أمر اية الذي يرسل لك صورة لأي اية من القران الكريم-اية سورة رقم**`)
      .addField('**`أخرى`**', `**Website [View](http://quranbot.ml/)|Link Bot [Add](https://discordapp.com/api/oauth2/authorize?client_id=692060368780001300&permissions=8&scope=bot)|Support [join](https://discord.gg/3rZjSyS)
    **`)
    message.author.send(embed).then(() => {
      message.react("✅");
    }).catch(() => {
      message.react("❌");
    });
  }
}