import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import reputationRoutes from './routes/reputation';
import { swaggerSpec } from './docs/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reputation', reputationRoutes);

// API documentation
app.get('/api/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check — to check that the server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'CredLayer', version: '0.1.0' });
});

app.listen(PORT, () => {
  console.log(`✅ CredLayer backend running on http://localhost:${PORT}`);
});

export default app;