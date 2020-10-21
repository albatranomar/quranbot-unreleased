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
    this.client.user
      .setPresence({
        activity: {
          name: "بوت القران الكريم 💕",
          type: "PLAYING",
        },
        status: "dnd",
      })

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
