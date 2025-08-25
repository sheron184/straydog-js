# straydog-js

**Drop-in API monitoring and observability for Node.js applications**

![npm version](https://img.shields.io/npm/v/straydog-js.svg)
![license](https://img.shields.io/npm/l/straydog-js.svg)
![downloads](https://img.shields.io/npm/dt/straydog-js.svg)

straydog-js is a lightweight, zero-config monitoring solution that provides real-time observability for your Node.js APIs. Track requests, monitor performance, analyze errors, and visualize your API usage through an integrated dashboard—all with a single line of code.

---

## ✨ Features

### 🔍 **Automatic Request Monitoring**
- Track all incoming HTTP requests with detailed metadata
- Monitor response times, status codes, and error rates
- Capture request/response data including headers, query parameters, and payloads

### 📊 **Built-in Analytics Dashboard**
- Real-time dashboard accessible at `/straydog` 
- Visual charts and metrics for API performance
- Request logs with filtering and search capabilities
- Error tracking and debugging tools

### 📈 **Performance Metrics**
- Response time analytics (average, min, max)
- Success/failure rate monitoring  
- Traffic analysis by endpoint
- Identify slowest and most-used endpoints

### 🚀 **Zero Configuration**
- Drop-in integration with single line setup
- Automatic route discovery for Express applications
- Local SQLite database for request storage
- No external dependencies or cloud services required

### 🛡️ **Smart Filtering**
- Exclude static files and unwanted routes
- Configurable request filtering options
- Built-in exclusions for development tools and assets

---

## 🚀 Quick Start

### Installation

```bash
npm install straydog-js
# or
yarn add straydog-js
```

### Basic Usage

```typescript
import express from 'express';
import { ExpressAdapter } from 'straydog-js';

const app = express();

// Initialize straydog monitoring
const straydog = new ExpressAdapter(app);
straydog.observe(); // Start request monitoring

// Define your routes as usual
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

straydog.catch();   // Enable error tracking

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('📊 Straydog dashboard: http://localhost:3000/straydog');
});
```

### adapter.catch()

The catch function must be called after you defined your routes.


### Advanced Configuration

```typescript
import { ExpressAdapter } from 'straydog-js';

const app = express();

// Configure with custom options
const straydog = new ExpressAdapter(app, {
  exclude: ['/health', '/metrics', '/straydog/api', '/static']
});

straydog.observe();
straydog.catch();
```

---

## 📊 Dashboard & Analytics

Once integrated, straydog-js provides a comprehensive dashboard accessible at `/straydog`:

### Dashboard Features
- **Request Overview**: Real-time request count, success rates, and average response times
- **Endpoint Analytics**: Traffic analysis for each API endpoint
- **Error Monitoring**: Failed requests with detailed error information
- **Performance Metrics**: Response time distributions and latency analysis
- **Request History**: Searchable log of all API requests

### API Endpoints
The dashboard is powered by internal API endpoints:

```
GET /straydog/api?method=getRequests&days=7   # Get request logs
GET /straydog/api?method=getStats&days=7      # Get analytics
GET /straydog/api?method=getEndpoints         # Get route list
GET /straydog/api?method=getErrorRequests     # Get failed requests
```

---

## 🔧 API Reference

### ExpressAdapter

The main class for Express.js integration.

#### Constructor
```typescript
new ExpressAdapter(app: Application, options?: Options)
```

**Parameters:**
- `app` - Your Express application instance
- `options` - Configuration options (optional)

#### Options
```typescript
interface Options {
  exclude: string[];  // Routes to exclude from monitoring
}
```

**Default exclusions:**
- `/straydog/api` - Dashboard API endpoints

#### Methods

##### `observe()`
Starts monitoring incoming requests. Call this method to begin tracking API usage.

```typescript
straydog.observe();
```

##### `catch()`
Enables error tracking for uncaught exceptions and failed requests.

```typescript
straydog.catch();
```

---

## 📋 Analytics & Metrics

straydog-js automatically calculates comprehensive metrics:

### Request Statistics
- **Total Requests**: Count of all API calls
- **Success Rate**: Percentage of successful requests (status < 400)
- **Average Latency**: Mean response time across all requests
- **Error Count**: Number of failed requests

### Endpoint Analysis
- **Highest Traffic**: Most frequently accessed endpoints
- **Slowest Endpoint**: Endpoints with highest average response time
- **Fastest Endpoint**: Most performant endpoints  
- **Most Failed**: Endpoints with highest error rates

### Performance Metrics
- **Latency Distribution**: Min, max, and average response times
- **System Metrics**: Memory usage, CPU usage, and uptime
- **Time-based Analysis**: Metrics over configurable time periods (default: 7 days)

---

## 🗄️ Data Storage

straydog-js uses a local SQLite database to store request data:

- **Location**: `src/config/data/db.sqlite3`
- **Tables**: `request` and `response` with automatic schema creation
- **Retention**: Configurable via API queries (default: 7 days)

### Database Schema

**requests table:**
```sql
CREATE TABLE request (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT,
  path TEXT, 
  query TEXT,
  body TEXT,
  headers TEXT,
  start_time DATETIME
);
```

**responses table:**
```sql
CREATE TABLE response (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER,
  body TEXT,
  end_time DATETIME,
  status_code INTEGER,
  error TEXT,
  latency INTEGER,
  error_stack TEXT
);
```

---

## 🛠️ Development

### Setup
```bash
git clone https://github.com/sheron184/straydog-js.git
cd straydog-js
npm install
```

### Build
```bash
npm run build        # Compile TypeScript and copy UI assets
npm run dev          # Watch mode for development
npm run clean        # Clean dist directory
```

### Testing
```bash
npm test             # Run test suite
```

---

## 🗺️ Roadmap

- [x] **Express.js Support** - Full integration with Express applications
- [x] **Request/Response Tracking** - Complete HTTP lifecycle monitoring
- [x] **Analytics Dashboard** - Visual metrics and request analysis
- [x] **Error Tracking** - Automatic error capture and reporting
- [x] **SQLite Storage** - Local database for request persistence

### Upcoming Features
- [ ] **Framework Expansion**: NestJS and Fastify support
- [ ] **Advanced Filtering**: Custom request filtering and sampling
- [ ] **Export Capabilities**: CSV/JSON export of analytics data
- [ ] **Alerting System**: Configurable alerts for errors and performance
- [ ] **Custom Dashboards**: User-defined metrics and visualizations
- [ ] **API Rate Limiting**: Built-in rate limiting with monitoring

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Reporting Issues
- Use GitHub Issues for bug reports and feature requests
- Include detailed reproduction steps for bugs
- Specify your Node.js and framework versions

---

## 📄 License

MIT © [Sheron Jude](https://github.com/sheron184)

---

## 🔗 Links

- [GitHub Repository](https://github.com/sheron184/straydog-js)
- [npm Package](https://www.npmjs.com/package/straydog-js)
- [Issues & Bug Reports](https://github.com/sheron184/straydog-js/issues)
- [Documentation](https://github.com/sheron184/straydog-js#readme)

---

## 👨‍💻 Author

**Sheron Jude**  
- GitHub: [@sheron184](https://github.com/sheron184)
- Email: [Contact via GitHub](https://github.com/sheron184)

---

## ⭐ Show Your Support

If straydog-js helps you monitor your APIs effectively, please consider giving it a star on GitHub!

```bash
# Try it out in your next project
npm install straydog-js
```

**Happy monitoring! 🐕‍🦺**