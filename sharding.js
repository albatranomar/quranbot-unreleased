const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', { totalShards: 2 });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();