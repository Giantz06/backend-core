export function runMiddleware(req, res, middleware, next, errorHandler) {
  if (middleware.length === 0) {
    return next();
  }
  let index = 0;
  async function runNextMiddleware() {
    try {
      if (index < middleware.length) {
        const currentMiddleware = middleware[index];
        index++;
        return await currentMiddleware(req, res, runNextMiddleware);
      }
      else return await next();
    }
    catch (err) {
      errorHandler(err, req, res);
    }
  }
  return runNextMiddleware();
}