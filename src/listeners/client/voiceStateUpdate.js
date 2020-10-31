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
    let guildID = vs0.guild.id;
    let serverQueue = this.client.guilds_settings.get(guildID, 'quran_queue');
    if (serverQueue) {
      let connection = this.client.quran_connections.get(guildID);
      if (connection) {
        if (connection.voice) {
          let quranChannel = this.client.channels.cache.get(connection.voice.channelID);
          if (quranChannel) {
            let oldUserChannel = vs0.channel;
            let newUserChannel = vs1.channel;
            if (vs1.member.id == this.client.user.id) { // If the new member is the client user.
              if (oldUserChannel !== null && newUserChannel === null) { // chack if client user leave th channel.
                this.deleteQueue(guildID);
                this.deleteConnection(guildID);
                return;
              } else if (oldUserChannel !== null && newUserChannel !== null) { // chack if client user switch channel.
                if ((oldUserChannel.id == quranChannel.id) && (newUserChannel.id != quranChannel.id)) { // check if client user switch to channel that isnot the quran channel.
                  newUserChannel.leave();
                  this.deleteQueue(guildID);
                  this.deleteConnection(guildID);
                };
              }
              return;
            } else { // if it not the client user.
              if (oldUserChannel === null && newUserChannel !== null) { // check if user join to the voice channel.
                if (newUserChannel.id == quranChannel.id) { // check if joined channel is the same as quran channel.
                  if (serverQueue.playing) { //check if theres any thing plays in the channel.
                    null // do nothing.
                  } else { // if its not.
                    if (quranChannel.members.size == 2) { // check if theres 2 members in the channel.
                      serverQueue.playing = true;
                      this.client.guilds_settings.set(guildID, 'quran_queue', serverQueue);
                      if (connection) {
                        if (connection.dispatcher) {
                          connection.dispatcher.resume();
                        }
                      }
                      console.log(`resumed[${vs0.guild.name}]`);
                    }
                  }
                }
              } else if (oldUserChannel !== null && newUserChannel === null) { // check if user left the voice channel.
                if (oldUserChannel.id == quranChannel.id) { // check if joined channel is the same as quran channel.
                  if (quranChannel.members.size == 1) { // check if after the member left is the client user alone?
                    serverQueue.playing = false;
                    this.client.guilds_settings.set(guildID, 'quran_queue', serverQueue);
                    if (connection) {
                      if (connection.dispatcher) {
                        connection.dispatcher.pause();
                      }
                    }
                    console.log(`paused[${vs0.guild.name}]`);
                  }
                }
              } else if (oldUserChannel !== null && newUserChannel !== null) { // check if user switch the channels.
                if ((oldUserChannel.id == quranChannel.id) && (newUserChannel.id != quranChannel.id)) { // check if the user left quran channel and went to another channel.
                  if (quranChannel.members.size == 1) { // check if after the member left is the client user alone?
                    serverQueue.playing = false;
                    this.client.guilds_settings.set(guildID, 'quran_queue', serverQueue);
                    if (connection) {
                      if (connection.dispatcher) {
                        connection.dispatcher.pause();
                      }
                    }
                    console.log(`paused[${vs0.guild.name}]`);
                  }
                } else if ((oldUserChannel.id != quranChannel.id) && (newUserChannel.id == quranChannel.id)) { // check if the user join quran channel and come from another channel
                  if (serverQueue.playing) { //check if theres any thing plays in the channel.
                    null // do nothing.
                  } else { // if its not.
                    if (quranChannel.members.size == 2) { // check if theres 2 members in the channel.
                      serverQueue.playing = true;
                      this.client.guilds_settings.set(guildID, 'quran_queue', serverQueue);
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
          } else this.deleteConnection(guildID);
        } else this.deleteConnection(guildID);
      } else this.deleteConnection(guildID);
    } else this.deleteQueue(guildID);
  }

  async deleteQueue(gid) {
    await this.client.guilds_settings.delete(gid, 'quran_queue');
    return 1;
  }
  async deleteConnection(gid) {
    let connection = this.client.quran_connections.get(gid);
    if (connection) {
      if (connection.dispatcher) {
        connection.dispatcher.end('Stop command has been used!');
      }
      connection.disconnect();
    } else this.client.quran_connections.delete(gid);
    return 1;
  }

}