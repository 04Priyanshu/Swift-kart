"use server";

import { kafka } from "../utils/kafka";

const producer = kafka.producer();

export  async function sendKafkaEvent(eventData :{
    userId?:string;
    productId?:string;
    shopId?:string;
    action:string;
    device?:string;
    country?:string;
    city?:string;
}){
try {
    await producer.connect();

    console.log("Sending kafka event:",eventData);
    await producer.send({
        topic:"user-events",
        messages:[{value:JSON.stringify(eventData)}]
    })
    console.log("Kafka event sent successfully");
} catch (error) {
    console.error("Error sending kafka event:",error);

}finally{
    await producer.disconnect();
}
}