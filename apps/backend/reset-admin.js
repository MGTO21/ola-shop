const { createTypeormConnection } = require("@medusajs/utils")
const { User } = require("@medusajs/medusa")
const bcrypt = require("bcryptjs")

async function resetAdmin() {
    console.log("🔄 Connecting to database...")

    const connection = await createTypeormConnection({
        type: "postgres",
        url: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db",
        entities: [User]
    })

    const email = "admin@ola-shop.com"
    const password = "Abc996050@"
    console.log(`🔄 Hashing password for ${email}...`)
    const password_hash = await bcrypt.hash(password, 10)

    const userRepository = connection.getRepository(User)
    const user = await userRepository.findOne({ where: { email } })

    if (user) {
        user.password_hash = password_hash
        await userRepository.save(user)
        console.log(`✅ Password successfully updated for ${email}`)
    } else {
        console.log(`❌ User ${email} not found in database.`)
    }

    await connection.destroy()
}

resetAdmin().catch(err => {
    console.error("❌ Reset Failed:", err)
    process.exit(1)
})
