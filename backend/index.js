import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectToMongoDb from './DB/connectToMongoDb.js';
import ChatRoute from './routes/chat.Routes.js';
import AuthRoute from './routes/auth.Routes.js';
import MessageRoute from './routes/message.Routes.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000
app.listen(PORT,()=> {
connectToMongoDb();
console.log(`Server is running on port ${PORT}`);
}
)


 app.use('/auth',AuthRoute)
 app.use('/chat',ChatRoute)
 app.use('/message',MessageRoute)