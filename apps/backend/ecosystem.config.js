module.exports = {
    apps: [{
        name: "medusa-backend",
        script: "npm",
        args: "run start",
        cwd: "/root/ola-shop-v2/apps/backend",
        instances: "max",
        exec_mode: "cluster",
        autorestart: true,
        watch: false,
        max_memory_restart: "2G",
        env: {
            NODE_ENV: "production",
            PORT: 9000,
            MEDUSA_DISABLE_TELEMETRY: "1"
        }
    }]
};
