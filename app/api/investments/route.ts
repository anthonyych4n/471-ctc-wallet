import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const { data: investments, error } = await supabase
            .from('investments')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return NextResponse.json(investments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data: investment, error } = await supabase
            .from('investments')
            .insert([
                {
                    user_id: body.userId,
                    amount: body.amount,
                    purchase_date: new Date(body.purchaseDate).toISOString(),
                    expected_return: body.expectedReturn,
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(investment);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
    }
} 