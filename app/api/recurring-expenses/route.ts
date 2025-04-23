import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const { data: expenses, error } = await supabase
            .from('recurring_expenses')
            .select(`
        *,
        category:categories(*)
      `)
            .eq('user_id', userId);

        if (error) throw error;
        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch recurring expenses' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data: expense, error } = await supabase
            .from('recurring_expenses')
            .insert([
                {
                    user_id: body.userId,
                    category_id: body.categoryId,
                    frequency: body.frequency,
                    amount: body.amount,
                }
            ])
            .select(`
        *,
        category:categories(*)
      `)
            .single();

        if (error) throw error;
        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create recurring expense' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('recurring_expenses')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ message: 'Recurring expense deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete recurring expense' }, { status: 500 });
    }
} 