module.exports = {
  port: 9001,
  directory: "/root/ola-shop-v2/.medusa/server/public/admin",
  spa: "index.html",
  rewrite: [
    { from: "/app/*", to: "/index.html" },
    { from: "/admin/*", to: "http://localhost:9000/admin/" },
    { from: "/auth/*", to: "http://localhost:9000/auth/" },
    { from: "/store/*", to: "http://localhost:9000/store/" }
  ]
}
