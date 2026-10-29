# Analytics SDK frontend

The browser tracker is initialized before React renders. It queues events and
POSTs them as `{ "events": [...] }` to `/api/v1/events`. Every event includes a
unique `event_id` UUID and the install's `distinct_id` UUID (stable for the
current page session), along with `event_name`, `properties`, `timestamp`, and
`page_url`. During Vite
development, the `/api` proxy in `vite.config.js` forwards that request to
`http://127.0.0.1:8000`, so the browser uses the Vite origin and does not need
cross-origin access to Laravel.

## Run locally

1. Start the Laravel API on `http://127.0.0.1:8000` and ensure it exposes
   `POST /api/v1/events`.
2. Start the frontend with `npm run dev` and open the Vite URL (normally
   `http://localhost:5173`).
3. Add a menu item, then click **Checkout**. Checkout queues an `order_created`
   event and waits for the SDK's immediate flush request.

To use a different backend in development, set `VITE_ANALYTICS_ENDPOINT` in a
local `.env` file. For example, `VITE_ANALYTICS_ENDPOINT=/api/v1/events` uses
the Vite proxy. A direct URL such as
`VITE_ANALYTICS_ENDPOINT=http://127.0.0.1:8000/api/v1/events` bypasses the
proxy; in that case, configure Laravel CORS to allow the frontend origin
`http://localhost:5173`, the `POST` method, the `Content-Type` header, and
preflight `OPTIONS` requests for `/api/*`. Restart Vite after changing an
environment variable.

## Debug in the browser

1. Open DevTools before clicking Checkout. In **Console**, run
   `window.Analytics` to confirm the tracker was initialized.
2. Add an item and run `window.Analytics.getQueue()`. The returned array should
   contain the `menu_item_clicked` event.
3. Click Checkout. The checkout handler adds `order_created` and awaits
   `flush()`.
4. In **Network**, select **Fetch/XHR** and filter for `/api/v1/events`. With
   the Vite proxy, the request URL starts with the Vite origin, for example
   `http://localhost:5173/api/v1/events`. Inspect **Payload** and confirm the
   JSON has an `events` array, and each event has non-empty `event_id` and
   `distinct_id` values. The queue should then be empty:
   `window.Analytics.getQueue()`.
5. Inspect the response status and Laravel logs. A failed request is logged in
   the Console and its events remain queued for inspection/retry.

If no request appears, first check for errors in the Console and confirm
`window.Analytics` is not `undefined`. If the request appears but fails, check
that Laravel is listening on port 8000, that the route accepts the expected
JSON shape, and that Vite's `/api` proxy target is correct. If using the direct
URL instead of the proxy, a CORS/preflight failure must be fixed in Laravel.
