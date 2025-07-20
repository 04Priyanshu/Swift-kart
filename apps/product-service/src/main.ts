import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@packages/error-handler/error-middleware.js';
import cookieParser from 'cookie-parser';
import router from './routes/product.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';

const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
}));


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

 app.use("/api-docs" , swaggerUi.serve , swaggerUi.setup(swaggerDocument));
 app.get("/docs-json" , (req , res) => {
    res.json(swaggerDocument);
 });
//routes
app.use("/api" , router);
app.use(errorMiddleware);

const port = process.env.PORT || 6002;
const server = app.listen(port, () => {
    console.log(`[ ready ] http://localhost:${port}`);
     console.log(`[ ready ] http://localhost:${port}/api-docs`);
});

server.on('error', (error) => {
    console.error("Error starting product service", error);
    process.exit(1);
});