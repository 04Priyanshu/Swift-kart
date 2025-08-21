import Redis from "ioredis";

// const redis = new Redis({
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: parseInt(process.env.REDIS_PORT || "6379"),
//     password: process.env.REDIS_PASSWORD || "",
// });

const redis = new Redis("rediss://default:ATqMAAIncDFiZTdiZGY5NTY1YTM0NzEwODBiZGE3MjdkNGZhNzNmZnAxMTQ5ODg@merry-doe-14988.upstash.io:6379");

export default redis;