import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { hasPermission, PERMISSIONS, anonymizeData } from "../../../../lib/accessControl";

export async function GET(request: NextRequest) {
  // Get user authentication using the new clerk auth() approach
  const { userId } = await auth();
  
  // Check if the user is authenticated
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const district = searchParams.get("district") || "";
  const viewType = searchParams.get("view") || "aggregate"; // 'aggregate' or 'detailed'
  
  // Validate pagination parameters
  if (page < 1 || pageSize < 1 || pageSize > 100) {
    return NextResponse.json(
      { error: "Invalid pagination parameters" }, 
      { status: 400 }
    );
  }
  
  try {
    // Check if user has permission to view detailed data
    let canViewDetailedData = false;
    if (viewType === 'detailed') {
      canViewDetailedData = await hasPermission(userId, PERMISSIONS.VIEW_ALL_DATA);
      
      if (!canViewDetailedData) {
        return NextResponse.json(
          { error: "Permission denied" }, 
          { status: 403 }
        );
      }
    }
    
    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;
    const from = offset;
    const to = offset + pageSize - 1;
    
    // Build query based on view type and apply filters
    let queryBuilder = supabase.from("price_entries_2");
    
    // Apply search filter if provided
    let searchFilter = '';
    if (search) {
      searchFilter = `product_name.ilike.%${search}%,district.ilike.%${search}%,upazilla.ilike.%${search}%`;
    }
    
    // Execute query with proper select and filters
    const { data, error } = await queryBuilder
      .select(viewType === 'detailed' ? "*" : "product_name, price, district, upazilla, created_at")
      .eq(district ? "district" : "", district || "")
      .or(searchFilter)
      .order("created_at", { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    // Count total records for pagination metadata
    const { count, error: countError } = await supabase
      .from("price_entries_2")
      .select("id", { count: "exact", head: true });
    
    if (countError) throw countError;
    
    // Apply data anonymization based on view type
    const anonymizationLevel = viewType === 'detailed' ? 'low' : 'medium';
    const processedData = data ? anonymizeData(data, anonymizationLevel) : [];
    
    return NextResponse.json({
      data: processedData,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
        totalRecords: count || 0
      }
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report data" }, 
      { status: 500 }
    );
  }
} 