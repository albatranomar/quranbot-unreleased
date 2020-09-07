const { Listener } = require("discord-akairo");

class MessageListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
      category: "client",
    });
  }

  async exec() {
    // Satrts
    console.log(`WOW We Are Ready To Go!!`);
    console.log(`Logged in {${this.client.user.tag}}`);
    // Activitys
    let activitys = [
      {
        name: "{prefix}inv -> Add Bot to your server.",
        status: "online",
        type: "PLAYING",
      },
      {
        name: "{prefix}help -> Support server & our website.",
        status: "dnd",
        type: "WATCHING",
      },
      {
        name: "{prefix}help -> لسيرفر الدعم و الموقع الخاص بنا.",
        status: "dnd",
        type: "WATCHING",
      },
      {
        name: "{prefix}inv -> لإضافة البوت الى سيرفر.",
        status: "idle",
        type: "PLAYING",
      },
      {
        name: "بوت القران الكريم 💕",
        status: "dnd",
        type: "PLAYING",
      },
      {
        name: "سرعة , دعم فني, جودة 🛡️",
        status: "dnd",
        type: "WATCHING",
      },
      {
        name: "ما يزيد عن 100 قارء تخشع لهم الآذان",
        status: "idle",
        type: "LISTENING",
      },
    ];
    this.costumActivitys(activitys);
    // Quran Reconnect With all Lost connictions.
    let connections = this.client.guilds_settings.items
      .filter((d, k) => "quran_queue" in d)
      .map((d, k) => [k, d["quran_queue"]]);
    for (const lostedConnection of connections) {
      let cc = this.client.channels.cache.get(
        lostedConnection[1].voiceChannelID
      );
      if (cc) {
        let conniction = await cc.join();
        this.client.quran_connections.set(lostedConnection[0], conniction);
        this.playQuranThatLost(
          lostedConnection[1].songs[0],
          lostedConnection[0]
        );
      }
      await this.sleeep(80000);
    }
  }

  costumActivitys(acts) {
    let pick = require("pick-random");
    let time = Math.floor((Math.random() * (140 - 90 + 1) + 90) * 1000);
    let act = pick(acts, { count: 1 })[0];
    this.client.user
      .setPresence({
        activity: {
          name: act.name.replace(/{prefix}/g, this.client.config.prefix),
          type: act.type,
        },
        status: act.status,
      })
      .then((presence) => {
        setTimeout(() => {
          this.costumActivitys(acts);
        }, time);
      })
      .catch(console.log);
  }

  async playQuranThatLost(song, guildID) {
    const queue = this.client.guilds_settings.get(guildID, 'quran_queue');
    if (!song) {
      this.client.guilds_settings.delete(guildID, 'quran_queue');
      if (this.client.quran_connections.has(guildID)) {
        let guildConnection = this.client.quran_connections.get(guildID);
        if (guildConnection) {
          guildConnection.disconnect();
          this.client.quran_connections.delete(guildID);
        }
        this.client.quran_connections.delete(guildID);
      }
      return;
    }

    const dispatcher = this.client.quran_connections.get(guildID).play((song.type == "ALL") ? song.url.replace(`{number}`, (`${song.surahIndex}`.padStart(3, '0') + '.mp3')) : song.url)
      .on('finish', () => {
        if (this.client.guilds_settings.get(guildID, 'quran_queue')) {
          if (song.type == "ALL") {
            if (queue.repeat && song.surahIndex == 114) {
              queue.songs[0].surahIndex = 1;
              this.client.guilds_settings.set(guildID, 'quran_queue', queue);
              this.playQuranThatLost(queue.songs[0], guildID);
            } else if (!queue.repeat && song.surahIndex == 114) {
              queue.songs.shift();
              this.client.guilds_settings.set(guildID, 'quran_queue', queue);
              this.playQuranThatLost(queue.songs[0], guildID);
            } else {
              queue.songs[0].surahIndex++;
              this.client.guilds_settings.set(guildID, 'quran_queue', queue);
              this.playQuranThatLost(queue.songs[0], guildID);
            }
          } else {
            if (queue.repeat) {
              this.playQuranThatLost(queue.songs[0], guildID);
            } else {
              queue.songs.shift();
              this.client.guilds_settings.set(guildID, 'quran_queue', queue);
              this.playQuranThatLost(queue.songs[0], guildID);
            }
          }
        }
      })
      .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.volume / 50);
  };

  async sleeep(time) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(1);
      }, time);
    });
  }
}

module.exports = MessageListener;
