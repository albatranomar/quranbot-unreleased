let { MessageEmbed, Message } = require("discord.js");
const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

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
      ]
    });
  }
  /**
  * 
  * @param {Message} message 
  * @param {*} args 
  */
  async exec(message, { toplay }) {
    const { channel } = message.member.voice;
    if (!channel) return `** أنا آسف ولكن يجب أن تكون في قناة صوتية لتشغيل القران الكريم! **`;
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return '**I cannot connect to your voice channel, make sure I have the proper permissions!**';
    if (!permissions.has('SPEAK')) return '**I cannot speak in this voice channel, make sure I have the proper permissions!**';
    let askForreaderMessage = await message.util.send({
      embed: new MessageEmbed().setColor("RANDOM").setDescription(`**أرسل اسم القراء الأول أو اسمه الأخير للبحث عنه.**`).setFooter(this.client.user.username, this.client.user.displayAvatarURL())
    });
    let readerCollector = await askForreaderMessage.channel.createMessageCollector((m) => m.author.id == message.author.id, { max: 1, time: 50000 });
    readerCollector.on("collect", async (answerForReader) => {
      let readers = require("../../quran-json/readers.json");
      let listOfreaders = readers.filter(r => r.arabic_name && r.arabic_name.includes(answerForReader.content));
      if (listOfreaders && listOfreaders.length > 0) {
        let askForReaderNumberMessage = await message.util.send(``, {
          embed: new MessageEmbed().setTitle(`أرسل رقم القارء الذي تريده`)
            .setDescription(`\`\`\`\n${listOfreaders.slice(0, 10).map(r => `${r.id}- ${r.arabic_name}`).join("\n")}\`\`\``)
        });
        if (answerForReader.deletable) answerForReader.delete();
        let readerNumberCollector = await askForReaderNumberMessage.channel.createMessageCollector((m) => m.author.id == message.author.id && listOfreaders.map(r => r.id).includes(parseInt(m.content)), { max: 1, time: 50000 });
        readerNumberCollector.on('collect', async (answerForReaderNumber) => {
          let theReader = listOfreaders.find(r => r.id == parseInt(answerForReaderNumber.content));
          let audio_files = require("../../quran-json/audiofiles.json");
          if (answerForReaderNumber.deletable) answerForReaderNumber.delete();
          let serverQueue = this.client.guilds_settings.get(message.guild.id, 'quran_queue', {
            songs: [],
            volume: 20,
            playing: true,
            repeat: false,
            voiceChannelID: channel.id
          });
          if (serverQueue) {
            if (serverQueue.songs.length >= 5) return message.util.send(`**${message.author}, لا يمكن إضافة اكثر من 5 مقاطع الى قائمة الانتظار**`);
            let songToPlay = {};
            if (toplay == "ALL") {
              songToPlay = {
                title: `القران الكريم كاملا بصوت القارئ ${theReader.arabic_name}.`,
                url: `https://download.quranicaudio.com/quran/${theReader.relative_path}{number}`,
                type: "ALL",
                surahIndex: 1
              }
            } else {
              let files = audio_files.filter(file => file.surah_id == toplay.id && file.qari_id == theReader.id);
              if (files && files.length > 0) {
                let file = files[0];
                let fileMp3 = `https://download.quranicaudio.com/quran/${file.qari.relative_path}${file.file_name}`;
                songToPlay = {
                  title: `القران الكريم. سورة ${toplay.name.arabic} بصوت القارئ ${theReader.arabic_name}`,
                  url: fileMp3,
                  type: "Alone",
                }
              } else {
                return message.util.send(`**لم يتم إيجاد أي ملف ل \`${toplay.name.arabic}\` في ملفات القارئ \`${theReader.arabic_name}\` :(**`);
              }
            }
            let qEmbed = new MessageEmbed()
              .setColor("RANDOM")
              .setFooter(`بواسطة: ${message.author.tag}`, message.author.displayAvatarURL())
              .setThumbnail(`https://cdn.discordapp.com/attachments/702827650733047828/751848553168764948/PicsArt_09-05-07.png`);
            if (toplay != "ALL") {
              qEmbed.addField('معلومات', `عدد الأيات : ${toplay.ayat} \nمن الصفحة ${toplay.page[0]} الى الصفحة ${toplay.page[1]}\nسورة ${(toplay.revelation.place == 'makkah') ? 'مكية' : 'مدنية'}\nترتيب النزول: ${toplay.revelation.order}`);
            }
            if (serverQueue.songs.length > 0) {
              serverQueue.songs.push(songToPlay);
              this.client.guilds_settings.set(message.guild.id, 'quran_queue', serverQueue);
              message.util.send({
                embed: qEmbed.setDescription(`**✅ تم إضافة إلى قائمة الإنتظار \n \`${songToPlay.title}\`**`)
              });
            } else {
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
                this.client.quran_connections.get(message.guild.id).disconnect();
                this.client.quran_connections.delete(message.guild.id);
                return message.util.send(`**لم أستطع الانضمام إلى القناة الصوتية \n \`${error}\`**`);
              }
            }
          }
        });
        readerNumberCollector.on('end', (_, reason) => {
          if (reason == 'time') {
            return message.util.send(`** إنتهى وقت الإختيار رقم القارء :(**`);
          }
        });
      } else {
        await message.util.send(``, {
          embed: new MessageEmbed()
            .setDescription(`**لم يتم إيجاد قارئ يحتوي في اسمه على: ${answerForReader.content}**`)
        });
        if (answerForReader.deletable) answerForReader.delete();
        return;
      }
    });
    readerCollector.on("end", (_, reason) => {
      if (reason == 'time') {
        return message.util.send(`**إنتهى وقت المخصص لإرسال الاسم :(**`);
      }
    })
  }
  /**
   * @param {String|Number} surahSelector 
   * @returns {Object|String}
   */
  async getSurah(surahSelector) {
    const surahsData = await fetch(`https://quranicaudio.com/api/surahs`);
    const surahs = await surahsData.json();
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
    const queue = this.client.guilds_settings.get(message.guild.id, 'quran_queue');
    if (!song) {
      message.util.send(`** 🚶‍♂️لم يعد هناك أي شيء في قائمة الإنتظار..**`);
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

    const dispatcher = this.client.quran_connections.get(message.guild.id).play((song.type == "ALL") ? song.url.replace(`{number}`, (`${song.surahIndex}`.padStart(3, '0') + '.mp3')) : song.url)
      .on('finish', () => {
        if (this.client.guilds_settings.get(message.guild.id, 'quran_queue')) {
          if (song.type == "ALL") {
            if (queue.repeat && song.surahIndex == 114) {
              queue.songs[0].surahIndex = 1;
              this.client.guilds_settings.set(message.guild.id, 'quran_queue', queue);
              this.play(queue.songs[0], message);
            } else if (!queue.repeat && song.surahIndex == 114) {
              queue.songs.shift();
              this.client.guilds_settings.set(message.guild.id, 'quran_queue', queue);
              this.play(queue.songs[0], message);
            } else {
              queue.songs[0].surahIndex++;
              this.client.guilds_settings.set(message.guild.id, 'quran_queue', queue);
              this.play(queue.songs[0], message);
            }
          } else {
            if (queue.repeat) {
              this.play(queue.songs[0], message);
            } else {
              queue.songs.shift();
              this.client.guilds_settings.set(message.guild.id, 'quran_queue', queue);
              this.play(queue.songs[0], message);
            }
          }
        }
      })
      .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.volume / 50);
  };

}