import connectDB from "../connection"
import User from "../models/user"
import Role from "../models/role"
import { hashPassword } from "@/lib/auth/password"
import { config } from "dotenv"
config()

interface CreateAdminUserOptions {
  email: string
  password: string
  name?: string
  empId?: string
  phone?: string
}

export async function createAdminUser(options: CreateAdminUserOptions) {
  try {
    await connectDB()
    
    const { email, password, name = "Admin User", empId = "ADMIN001", phone = "1234567890" } = options
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log(`User with email ${email} already exists`)
      return existingUser
    }
    
    // Get or create superadmin role
    let adminRole = await Role.findOne({ name: "superadmin" })
    if (!adminRole) {
      console.log("Superadmin role not found. Please run 'pnpm run db:seed' first to seed roles.")
      throw new Error("Superadmin role not found. Please seed roles first.")
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Create admin user
    const adminUser = await User.create({
      empId,
      name,
      email,
      phone,
      passwordHash,
      roleId: adminRole._id,
      locationType: "ho",
      status: "active",
      createdBy: adminRole._id, // Self-created
    })
    
    console.log("✅ Admin user created successfully!")
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Employee ID: ${adminUser.empId}`)
    console.log(`   Role: ${adminRole.displayName}`)
    console.log(`   Password: ${password}`)
    
    return adminUser
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    throw error
  }
}

// CLI usage - run directly with tsx
const email = process.env.ADMIN_EMAIL || "admin@rummi.com"
const password = process.env.ADMIN_PASSWORD || "admin123"
const name = process.env.ADMIN_NAME || "Admin User"
const empId = process.env.ADMIN_EMP_ID || "ADMIN001"
const phone = process.env.ADMIN_PHONE || "1234567890"

createAdminUser({ email, password, name, empId, phone })
  .then(() => {
    console.log("\n🎉 Setup complete! You can now login with:")
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Setup failed:", error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
