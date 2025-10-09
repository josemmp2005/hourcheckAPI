import express from "express";

const router = express.Router();
router.get('/', (req, res) => {
    res.json({
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
});

export default router;