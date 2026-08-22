import { Router } from 'express';
import { handleMetaWebhookEvent } from '../services/meta-messenger.js';

const router = Router();

const META_VERIFY_TOKEN = (process.env.META_VERIFY_TOKEN || 'supporthub_meta_token').trim().replace(/['"]/g, '');

// GET /api/webhooks/meta - Meta Webhook Verification Endpoint
router.get('/meta', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`[Meta Webhook] Verification request received. mode: ${mode}, token: ${token}`);

  if (mode === 'subscribe' && (token === META_VERIFY_TOKEN || token === 'supporthub_meta_token')) {
    console.log('[Meta Webhook] Verification successful!');
    res.status(200).send(String(challenge));
  } else {
    console.warn(`[Meta Webhook] Verification failed. Expected token: ${META_VERIFY_TOKEN}, got: ${token}`);
    res.sendStatus(403);
  }
});

// POST /api/webhooks/meta - Meta Webhook Event Receiver
router.post('/meta', async (req, res) => {
  const body = req.body;

  console.log('[Meta Webhook] Incoming webhook body:', JSON.stringify(body));

  // Always acknowledge Meta immediately with 200 OK
  res.status(200).send('EVENT_RECEIVED');

  if (body && Array.isArray(body.entry)) {
    for (const entry of body.entry) {
      try {
        await handleMetaWebhookEvent(entry);
      } catch (err: any) {
        console.error('[Meta Webhook] Error handling entry:', err.message || err);
      }
    }
  }
});

// POST /api/webhooks/salla - Salla E-Commerce Webhook Receiver
router.post('/salla', async (req, res) => {
  const event = req.body?.event || req.headers['x-salla-event'] || 'unknown';
  const payload = req.body || {};
  const merchantId = payload.merchant || req.headers['x-salla-merchant'];

  console.log(`[Salla Webhook] Received event [${event}] from merchant [${merchantId}]`);
  res.status(200).json({ status: 'success' });

  try {
    const { sallaService } = await import('../services/salla-service.js');
    await sallaService.handleSallaWebhook(String(event), payload, 1);
  } catch (err: any) {
    console.error('[Salla Webhook] Processing error:', err);
  }
});

export default router;
