const { Listener } = require("discord-akairo");

class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        });
    }

    exec() {
      console.log(`WOW We Are Ready To Go!!`);
      console.log(`Logged in {${this.client.user.tag}}`);
    }
}

module.exports = MessageListener;