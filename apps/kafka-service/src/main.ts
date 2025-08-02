import { kafka } from "@packages/utils/kafka";
import { updateUserAnalytics } from "./services/analytics.service";

console.log("Initializing kafka consumer...");
const consumer = kafka.consumer({ 
  groupId: "user-events-consumer-group-v2",
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const eventQueue : any[] = [];

const processQueue = async () => {
  if(eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;

  for(const event of events){
   if(event.action === "shop_visit"){
    //update the shop analytics
   }


   const validActions = ["add_to_cart", "add_to_wishlist","product_view", "remove_from_wishlist","remove_from_cart","purchase"];
   if(!event.action || !validActions.includes(event.action)) continue;

   try {
    await updateUserAnalytics(event);
   } catch (error) {
    console.log("Error updating user analytics:", error);
   }

  }
}

setInterval(processQueue, 3000);


//kafka consumer

export const consumeKafkaMessages = async () => {
  try {
    //connect to kafka
    console.log("Attempting to connect to Kafka...");
    await consumer.connect();
    console.log("Successfully connected to Kafka");
    
    console.log("Subscribing to user-events topic...");
    await consumer.subscribe({ topic: "user-events", fromBeginning: false });
    console.log("Successfully subscribed to user-events topic");

    console.log("Starting consumer...");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(`Received message from topic: ${topic}, partition: ${partition}`);
          if(!message.value) {
            console.log("Message has no value, skipping");
            return;
          }

          const event = JSON.parse(message.value.toString());
          eventQueue.push(event);
          console.log("Received event:", event);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
      eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
        try {
          console.log(`Processing batch with ${batch.messages.length} messages`);
          for (const message of batch.messages) {
            if (!isRunning() || isStale()) break;
            
            if(!message.value) continue;
            
            const event = JSON.parse(message.value.toString());
            eventQueue.push(event);
            console.log("Received event from batch:", event);
            
            resolveOffset(message.offset);
          }
          await heartbeat();
        } catch (error) {
          console.error("Error processing batch:", error);
        }
      }
    });
    console.log("Consumer is now running and listening for messages");
  } catch (error) {
    console.error("Error in consumeKafkaMessages:", error);
    throw error;
  }
}

consumeKafkaMessages().catch(console.error);