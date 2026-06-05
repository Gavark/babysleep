# Manual Testing Procedures

Complements the automated test suite (`npm test`). Use these procedures to
smoke-test features that can't be fully covered in unit tests — notably
anything that depends on the browser's Push API, the OS notification subsystem,
or HTTPS.

---

## Web Push notifications

Push notifications require **HTTPS** (or `localhost`), a service worker
registered in production-mode build, and a browser that supports the Push API.

### Prerequisites

1. A production build behind HTTPS (Caddy, ngrok, or any reverse proxy):
   ```bash
   docker compose -f docker-compose.full.yml up -d
   ```
   …OR locally on `http://localhost:3000` (Push works on localhost without HTTPS):
   ```bash
   npm run build && npm run preview
   ```
2. A logged-in user account.
3. At least one baby with a `desiredWakeTime` set and a wake window appropriate
   for the baby's age (the seed defaults are fine).

### Smoke test: subscribe + receive

1. Open the app in a Chrome/Firefox/Edge browser, log in.
2. Navigate to `/account/notifications`. Click **Enable wake-window alerts**.
3. When the browser prompts for notification permission, click **Allow**.
4. Confirm the UI flips to "Alerts active on this device.".
5. Refresh the page. Confirm the device appears in the **Subscribed devices**
   list with its user-agent string and the timestamp matches "now".
6. Open `/app/babies/{id}/today`. Save a `wakeTime` in the past whose elapsed
   time + the awake window is just past `now()` (so the scheduler queues a
   row that fires within ~30 s).
   - Easier alternative: directly insert a `scheduled_pushes` row via sqlite3:
     ```bash
     docker compose exec app sqlite3 /data/babysleep.sqlite \
       "INSERT INTO scheduled_pushes (baby_id, kind, fire_at, created_at)
        VALUES (1, 'wake_window_exceeded', unixepoch(), unixepoch());"
     ```
7. Within 30 seconds you should see:
   - **If the Today tab for THAT baby is focused:** an in-page highlight pulse
     on the Enable button area (the push is intercepted and posted to the page).
   - **Otherwise:** an OS-level notification with title `{baby name}: wake
     window exceeded` (EN) or `{name} : fenêtre d'éveil dépassée` (FR).
8. Click the notification. Confirm it focuses the matching Today tab (or opens
   a new one if none was open).

### Smoke test: revoke

1. From `/account/notifications`, click **Revoke** next to a device.
2. Confirm the row disappears from the list.
3. Trigger a push (step 6 above). The revoked device must NOT receive it.

### Smoke test: locale switch

1. Switch your account locale (`/account` → Language → English / Français).
2. Trigger a new push (re-insert a `scheduled_pushes` row or save a new wake
   time). The notification body must be in the newly selected locale.

### Smoke test: iOS

iOS 16.4+ supports Web Push, but ONLY when the app is installed to the home
screen (PWA standalone mode).

1. Open the app on iOS Safari.
2. Share → **Add to Home Screen**.
3. Open the installed app (NOT Safari).
4. Navigate to `/account/notifications`. The Enable button should be present
   (in plain Safari, you'd see the "add to home screen" hint instead).
5. Tap it, grant permission, follow steps 6-8 from the desktop smoke test.

### Common failure modes

- **`pushManager.subscribe()` rejects with `NotAllowedError`:** the user
  blocked notifications. Reset via the browser's site settings.
- **No notification arrives within 30 s:** check the server logs for
  `[push] scanAndFire failed`. Verify the `scheduled_pushes` row has
  `fired_at IS NULL` and `fire_at <= now()`.
- **Notification fires repeatedly:** the scheduler's `firedAt` write may be
  failing. Inspect with `sqlite3 /data/babysleep.sqlite "SELECT * FROM
  scheduled_pushes ORDER BY id DESC LIMIT 5;"`.
- **Push delivery returns 4xx (logged as `dead`):** the subscription's
  endpoint was deleted. Re-enable from `/account/notifications`.
- **Apple/Mozilla push service rejects with `BadJwt`:** check that
  `VAPID_SUBJECT` is a valid `mailto:` URL.

### Clearing all subscriptions (dev convenience)

```bash
docker compose exec app sqlite3 /data/babysleep.sqlite \
  "DELETE FROM push_subscriptions; DELETE FROM scheduled_pushes;"
```

Forces every device to re-subscribe on next opt-in.
