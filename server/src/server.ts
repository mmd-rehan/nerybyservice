import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 3030;

// Connect to Database and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
