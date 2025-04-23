import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { data: accounts, error } = await supabase
            .from('financial_accounts')
            .select(`
                *,
                bank:banks(*),
                transactions(*)
            `);

        if (error) throw error;
        return NextResponse.json(accounts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data: account, error } = await supabase
            .from('financial_accounts')
            .insert([
                {
                    balance: body.balance,
                    type: body.type,
                    user_id: body.userId,
                    created_at: new Date().toISOString(),
                }
            ])
            .select()
            .single();

        if (error) throw error;

        if (body.bank) {
            const { error: bankError } = await supabase
                .from('banks')
                .insert([
                    {
                        financial_account_id: account.id,
                        branch: body.bank.branch,
                        name: body.bank.name,
                        address: body.bank.address,
                    }
                ]);

            if (bankError) throw bankError;
        }

        return NextResponse.json(account);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
} 