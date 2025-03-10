import { supabase } from "./supabase";
import { createClerkClient } from "@clerk/nextjs/server";

// Role-based access control constants
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user"
};

// Permission types
export const PERMISSIONS = {
  VIEW_ALL_DATA: "view_all_data",
  VIEW_AGGREGATE_DATA: "view_aggregate_data",
  EXPORT_DATA: "export_data",
  MANAGE_USERS: "manage_users"
};

// Map roles to permissions
const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ALL_DATA,
    PERMISSIONS.VIEW_AGGREGATE_DATA,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_USERS
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_AGGREGATE_DATA,
    PERMISSIONS.EXPORT_DATA
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_AGGREGATE_DATA
  ]
};

/**
 * Check if a user has permission to perform an action
 */
export async function hasPermission(userId: string, permission: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    // Check if users table exists and has clerk_id field
    try {
      // Try to fetch user's role from the database
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("clerk_id", userId)
        .single();
      
      if (error || !data) {
        // Fallback to default user role if table doesn't exist or has no data
        console.warn("User role not found, using default role:", error);
        return rolePermissions[ROLES.USER].includes(permission);
      }
      
      const userRole = data.role || ROLES.USER;
      const permissions = rolePermissions[userRole] || [];
      
      return permissions.includes(permission);
    } catch (dbError) {
      // Handle case where users table might not exist yet
      console.warn("Error accessing users table, using default permissions:", dbError);
      return rolePermissions[ROLES.USER].includes(permission);
    }
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

/**
 * Data anonymization function to protect sensitive information
 */
export function anonymizeData(data: any, level: 'high' | 'medium' | 'low' = 'medium'): any {
  if (!data) return data;
  
  // For arrays, anonymize each item
  if (Array.isArray(data)) {
    return data.map(item => anonymizeData(item, level));
  }
  
  // For objects, anonymize specific fields
  if (typeof data === 'object') {
    const result = { ...data };
    
    // Personal identifiers to remove/mask
    if ('user_email' in result) {
      // Mask email: show only first character + domain
      const emailParts = result.user_email.split('@');
      result.user_email = `${emailParts[0].charAt(0)}***@${emailParts[1]}`;
    }
    
    // Location anonymization based on level
    if (level === 'high') {
      // High anonymization: only show district
      if ('upazilla' in result) {
        result.upazilla = '***';
      }
    }
    
    // If there's submission date, keep only the date part (remove time)
    if ('created_at' in result) {
      result.created_at = result.created_at.split('T')[0];
    }
    
    return result;
  }
  
  return data;
} 