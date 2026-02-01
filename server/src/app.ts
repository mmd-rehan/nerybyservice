import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import serviceRoutes from './routes/serviceRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api', serviceRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;
