# straydog-js

**Drop-in API monitoring for any Node.js backend**

straydog-js is a lightweight, zero-config monitoring solution for Node.js applications. It is designed to quickly instrument your Express (and soon NestJS, Fastify) APIs for route discovery, request tracking, and real-time observability. With a simple integration, you gain insight into your API's structure and activity without invasive code changes or heavy dependencies.

---

## Features

- **Automatic Route Discovery**  
  Instantly lists all API endpoints and their HTTP methods by introspecting your Express app.

- **Request Monitoring (Planned)**  
  Track incoming requests, response times, and payloads for every route.

- **Dashboard (Planned)**  
  Visual dashboard to view routes, request activity, and basic analytics.

- **Minimal Setup**  
  Integrate with a single line of code—no configuration or code changes required.

- **Framework Agnostic (Express Supported, NestJS/Fastify Planned)**  
  Works out-of-the-box with Express, with support for other Node.js frameworks coming soon.

- **Open Source & Extensible**  
  MIT-licensed and designed for easy customization.

---

## Installation

```bash
npm install straydog-js
# or
yarn add straydog-js
```

---

## Quick Start

Integrate straydog-js into your Express app with minimal changes:

```typescript
import express from 'express';
import { ExpressAdapter } from 'straydog-js';

const app = express();

// Instrument your app (add this line before you define routes)
const straydog = new ExpressAdapter();
straydog.monitor(app);

// Define your routes as usual
app.get('/api/hello', (req, res) => {
  res.send('Hello world!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

After starting your server, straydog-js will automatically discover and print all available endpoints to the console. More monitoring and dashboard features are coming soon.

---

## API

### ExpressAdapter

- **monitor(app: Application): void**
  - Instruments your Express app for route discovery and monitoring.
  - Should be called before defining routes for full coverage.

---

## Roadmap

- [x] Express route discovery
- [ ] Request tracking and analytics
- [ ] Built-in dashboard UI
- [ ] NestJS and Fastify support
- [ ] Custom event hooks & extensions

---

## Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/sheron184/straydog-js.git
cd straydog-js
npm install
```

Build the project:

```bash
npm run build
```

Run in dev mode (watch for changes):

```bash
npm run dev
```

---

## Contributing

Pull requests, issues, and feature suggestions are welcome!  
Please open an issue for bugs or new ideas.

---

## License

MIT © Sheron Jude

---

## Links

- [GitHub Repository](https://github.com/sheron184/straydog-js)
- [Issues](https://github.com/sheron184/straydog-js/issues)

---

## Author

Sheron Jude  
[@sheron184](https://github.com/sheron184)
