import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data: user, error } = await supabase
            .from('users')
            .insert([
                {
                    name: body.name,
                    email: body.email,
                    password_hash: body.passwordHash,
                    phone_number: body.phoneNumber,
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
} 