import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import serviceRoutes from './routes/serviceRoutes';
import locationRoutes from './routes/locationRoutes';
import categoryRoutes from './routes/categoryRoutes';
import contactRoutes from './routes/contactRoutes';
import reportRoutes from './routes/reportRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api', serviceRoutes);
app.use('/api', locationRoutes);
app.use('/api', categoryRoutes);
app.use('/api', contactRoutes);
app.use('/api', reportRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;
