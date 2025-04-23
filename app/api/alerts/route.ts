import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const { data: alerts, error } = await supabase
            .from('alerts')
            .select(`
        *,
        triggers:triggers(
          expense:recurring_expenses(*)
        )
      `)
            .eq('user_id', userId);

        if (error) throw error;
        return NextResponse.json(alerts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data: alert, error } = await supabase
            .from('alerts')
            .insert([
                {
                    user_id: body.userId,
                    threshold_amount: body.thresholdAmount,
                    alert_type: body.alertType,
                }
            ])
            .select()
            .single();

        if (error) throw error;

        // If triggers are provided, create them
        if (body.expenseIds && body.expenseIds.length > 0) {
            const triggers = body.expenseIds.map((expenseId: number) => ({
                alert_id: alert.id,
                expense_id: expenseId,
            }));

            const { error: triggerError } = await supabase
                .from('triggers')
                .insert(triggers);

            if (triggerError) throw triggerError;
        }

        return NextResponse.json(alert);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('alerts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ message: 'Alert deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
    }
} 