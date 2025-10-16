import supabase from '../config/supabase.js'
import { ClockInModel } from '../models/clockInModel.js'
import dotenv from 'dotenv'
import { verifyAuthToken } from '../utils/jwt.js'

dotenv.config()

export const clockIn = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { code, company_id, work_mode_id } = req.body;
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

        const checkIn = new Date();

        const clockIn = {
            user_id: decoded.id,
            work_mode_id: work_mode_id,
            check_in: checkIn,
            check_out: null,
            company_id: company_id
        };

        const { data: insertData, error: insertError } = await supabase
            .from('clock_ins')
            .insert([clockIn])
            .select();

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            return res.status(400).json({ error: insertError.message });
        }

        return res.status(200).json({ message: 'Clocked in successfully at ' + checkIn, data: insertData });
    } catch (error) {
        console.error('Error clocking in:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const clockOut = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { id } = decoded;
    const companyId = req.body.company_id;

    if (!companyId) {
        return res.status(400).json({ error: 'Company ID is required' });
    }
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('clock_ins')
            .select('*')
            .eq('user_id', id)
            .eq('company_id', companyId)
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

export const checkClockInStatus = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    const companyId = req.params.companyId;

    if (!decoded) return;

    const { id } = decoded;
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('clock_ins')
            .select('*')
            .eq('user_id', id)
            .eq('company_id', companyId)
            .gte('check_in', today + ' 00:00:00')
            .lte('check_in', today + ' 23:59:59')
            .single();
        if (error && error.code !== 'PGRST116') {
            return res.status(400).json({ error: error.message });
        }
        if (!data) {
            return res.status(200).json({ clockedIn: false });
        }
        return res.status(200).json({ clockedIn: true, data });
    } catch (error) {
        console.error('Error checking clock-in status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getClockToday = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { id } = decoded;

    try {
        const { data, error } = await supabase
            .from('clock_ins')
            .select('*')
            .eq('user_id', id)
            .gte('check_in', new Date().toISOString().split('T')[0] + ' 00:00:00')
            .order('check_in', { ascending: false });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching clock-in history:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}