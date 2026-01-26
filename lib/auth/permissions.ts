import type { RolePermissions } from "@/types/db"

export function can(
  permissions: RolePermissions,
  permission: keyof RolePermissions,
): boolean {
  return permissions[permission] === true
}

export function requirePermission(
  permissions: RolePermissions,
  permission: keyof RolePermissions,
): void {
  if (!can(permissions, permission)) {
    throw new Error(`Forbidden: Missing permission ${permission}`)
  }
}
