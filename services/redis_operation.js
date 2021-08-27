const redis = require("redis");

const client = redis.createClient({
    // host: 'redis-server', //for docker
    port: 6379,
});

client.on("error", (error) => console.error(error));

const redisOperationService = () => {

    const save = async (key, value) => {
        try{
            let alreadyExistingData = await retrieve(key);
            if(alreadyExistingData){
                alreadyExistingData = JSON.parse(alreadyExistingData);
                value['data'] = [...value['data'], ...alreadyExistingData.data];
                const data = await client.setex(key, 120, JSON.stringify(value));
                return data;
            }else{
                const data = await client.setex(key, 120, JSON.stringify(value));
                return data;
            }
        }catch(err){
            console.log(err);
        }
    };

    const retrieve = async (key) => {
        let retrievePromise = new Promise((resolve, reject) => {
            client.get(key, async (err, data) => {
                if(err)
                    return reject(err);
                else{
                    return resolve(data);
                }
            });
        });
        const data = await retrievePromise;
        return data;
    };

    const getRedisKeys = async () =>{
        let getRedisKeyPromise = new Promise((resolve, reject) => {
            client.keys('*', async (err, data) => {
                if(err)
                    return reject(err);
                else{
                    return resolve(data);
                }
            });
        });
        const data = await getRedisKeyPromise;
        return data;
    }

    const deleteWithKey = async (key) =>{
        let deleteWithKeyPromise = new Promise((resolve, reject) => {
            client.del(key, async (err, data) => {
                if(err)
                    return reject(err);
                else{
                    return resolve(data);
                }
            });
        });
        const data = await deleteWithKeyPromise;
        return data;
    }

    return {
        save,
        retrieve,
        getRedisKeys,
        deleteWithKey
    };
}

module.exports = redisOperationService;