import { useAuthContext } from "@/context/auth-context";

/**
 * Custom hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Check if user has specific role(s)
 */
export function useHasRole(roles) {
  const { user } = useAuth();

  if (!user) return false;

  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}

/**
 * Check if user has specific permission
 */
export function useHasPermission(permission) {
  const { user } = useAuth();

  if (!user || !user.permissions) return false;

  return user.permissions.includes(permission);
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
