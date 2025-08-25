import { ExpressRoute } from "../types/express.types";

// Get list of all defined routes within the express API
export function expressListEndpoints(appOrRouter: any, basePath = ''): ExpressRoute[] {
  const routes: ExpressRoute[] = [];
  let stack: any[] = [];

  // Prefer _router (v4/v5). router is only in very old Express (v3).
  if (appOrRouter._router) {
    stack = appOrRouter._router.stack;
  } else if (appOrRouter.router) {
    stack = appOrRouter.router.stack; // legacy fallback
  }

  stack.forEach((layer: any) => {
    if (layer.route) {
      // Direct route
      const path = basePath + layer.route.path;
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
      routes.push({ path, methods });
    } else if (layer.name === 'router' && layer.handle.stack) {
      // Nested router
      layer.handle.stack.forEach((nestedLayer: any) => {
        if (nestedLayer.route) {
          const path = basePath + nestedLayer.route.path;
          const methods = Object.keys(nestedLayer.route.methods).map(m => m.toUpperCase());
          routes.push({ path, methods });
        }
      });
    }
  });

  return routes;
}
