const { Message, MessageEmbed } = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class extends Command {
  constructor() {
    super("help", {
      aliases: ["help", "hlp", "h", "commands", "cmds", "مساعدة", "المساعدة"],
      category: "public",
      cooldown: 10000,
      ratelimit: 2,
      args: [
        {
          id: 'hcommand',
          type: 'commandAlias',
          default: 'all'
        }
      ],
      description: {
        content: `Help command shows all commands or info about one.`,
        usage: `help <command name>`,
        examples: [
          `help`,
          `help ping`,
          `help play`
        ]
      }
    });
  }
  /**
   * @param {Message} message
   * @param {Object} args
   * @param {Command} [args.hcommand]
   */
  exec(message, { hcommand }) {
    let prefix = this.client.config.prefix;
    let HelpEmbedDefult = new MessageEmbed()
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor("RANDOM")
      .setThumbnail(this.client.user.displayAvatarURL())


    if (hcommand == 'all') {
      HelpEmbedDefult.setTitle(`Commands list.`);
      HelpEmbedDefult.setDescription(`for more information about commands. \n usage: \`${prefix}help <command name>\``);
      this.handler.categories
        .filter(category => {
          if (this.client.isOwner(message.author.id) && category.id == 'developers') {
            return true;
          } else if (!this.client.isOwner(message.author.id) && category.id == 'developers') {
            return false;
          } else return true;
        })
        .forEach((category, key) => {
          HelpEmbedDefult.addField(`${category.id.charAt(0).toUpperCase() + category.id.slice(1)}`,
            category.map((command) => `\`${command.id}\``).join(','))
        });
    } else {

      HelpEmbedDefult
      .setTitle(`Commands information [${hcommand.id}].`)
      .setDescription(`**${(hcommand.description.content ? hcommand.description.content : hcommand.description)}**`);
      if (hcommand.description.usage) {
        HelpEmbedDefult.addField(`Usage: `, hcommand.description.usage);
      }
      if (hcommand.description.examples) {
        HelpEmbedDefult.addField(`Examples: `, hcommand.description.examples.join('\n'));
      }
    }

    message.author.send(HelpEmbedDefult).then(async (dmMessage) => (message.channel.type != 'dm') ? await message.react("✅") : null).catch(async (e) => {
      console.log(`${e}`);
      await message.react("❌");
    });
  }
};