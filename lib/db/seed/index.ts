import { config } from "dotenv"
// Load environment variables from .env and .env.local
config({ path: [".env", ".env.local"] })

import connectDB from "../connection"
import Role from "../models/role"
import { systemRoles } from "./roles"

async function seedRoles() {
  console.log("Seeding roles...")
  
  for (const roleData of systemRoles) {
    const existingRole = await Role.findOne({ name: roleData.name })
    
    if (existingRole) {
      // Update existing role permissions if it's a system role
      if (existingRole.isSystemRole) {
        await Role.updateOne(
          { name: roleData.name },
          { $set: { permissions: roleData.permissions, displayName: roleData.displayName, description: roleData.description } }
        )
        console.log(`Updated role: ${roleData.name}`)
      }
    } else {
      await Role.create(roleData)
      console.log(`Created role: ${roleData.name}`)
    }
  }
  
  console.log("Roles seeded successfully!")
}

async function seed() {
  try {
    await connectDB()
    await seedRoles()
    console.log("All seeds completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Seed failed:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  seed()
}

export { seedRoles }
export default seed

