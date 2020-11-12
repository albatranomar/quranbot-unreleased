const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', { totalShards: 5 });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();