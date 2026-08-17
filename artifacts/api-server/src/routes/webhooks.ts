import { Router } from 'express';
import { handleMetaWebhookEvent } from '../services/meta-messenger.js';

const router = Router();

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'supporthub_meta_token';

// GET /api/webhooks/meta - Meta Webhook Verification Endpoint
router.get('/meta', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`[Meta Webhook] Verification request received. mode: ${mode}, token: ${token}`);

  if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
    console.log('[Meta Webhook] Verification successful!');
    res.status(200).send(challenge);
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

export default router;
