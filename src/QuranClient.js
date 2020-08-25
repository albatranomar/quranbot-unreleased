const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, SQLiteProvider } = require('discord-akairo');
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

module.exports = class extends AkairoClient {
  /**
   * 
   * @param {Object} config 
   */
  constructor(config) {
    super({
      ownerID: config.owners,
    }, {
      disableMentions: 'everyone'
    });
    this.commandHandler = new CommandHandler(this, {
      directory: `${__dirname}/commands/`,
      ignoreCooldownID: this.ownerID,
      aliasReplacement: /-/g,
      prefix: (message) => {
        return [config.prefix];
      },
      allowMention: true,
      commandUtil: true,
      commandUtilLifetime: 10000,
      commandUtilSweepInterval: 10000,
      storeMessages: true,
      handleEdits: true,
      argumentDefaults: {
        prompt: {
          start: 'What is thing?',
          modifyStart: (msg, text) => `${msg.author}, ${text}\nType \`cancel\` to cancel this command.`,
          retry: 'What is thing, again?',
          modifyRetry: (msg, text) => `${msg.author}, ${text}\nType \`cancel\` to cancel this command.`,
          timeout: 'Out of time.',
          ended: 'No more tries.',
          cancel: 'Cancelled.',
          retries: 5
        },
        modifyOtherwise: (msg, text) => `${msg.author}, ${text}`
      }
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: `${__dirname}/inhibitors/`
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: `${__dirname}/listeners/`
    });

    const db = sqlite.open({ filename: `${__dirname}/databases/db.sqlite`, driver: sqlite3.Database })
      .then(d => d.run('CREATE TABLE IF NOT EXISTS guilds (id TEXT NOT NULL UNIQUE, settings TEXT)').then(() => d));
    this.guilds_settings = new SQLiteProvider(db, 'guilds', { dataColumn: 'settings' });

    this.setup();
  }

  setup() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler
    });

    this.commandHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  async start(token) {
    await this.guilds_settings.init();
    await this.login(token);
  }
}