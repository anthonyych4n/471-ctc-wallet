import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select(`
                *,
                category:categories(*),
                account:financial_accounts(*)
            `);

        if (error) throw error;
        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data: transaction, error } = await supabase
            .from('transactions')
            .insert([
                {
                    transaction_date: new Date(body.transactionDate).toISOString(),
                    description: body.description,
                    type: body.type,
                    user_id: body.userId,
                    category_id: body.categoryId,
                    account_id: body.accountId,
                }
            ])
            .select(`
                *,
                category:categories(*),
                account:financial_accounts(*)
            `)
            .single();

        if (error) throw error;
        return NextResponse.json(transaction);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
} 