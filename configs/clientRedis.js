const redis = require('redis');
const redisURL = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisURL);
client.on('connect', () => {
    console.log('Redis client connected')
});
client.on('error', (error) => {
    console.log('Redis not connected', error)
});

module.exports = client;