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
        // Satrts
        console.log(`WOW We Are Ready To Go!!`);
        console.log(`Logged in {${this.client.user.tag}}`);
        // Activitys
        let activitys = [
            {
                name: "{prefix}inv -> Add Bot to your server.",
                status: "online",
                type: "PLAYING"
            }, {
                name: "{prefix}help -> Support server & our website.",
                status: "dnd",
                type: "WATCHING"
            }, {
                name: "{prefix}help -> لسيرفر الدعم و الموقع الخاص بنا.",
                status: "dnd",
                type: "WATCHING"
            }, {
                name: "{prefix}inv -> لإضافة البوت الى سيرفر.",
                status: "idle",
                type: "PLAYING"
            }, {
                name: "بوت القران الكريم 💕",
                status: "dnd",
                type: "PLAYING"
            }, {
                name: "سرعة , دعم فني, جودة 🛡️",
                status: "dnd",
                type: "WATCHING"
            }, {
                name: "17 من القراء الذين تخشع لهم الآذان",
                status: "idle",
                type: "LISTENING"
            }
        ];
        this.costumActivitys(activitys);
    }

    costumActivitys(acts) {
        let pick = require("pick-random");
        let time = Math.floor(((Math.random() * (90 - 60 + 1)) + 60) * 1000);
        let act = pick(acts, { count: 1 })[0];
        this.client.user.setPresence({
            activity: {
                name: act.name.replace(/{prefix}/g, this.client.config.prefix),
                type: act.type
            },
            status: act.status
        }).then((presence) => {
            setTimeout(() => {
                this.costumActivitys(acts);
            }, time);
        }).catch(console.log);
    }

}

module.exports = MessageListener;