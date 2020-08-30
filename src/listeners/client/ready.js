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
        name: "17 من القراء الذين تخشع لهم الآذان",
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
      await this.sleeep(20000);
    }
  }

  costumActivitys(acts) {
    let pick = require("pick-random");
    let time = Math.floor((Math.random() * (90 - 60 + 1) + 60) * 1000);
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

  async playQuranThatLost(song, guildId) {
    const queue = this.client.guilds_settings.get(guildId, "quran_queue");
    if (!song) {
      this.client.guilds_settings.delete(guildId, "quran_queue");
      this.client.quran_connections.get(guildId).disconnect();
      return;
    }

    const dispatcher = this.client.quran_connections
      .get(guildId)
      .play(song.url.replace("{number}", song.nowVerse))
      .on("finish", () => {
        if (this.client.guilds_settings.get(guildId, "quran_queue")) {
          if (song.nowVerse == song.endVerse) {
            if (queue.repeat) {
              queue.songs[0].nowVerse = queue.songs[0].startVerse;
              this.client.guilds_settings.set(guildId, "quran_queue", queue);
              this.playQuranThatLost(queue.songs[0], guildId);
            } else {
              queue.songs.shift();
              this.client.guilds_settings.set(guildId, "quran_queue", queue);
              this.playQuranThatLost(queue.songs[0], guildId);
            }
          } else {
            queue.songs[0].nowVerse++;
            this.client.guilds_settings.set(guildId, "quran_queue", queue);
            this.playQuranThatLost(queue.songs[0], guildId);
          }
        }
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.volume / 50);
  }

  async sleeep(time) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(1);
      }, time);
    });
  }
}

module.exports = MessageListener;
