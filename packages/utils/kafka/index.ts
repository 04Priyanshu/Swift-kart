import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["pkc-l7pr2.ap-south-1.aws.confluent.cloud:9092"],
    ssl: true,
    sasl: {
        mechanism: "PLAIN",
        username: process.env.KAFKA_API_KEY!,
        password: process.env.KAFKA_API_SECRET! ,
    } as any,
});
