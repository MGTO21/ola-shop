const { loadEnv, defineConfig } = require('@medusajs/utils');
const path = require('path');

loadEnv(process.env.NODE_ENV, process.cwd());

module.exports = defineConfig({

    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: process.env.REDIS_URL,
        workerMode: process.env.MEDUSA_WORKER_MODE || "shared",
        databaseDriverOptions: {
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
            max: 50,
        },
        http: {
            storeCors: ["https://ola-shop.com", "https://www.ola-shop.com", "http://localhost:8000", "http://localhost:3000"],
            adminCors: ["https://ola-shop.com", "https://www.ola-shop.com", "http://localhost:7000", "http://localhost:9000"],
            authCors: ["https://ola-shop.com", "https://www.ola-shop.com", "http://localhost:8000", "http://localhost:3000", "http://localhost:9000"],
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
        outDir: ".medusa/admin",
        backendUrl: "https://www.ola-shop.com"
    }
})
