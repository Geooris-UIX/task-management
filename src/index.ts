import express, {Express, Request, Response} from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRoutes from './modules/auth/routes'
import taskRoutes from './modules/tasks/routes'
import cron from "node-cron"
import { taskReminder } from './schedulers/taskReminder'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors({
    credentials: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

connectDB();

cron.schedule("* * * * *", taskReminder)

app.get('/', (req: Request, res: Response) => {
    res.send('Task Management Backend')
})
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
    console.log(`[Server]: Server is running at http://localhost:${port}`)
})