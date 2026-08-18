import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per IP per window
    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export { loginLimiter };