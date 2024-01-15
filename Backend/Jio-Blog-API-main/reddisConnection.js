
const connectToRedis = async ()=>{
    await createClient().on('error', err => console.log('Redis Client Error', err))
    .connect();
}

module.exports = connectToRedis;


