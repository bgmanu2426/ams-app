const env = {
    mongodb :{
        mongoDbUri : String(process.env.MONGODB_URI),
        dbName : String(process.env.DB_NAME),
    },
    secret :{
        nextAuthSecret : String(process.env.NEXTAUTH_SECRET),
    }
}

export default env;