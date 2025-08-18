import jwt from "jsonwebtoken";

function verifyAuthToken(req, res) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
        return null;
    }
}

export { verifyAuthToken };