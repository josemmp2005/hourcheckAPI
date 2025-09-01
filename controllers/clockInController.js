import supabase from '../config/supabase.js'
import { ClockInModel } from '../models/clockInModel.js'
import dotenv from 'dotenv'
import { verifyAuthToken } from '../utils/jwt.js'

dotenv.config()

export const clockIn = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const code = req.body.code;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const { data, error } = await supabase
            .from('daily_singing_codes')
            .select('*')
            .eq('code', code)
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Code not found' });
        }

        if (data.date != new Date().toISOString().split('T')[0]) {
            return res.status(400).json({ error: 'Code is not valid for today' });
        }

        const clockIn = new ClockInModel({
            user_id: decoded.id,
            code: data.code,
            timestamp: new Date()
        });

        const { clockInData, clockInError } = await supabase
            .from('clock_ins')
            .insert([clockIn])
            .single();

        if (clockInError) {
            return res.status(400).json({ error: clockInError.message });
        }

        return res.status(200).json({ message: 'Clocked in successfully' });
    } catch (error) {
        console.error('Error clocking in:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}