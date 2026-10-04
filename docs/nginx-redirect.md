# nginx: send http and www to https://parthdev.co.in in one hop

## Current behaviour (checked 4 Oct 2026)

| Request | Now | Should be |
|---|---|---|
| `http://parthdev.co.in` | 301 → `https://parthdev.co.in/` (1 hop) | same |
| `http://www.parthdev.co.in` | 301 → `https://www.parthdev.co.in/` | 301 → `https://parthdev.co.in/` (1 hop) |
| `https://www.parthdev.co.in` | **200, full site** (duplicate of the main domain) | 301 → `https://parthdev.co.in/` (1 hop) |

The https www host already has a valid certificate (curl accepted it), so only the server blocks need changing.

## 1. Find the current config and back it up

```bash
# Which file defines the parthdev.co.in server blocks?
sudo nginx -T 2>/dev/null | grep -nE "# configuration file|server_name"

# Back it up (replace the path with the one printed above)
sudo cp /etc/nginx/sites-available/parthdev.co.in /etc/nginx/sites-available/parthdev.co.in.bak-$(date +%F)
```

If Certbot manages the file, you will see lines ending in `# managed by Certbot`. Keep the `ssl_certificate` and `ssl_certificate_key` paths it already uses. Edit the existing blocks into the shape below rather than pasting a second copy, because two blocks with the same `server_name` and port conflict.

## 2. Target config

Three server blocks. Adjust the certificate paths and the upstream port (`3000` here) to match what you have now.

```nginx
# 1) Plain http, both hosts -> https apex. One hop.
server {
    listen 80;
    listen [::]:80;
    server_name parthdev.co.in www.parthdev.co.in;

    return 301 https://parthdev.co.in$request_uri;
}

# 2) https www -> https apex. One hop.
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.parthdev.co.in;

    ssl_certificate     /etc/letsencrypt/live/parthdev.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/parthdev.co.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://parthdev.co.in$request_uri;
}

# 3) The site itself.
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name parthdev.co.in;

    ssl_certificate     /etc/letsencrypt/live/parthdev.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/parthdev.co.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Notes:
- `proxy_pass` forwards the browser's `Accept` header by default. Do not strip it: `next/image` reads it to decide between AVIF and WebP. If you ever add `proxy_cache` for `/_next/image`, add `Accept` to the cache key.
- If the certificate does not list `www.parthdev.co.in`, block 2 will fail the TLS handshake. Check with `sudo certbot certificates`. If www is missing, run `sudo certbot --nginx -d parthdev.co.in -d www.parthdev.co.in` first.
- `http2 on;` needs nginx 1.25.1 or newer. The server reports 1.28.3, so it is fine. On older versions use `listen 443 ssl http2;` instead.

## 3. Test and reload

```bash
# Syntax check. Must print "syntax is ok" and "test is successful".
sudo nginx -t

# Reload without dropping connections.
sudo systemctl reload nginx
```

If `nginx -t` fails, do not reload. Fix the error, or restore the backup:

```bash
sudo cp /etc/nginx/sites-available/parthdev.co.in.bak-YYYY-MM-DD /etc/nginx/sites-available/parthdev.co.in
sudo nginx -t && sudo systemctl reload nginx
```

## 4. Verify from your own machine

```bash
for u in http://parthdev.co.in http://www.parthdev.co.in https://www.parthdev.co.in https://parthdev.co.in; do
  curl -sL -o /dev/null -w "$u -> %{url_effective}  hops=%{num_redirects}  code=%{http_code}\n" "$u"
done
```

Expected:

```
http://parthdev.co.in       -> https://parthdev.co.in/  hops=1  code=200
http://www.parthdev.co.in   -> https://parthdev.co.in/  hops=1  code=200
https://www.parthdev.co.in  -> https://parthdev.co.in/  hops=1  code=200
https://parthdev.co.in      -> https://parthdev.co.in/  hops=0  code=200
```

Paths must be kept, for example:

```bash
curl -sI https://www.parthdev.co.in/work?x=1 | grep -i location
# location: https://parthdev.co.in/work?x=1
```
