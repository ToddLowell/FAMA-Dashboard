// Code inspired by https://github.com/nuxt-community/express-template
import express from 'express';

// Require API routes
import auth from './routes/auth';
import { protect } from './controllers/auth';
import data from './routes/data';
import admin from './routes/admin';

// Create express instance
const app = express();
app.use(express.json());

// Test API
app.get('/hello', (_req, res) => {
  res.json({ message: 'Hello!' });
});

// Import API Routes
app.use('/auth', auth);
app.use('/data', protect, data);
app.use('/admin', admin);

// Export express app
export default app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}
