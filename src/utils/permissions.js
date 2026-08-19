import { ROLE_META } from '../data/seed'

export function can(role, key) {
  if (!role) return false
  return ROLE_META[role]?.perms.includes(key) ?? false
}
