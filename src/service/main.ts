import http from 'node:http';
import { createServiceHandler } from './handler.ts';

const port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
const serviceToken = process.env.OPENCHAMBER_SERVICE_TOKEN ?? '';

if (!Number.isFinite(port) || port <= 0 || !serviceToken) {
  console.error('OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required');
  process.exit(1);
}

const server = http.createServer(createServiceHandler({ serviceToken }));
server.listen(port, '127.0.0.1');
