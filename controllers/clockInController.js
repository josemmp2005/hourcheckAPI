import supabase from '../config/supabase.js'
import { ClockInModel } from '../models/clockInModel.js'
import dotenv from 'dotenv'
import { VerifyAuthToken } from '../utils/jwt.js'
import { verify } from 'crypto'

dotenv.config()

export const clockIn = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;




}