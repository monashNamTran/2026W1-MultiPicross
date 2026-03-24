import os from 'os';

const interfaces = os.networkInterfaces();
for (const name of Object.keys(interfaces)) {
  for (const net of interfaces[name]) {
    // Skip over non-IPv4 and internal (loopback) addresses
    if (net.family === 'IPv4' && !net.internal) {
      console.log(`Server reachable at: http://${net.address}:3000`);
    }
  }
}