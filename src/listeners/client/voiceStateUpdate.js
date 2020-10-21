const { Listener } = require("discord-akairo");

module.exports = class extends Listener {
  constructor() {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate',
      category: 'client'
    });
  }

  async exec(vs0, vs1) {
    let serverQueue = this.client.guilds_settings.get(vs0.guild.id, 'quran_queue');
    let connection = this.client.quran_connections.get(vs0.guild.id);
    if (!serverQueue) return this.client.guilds_settings.delete(vs0.guild.id, 'quran_queue');
    if (!connection || !connection.voice) {
      if (connection.dispatcher) {
        connection.dispatcher.end('Stop command has been used!');
      }
      connection.disconnect();
    };
    let quranchannel = this.client.channels.cache.get(connection.voice.channelID);
    if (!quranchannel) {
      if (connection.dispatcher) {
        connection.dispatcher.end('Stop command has been used!');
      }
      connection.disconnect();
      this.client.guilds_settings.delete(vs0.guild.id, 'quran_queue');
      return;
    };
    let oldUserChannel = vs0.channel;
    let newUserChannel = vs1.channel;
    if (vs1.member.id == this.client.user.id) {
      if (oldUserChannel !== null && newUserChannel === null) {
        if (connection) {
          if (connection.dispatcher) {
            connection.dispatcher.end('Stop command has been used!');
          }
          connection.disconnect();
        }
        this.client.guilds_settings.delete(vs0.guild.id, 'quran_queue');
        return;
      } else if (oldUserChannel !== null && newUserChannel !== null) {
        if ((oldUserChannel.id == quranchannel.id) && (newUserChannel.id != quranchannel.id)) {
          newUserChannel.leave();
          if (connection) {
            if (connection.dispatcher) {
              connection.dispatcher.end('Stop command has been used!');
            }
            connection.disconnect();
          }
          this.client.guilds_settings.delete(vs0.guild.id, 'quran_queue');
        };
      }
      return;
    };
    if (oldUserChannel === null && newUserChannel !== null) {
      // User Joins a voice channel
      if (newUserChannel.id == quranchannel.id) {
        if (serverQueue.playing) {
          null
        } else {
          if (quranchannel.members.size == 2) {
            serverQueue.playing = true;
            this.client.guilds_settings.set(vs0.guild.id, 'quran_queue', serverQueue);
            if (connection) {
              if (connection.dispatcher) {
                connection.dispatcher.resume();
              }
            }
            console.log(`resumed[${vs0.guild.name}]`);
          }
        }
      }
    } else if (oldUserChannel !== null && newUserChannel === null) {
      // User leaves a voice channel
      if (oldUserChannel.id == quranchannel.id) {
        if (quranchannel.members.size == 1) {
          serverQueue.playing = false;
          this.client.guilds_settings.set(vs0.guild.id, 'quran_queue', serverQueue);
          if (connection) {
            if (connection.dispatcher) {
              connection.dispatcher.pause();
            }
          }
          console.log(`paused[${vs0.guild.name}]`);
        }
      }
    } else if (oldUserChannel !== null && newUserChannel !== null) {
      if ((oldUserChannel.id == quranchannel.id) && (newUserChannel.id != quranchannel.id)) {
        if (quranchannel.members.size == 1) {
          serverQueue.playing = false;
          this.client.guilds_settings.set(vs0.guild.id, 'quran_queue', serverQueue);
          if (connection) {
            if (connection.dispatcher) {
              connection.dispatcher.pause();
            }
          }
          console.log(`paused[${vs0.guild.name}]`);
        }
      } else if ((oldUserChannel.id != quranchannel.id) && (newUserChannel.id == quranchannel.id)) {
        if (serverQueue.playing) {
          null
        } else {
          if (quranchannel.members.size == 2) {
            serverQueue.playing = true;
            this.client.guilds_settings.set(vs0.guild.id, 'quran_queue', serverQueue);
            if (connection) {
              if (connection.dispatcher) {
                connection.dispatcher.resume();
              }
            }
            console.log(`resumed[${vs0.guild.name}]`);
          }
        }
      }
    }
  }
}