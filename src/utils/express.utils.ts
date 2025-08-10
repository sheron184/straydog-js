import { ExpressRoute } from "../types/express.types";

// Get list of all defined routes within the express API
export function expressListEndpoints(appOrRouter: any, basePath: any): ExpressRoute[] {
  let routes: any = [];
  let stack: any = [];

  // Express stores routes/middleware in .stack
  if (appOrRouter.router) {
    stack = appOrRouter.router.stack; 
  } else if (appOrRouter._router) {
    appOrRouter._router.stack
  }
  stack.forEach((layer: any) => {
    // console.log(layer)
    // console.log(layer.handle.stack)
    if (layer.route) {
      // Direct route
      const path = basePath + layer.route.path;
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
      routes.push({ path, methods });
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach((nestedLayer: any) => {
        const path = basePath + nestedLayer.route.path;
        const methods = Object.keys(nestedLayer.route.methods).map(m => m.toUpperCase());
        routes.push({ path, methods });
      });
    }
  });

  return routes;
}
