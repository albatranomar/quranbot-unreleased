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
    this.config = config;
    this.commandHandler = new CommandHandler(this, {
      directory: `${__dirname}/commands/`,
      ignoreCooldownID: this.ownerID,
      ignorePermissions: this.ownerID,
      aliasReplacement: /-/g,
      prefix: (message) => {
        if (message.channel.type != "dm" && this.guilds_settings.get(message.guild.id, 'prefix')) {
          return [`q${config.prefix}`, this.guilds_settings.get(message.guild.id, 'prefix')]
        }
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
          start: '**لقد نسيت إرسال عنصر مطلوب. يمكنك ارساله الان**',
          modifyStart: (msg, text) => `${msg.author}, ${text}\nأرسل \`cancel\` لإلغاء هذا الأمر بالكامل.`,
          retry: '**ليس العنصر المطلوب حاول مره اخرى**',
          modifyRetry: (msg, text) => `${msg.author}, ${text}\nأرسل \`cancel\` لإلغاء هذا الأمر بالكامل.`,
          timeout: '**إنتهى الوقت المخصص للإجابة**',
          ended: '**لا مزيد من المحاولات**',
          cancel: '**تم إلغاء الأمر**',
          retries: 3
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
    this.quran_connections = new Map();
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