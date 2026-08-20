// Wraps an async controller so thrown errors (including DB errors)
// are forwarded to the centralized error middleware instead of
// crashing or falling through to a generic 500 with no context.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;