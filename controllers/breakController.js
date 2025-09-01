import supabase from '../config/supabase.js'
import { breakModel } from '../models/breakModel.js'
import dotenv from 'dotenv'
import { VerifyAuthtoken } from '../utils/jwt.js'

dotenv.config();