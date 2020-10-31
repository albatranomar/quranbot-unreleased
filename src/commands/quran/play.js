let { MessageEmbed, Message } = require("discord.js");
const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const fs = require('fs');
const { type } = require("os");

module.exports = class extends Command {
  constructor() {
    super('play', {
      aliases: ['play', 'mushaf', 'مصحف', 'قران', 'القران'],
      category: 'quran',
      cooldown: 15000,
      ratelimit: 1,
      channel: "guild",
      args: [
        {
          id: "toplay",
          type: async (message, arg) => {
            if (['all', 'كامل', 'كاملا'].includes(arg.toLowerCase())) {
              return "ALL"
            } else {
              let s = await this.getSurah(arg);
              if (s instanceof Object) {
                return s;
              }
            }
            return null;
          },
          prompt: {
            start: `**يجب عليك الان إرسال إسم صحيح لسورة أو رقمها.**`,
            retry: `**حاول مره اخرى, إرسال إسم صحيح لسورة أو رقمها **`
          }
        }
      ],
      description: {
        content: `Play a surah from the Quran by some of the readers in the voice channel.`,
        usage: 'play [surah|all]',
        examples: [
          `play كامل`,
          `play كاملا`,
          `play all`,
          `play البقرة`,
          `play اسم السورة`
        ]
      }
    })
    this.defaultGuildQueue = {
      songs: [],
      volume: 20,
      playing: true,
      repeat: false,
      stoped: false
    };
  }
  /**
  * 
  * @param {Message} message 
  * @param {*} args 
  */
  async exec(message, { toplay }) {
    const { channel } = message.member.voice;
    if (!channel) return `**يجب ان تكون في روم صوتي للأستماع للقرآن الكريم`;
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return '**I cannot connect to your voice channel, make sure I have the proper permissions!**';
    if (!permissions.has('SPEAK')) return '**I cannot speak in this voice channel, make sure I have the proper permissions!**';
    let readers = require("../../quran-data/readers.json");
    let askForReaderNumberMessage = await message.util.send(``, {
      embed: new MessageEmbed()//.setTitle(`أرسل رقم القارىء الذي تريده`)
        .setDescription(`\`\`\`ـ ـ ـ ـ ـ ـ ـ ـ اختر رقم القارىءـ ـ ـ ـ ـ ـ ـ ـ\`\`\`**\n${readers.map(r => `\`${r.id}\`- ${r.name}`).join("\n")}**\`\`\`ـ ـ ـ ـ ـ ـ ـ ـ 50 ثانية للأختيارـ ـ ـ ـ ـ ـ ـ ـ\`\`\``)
    })
    let readerNumberCollector = await askForReaderNumberMessage.channel.createMessageCollector((m) => m.author.id == message.author.id && readers.map(r => r.id).includes(parseInt(m.content)), { max: 1, time: 50000 });
    readerNumberCollector.on('collect', async (answerForReaderNumber) => {
      let theReader = readers.find(r => r.id == parseInt(answerForReaderNumber.content));
      if (answerForReaderNumber.deletable) answerForReaderNumber.delete();
      let serverQueue = this.client.guilds_settings.get(message.guild.id, 'quran_queue', {
        ...this.defaultGuildQueue,
        voiceChannelID: channel.id
      });


      if (serverQueue) {
        if (serverQueue.songs.length >= 5 && !serverQueue.stoped) return message.util.send(`**${message.author}, لا يمكن إضافة اكثر من 5 مقاطع الى قائمة الانتظار**`);
        let songToPlay = {};
        if (toplay == "ALL") {
          songToPlay = {
            title: `القران الكريم كاملا بصوت القارئ ${theReader.name}.`,
            url: `./Qaris/${theReader.folder_name}/v2v.mp3`,
            type: "ALL",
          }
        } else {
          songToPlay = {
            title: `القران الكريم. سورة ${toplay.name.arabic} بصوت القارئ ${theReader.name}`,
            url: `./Qaris/${theReader.folder_name}/surahs/${toplay.id}.mp3`,
            type: "Alone",
          }
        }

        let qEmbed = new MessageEmbed()
          .setColor("RANDOM")
          .setFooter(`بواسطة: ${message.author.tag}`, message.author.displayAvatarURL())
          .setThumbnail(`https://cdn.discordapp.com/attachments/702827650733047828/751848553168764948/PicsArt_09-05-07.png`);
        if (toplay != "ALL") {
          qEmbed.addField('معلومات', `عدد الأيات : ${toplay.ayat} \nمن الصفحة ${toplay.page[0]} الى الصفحة ${toplay.page[1]}\nسورة ${(toplay.revelation.place == 'makkah') ? 'مكية' : 'مدنية'}\nترتيب النزول: ${toplay.revelation.order}`);
        }
        if (serverQueue.songs.length > 0 && this.client.quran_connections.has(message.guild.id) && !serverQueue.stoped) {
          serverQueue.songs.push(songToPlay);
          this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
          message.util.send({
            embed: qEmbed.setDescription(`**✅تم إضافة إلى قائمة الإنتظار \n \`${songToPlay.title}\`↪**`)
          });
        } else {
          serverQueue.songs = [];
          serverQueue.songs.push(songToPlay);
          this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
          message.util.send({
            embed: qEmbed.setDescription(`**🔊 تستمع الان إلى: \n \`${songToPlay.title}\`**`)
          });
          try {
            const connection = await channel.join();
            this.client.quran_connections.set(message.guild.id, connection);
            this.play(songToPlay, message);
          } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            this.client.guilds_settings.delete(message.guild.id, 'quran_queue');
            if (this.client.quran_connections.has(message.guild.id)) {
              let guildConnection = this.client.quran_connections.get(message.guild.id);
              if (guildConnection) {
                guildConnection.disconnect();
                this.client.quran_connections.delete(message.guild.id);
              }
              this.client.quran_connections.delete(message.guild.id);
            }
            return message.util.send(`**لم أستطع الانضمام إلى القناة الصوتية \n \`${error}\`**`);
          }
        }
      }
    });

    readerNumberCollector.on('end', (_, reason) => {
      if (reason == 'time') {
        return message.util.send(`**انتهى وقت اختيار القارىء❗**`);
      }
    })
  }
  /**
   * @param {String|Number} surahSelector 
   * @returns {Object|String}
   */
  async getSurah(surahSelector) {
    const surahs = require('../../quran-data/surahs.json');
    let surah;
    if (isNaN(surahSelector)) {
      if (surahSelector.endsWith("عمران") || surahSelector.startsWith("ال ")) surahSelector = "آل عمران";
      if (surahs.some((s) => s.name.arabic == surahSelector)) {
        surah = surahs.find((s) => s.name.arabic == surahSelector);
      } else surah = `**لم يتم إيجاد اسم السورة الذي أرسلته تأكد من الاسمم مجددا**`;
    } else {
      if (parseInt(surahSelector) > 114 || parseInt(surahSelector) < 1) {
        surah = `**ان عدد السور في القران الكريم 114 سورة يرجى ان يكون رقم السورة التي تريدها محصورة بهذا الرقم**`;
      } else {
        surah = surahs.find((s) => s.id == parseInt(surahSelector));
      }
    }
    return surah;
  }
  async play(song, message) {
    const queue = this.client.guilds_settings.get(message.guild.id, 'quran_queue', this.defaultGuildQueue);
    if (!song) {
      message.util.send(`**🚶‍♂️ Nothing is left in the queue.**`);
      this.client.guilds_settings.delete(message.guild.id, 'quran_queue');
      if (this.client.quran_connections.has(message.guild.id)) {
        let guildConnection = this.client.quran_connections.get(message.guild.id);
        if (guildConnection) {
          guildConnection.disconnect();
          this.client.quran_connections.delete(message.guild.id);
        }
        this.client.quran_connections.delete(message.guild.id);
      }
      return;
    }

    try {
      const dispatcher = this.client.quran_connections.get(message.guild.id).play(song.url)
        .on('finish', () => {
          let ikQueue = this.client.guilds_settings.get(message.guild.id, 'quran_queue');
          if (ikQueue) {
            if (!ikQueue.stoped) {
              if (ikQueue.repeat) {
                this.play(ikQueue.songs[0], message)
              } else {
                ikQueue.songs.shift();
                this.client.guilds_settings.set(message.guild.id, 'quran_queue', ikQueue);
                this.play(ikQueue.songs[0], message)
              }
            } else {
              ikQueue.songs = [];
              this.client.guilds_settings.set(message.guild.id, 'quran_queue', ikQueue);
              this.play(ikQueue.songs[0], message)
            }
          }
        })
        .on('error', error => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 50);
    } catch (error) {
      console.error(error);
    }
  };

}