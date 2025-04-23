import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const { data: goals, error } = await supabase
            .from('savings_goals')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return NextResponse.json(goals);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch savings goals' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data: goal, error } = await supabase
            .from('savings_goals')
            .insert([
                {
                    user_id: body.userId,
                    deadline: new Date(body.deadline).toISOString(),
                    name: body.name,
                    target_amount: body.targetAmount,
                    current_amount: body.currentAmount || 0,
                    status: body.status,
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(goal);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create savings goal' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { data: goal, error } = await supabase
            .from('savings_goals')
            .update({
                current_amount: body.currentAmount,
                status: body.status,
            })
            .eq('id', body.id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(goal);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update savings goal' }, { status: 500 });
    }
} 