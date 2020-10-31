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
    console.log(`Logged in {${this.client.user.tag}}`);
    console.log(`Servers [${this.client.guilds.cache.size}] Users [${this.client.users.cache.size}]`);
    console.log(`------------------------------------------`);
    this.client.user
      .setPresence({
        activity: {
          name: "-help || بوت القران الكريم 💕",
          type: "PLAYING",
        },
        status: "dnd",
      })

    // Quran Reconnect With all Lost connictions.
    let connections = this.client.guilds_settings.items
      .filter((d, k) => "quran_queue" in d)
      .map((d, k) => [k, d["quran_queue"]]);
    for (const lostedConnection of connections) {
      if (this.client.channels.cache.has(lostedConnection[1].voiceChannelID)) {
        let cc = this.client.channels.cache.get(
          lostedConnection[1].voiceChannelID
        );
        if (cc) {
          let conniction = await cc.join();
          this.client.quran_connections.set(lostedConnection[0], conniction);
          this.playQuranThatLost(
            lostedConnection[0]
          );
        }
        await this.sleeep(80000);
      }
    }
  }

  async playQuranThatLost(guildID) {
    const queue = this.client.guilds_settings.get(guildID, 'quran_queue');
    if (!queue || !queue.songs[0]) {
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
    let song = queue.songs[0];
    const dispatcher = this.client.quran_connections.get(guildID).play(song.url)
      .on('finish', () => {
        if (this.client.guilds_settings.get(guildID, 'quran_queue')) {
          if (queue.repeat) {
            this.playQuranThatLost(guildID);
          } else {
            queue.songs.shift();
            this.client.guilds_settings.set(guildID, 'quran_queue', queue);
            this.playQuranThatLost(guildID);
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
