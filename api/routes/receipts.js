const express = require('express');
const multer = require('multer');
const { put } = require('@vercel/blob');
const requireAuth = require('../middleware/auth');
const { extractReceipt } = require('../utils/claude');

const router = express.Router();
router.use(requireAuth);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post('/scan', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No receipt image uploaded (field name: "receipt")' });
    }

    const { buffer, mimetype, originalname } = req.file;

    const [blob, extracted] = await Promise.all([
      put(`receipts/${req.userId}/${Date.now()}-${originalname}`, buffer, {
        access: 'public',
        contentType: mimetype,
      }),
      extractReceipt(buffer.toString('base64'), mimetype),
    ]);

    res.json({
      receiptImageUrl: blob.url,
      draft: extracted,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to scan receipt', details: err.message });
  }
});

module.exports = router;
