const { loadEnv, defineConfig } = require('@medusajs/utils');

loadEnv(process.env.NODE_ENV, process.cwd());

module.exports = defineConfig({

    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        databaseDriverOptions: {
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
            max: 50,
        },
        http: {
            storeCors: process.env.STORE_CORS || "http://localhost:8000,http://localhost:3000,http://localhost:3001",
            adminCors: process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001,http://localhost:9000",
            authCors: process.env.AUTH_CORS || "http://localhost:8000,http://localhost:3000,http://localhost:3001,http://localhost:9000",
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
            host: process.env.HOST || "0.0.0.0",
        }
    },
    modules: [
        {
            key: "cache",
            resolve: "@medusajs/cache-redis",
            options: {
                redisUrl: process.env.REDIS_URL
            },
        },
        {
            key: "event_bus",
            resolve: "@medusajs/event-bus-redis",
            options: {
                redisUrl: process.env.REDIS_URL
            },
        },
        {
            resolve: "./src/modules/ola-core",
            options: {},
        },
        {
            resolve: "@medusajs/auth",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/auth-emailpass",
                        id: "emailpass",
                        options: {
                            token_secret: process.env.JWT_SECRET || "supersecret",
                        }
                    }
                ]
            }
        },
    ],
    admin: {
        disable: true,
        path: "/app",
        backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    }
})
