export function jsonResponse(response) {
  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };
  response.json = (body) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(body));
  };
  return response;
}

export async function readJsonBody(request) {
  if (request.body !== undefined) return request.body;

  const rawBody = await new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });

  request.body = rawBody ? JSON.parse(rawBody) : {};
  return request.body;
}

function matchesPath(pattern, pathname) {
  const names = [];
  const expression = pattern.replace(/:([A-Za-z0-9_]+)/g, (_, name) => {
    names.push(name);
    return '([^/]+)';
  });
  const match = pathname.match(new RegExp(`^${expression}$`));
  if (!match) return null;
  return Object.fromEntries(names.map((name, index) => [name, match[index + 1]]));
}

export function createRouter(routes) {
  return async function handleRoutes(request, response) {
    const url = new URL(request.url, 'http://localhost');
    const route = routes.find(candidate => candidate.method === request.method && matchesPath(candidate.path, url.pathname));
    if (!route) return false;

    request.params = matchesPath(route.path, url.pathname);
    request.query = Object.fromEntries(url.searchParams);
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      await readJsonBody(request);
    }
    const routeResponse = jsonResponse(response);
    let middlewareIndex = 0;
    const next = async (error) => {
      if (error) throw error;
      const middleware = route.middleware?.[middlewareIndex++];
      if (middleware) return middleware(request, routeResponse, next);
      return route.handler(request, routeResponse);
    };

    try {
      await next();
    } catch (error) {
      if (!response.writableEnded) routeResponse.status(400).json({ error: error.message });
    }
    return true;
  };
}

export function controllerRoute(method, path, handler, middleware = []) {
  return { method, path, handler, middleware };
}