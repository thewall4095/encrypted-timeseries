const redis = require("redis");

const client = redis.createClient({
    port: 6379,
});

client.on("error", (error) => console.error(error));

const redisOperationService = () => {

    const save = async (data) => {
        
    };

    const retrieve = async (data) => {
    
    };

    return {
        save,
        retrieve
    };
}

module.exports = redisOperationService;