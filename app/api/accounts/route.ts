import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch accounts
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Retrieve accounts for this user
    const { data, error } = await supabase
      .from("financial_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order('id', { ascending: true });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" }, 
      { status: 500 }
    );
  }
}

// POST: Create a new account
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate the request body
    const { type, balance } = body;
    if (!type || balance === undefined) {
      return NextResponse.json(
        { error: "Type and balance are required" },
        { status: 400 }
      );
    }

    // Insert the new account
    const { data, error } = await supabase
      .from("financial_accounts")
      .insert([
        { 
          user_id: user.id,
          type, 
          balance
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing account
export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    // Validate the request body
    const { id, type, balance } = body;
    if (!id || !type || balance === undefined) {
      return NextResponse.json(
        { error: "ID, type and balance are required" },
        { status: 400 }
      );
    }

    // Update the account, ensuring it belongs to the current user
    const { data, error } = await supabase
      .from("financial_accounts")
      .update({ type, balance })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update account" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an account
export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Account ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the account, ensuring it belongs to the current user
    const { error } = await supabase
      .from("financial_accounts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}