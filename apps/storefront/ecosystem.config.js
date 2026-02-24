module.exports = {
    apps: [{
        name: "ola-storefront",
        script: "npm",
        args: "run start",
        cwd: "/root/ola-shop-v2/storefront",
        instances: "max",
        exec_mode: "cluster",
        autorestart: true,
        watch: false,
        max_memory_restart: "1G",
        env: {
            NODE_ENV: "production",
            PORT: 3000
        }
    }]
};
