import { createTypeormConnection } from "@medusajs/utils"
import { User } from "@medusajs/medusa"
import bcrypt from "bcrypt"

async function resetAdmin() {
    const connection = await createTypeormConnection({
        type: "postgres",
        url: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db",
        entities: [User]
    })

    const email = "admin@ola-shop.com"
    const password = "Abc996050@"
    const password_hash = await bcrypt.hash(password, 10)

    const userRepository = connection.getRepository(User)
    const user = await userRepository.findOne({ where: { email } })

    if (user) {
        user.password_hash = password_hash
        await userRepository.save(user)
        console.log(`✅ Password updated for ${email}`)
    } else {
        console.log(`❌ User ${email} not found`)
    }

    await connection.destroy()
}

resetAdmin()
