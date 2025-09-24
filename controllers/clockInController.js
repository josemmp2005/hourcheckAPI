import supabase from '../config/supabase.js'
import { ClockInModel } from '../models/clockInModel.js'
import dotenv from 'dotenv'
import { verifyAuthToken } from '../utils/jwt.js'

dotenv.config()

export const clockIn = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const code = req.body.code;
    const date = new Date().toISOString().split('T')[0];

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const { data, error } = await supabase
            .from('daily_signing_codes')
            .select('*')
            .eq('code', code)
            .eq('date', date);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Code not found' });
        }

        const codeData = data[0];

        if (codeData.date != new Date().toISOString().split('T')[0]) {
            return res.status(400).json({ error: 'Code is not valid for today' });
        }

        const clockIn = {
            user_id: decoded.id,
            work_mode_id: 1, // ejemplo 
            check_in: new Date(),
            check_out: null
        };

        const { data: insertData, error: insertError } = await supabase
            .from('clock_ins')
            .insert([clockIn])
            .select();

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            return res.status(400).json({ error: insertError.message });
        }

        return res.status(200).json({ message: 'Clocked in successfully', data: insertData });
    } catch (error) {
        console.error('Error clocking in:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const clockOut = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { id } = decoded;

    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('clock_ins')
            .select('*')
            .eq('user_id', id)
            .is('check_out', null)
            .gte('check_in', today + ' 00:00:00')
            .lte('check_in', today + ' 23:59:59')
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'No active clock-in found' });
        }

        const clockOut = {
            id: data.id,
            check_out: new Date()
        };

        const { data: updateData, error: updateError } = await supabase
            .from('clock_ins')
            .update(clockOut)
            .eq('id', data.id)
            .select();

        if (updateError) {
            console.error('Supabase update error:', updateError);
            return res.status(400).json({ error: updateError.message });
        }

        return res.status(200).json({ message: 'Clocked out successfully', data: updateData });
    } catch (error) {
        console.error('Error clocking out:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};