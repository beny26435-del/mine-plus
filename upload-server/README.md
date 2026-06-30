# Mine Plus Upload Server

این سرویس کوچک روی VPS اجرا می‌شود و عکس/ویدیوهای فرم تعمیرات و تصویر محصولات Mine Plus را ذخیره می‌کند. سایت اصلی روی Vercel می‌ماند و فقط URL فایل‌ها را ذخیره می‌کند.

## نصب روی VPS

```bash
cd /var/www
git clone https://github.com/beny26435-del/mine-plus.git mine-plus
cd /var/www/mine-plus/upload-server
npm install --omit=dev
cp .env.example .env
nano .env
```

نمونه `.env`:

```env
UPLOAD_API_KEY="replace-with-strong-secret"
PUBLIC_BASE_URL="https://mineplus.arcdailylotto.fun"
PORT=4001
UPLOAD_DIR="/var/www/mineplus-files/uploads"
ALLOWED_ORIGINS="https://mine-plus.vercel.app,https://mineplus.vercel.app,http://localhost:3000,http://localhost:3001"
```

پوشه فایل‌ها:

```bash
sudo mkdir -p /var/www/mineplus-files/uploads
sudo chown -R $USER:$USER /var/www/mineplus-files
```

## اجرا با PM2

```bash
npm install -g pm2
pm2 start npm --name mine-plus-upload -- start
pm2 save
pm2 startup
```

## Nginx

فایل `/etc/nginx/sites-available/mineplus-upload`:

```nginx
server {
  server_name mineplus.arcdailylotto.fun;

  client_max_body_size 60M;

  location / {
    proxy_pass http://127.0.0.1:4001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

فعال‌سازی:

```bash
sudo ln -s /etc/nginx/sites-available/mineplus-upload /etc/nginx/sites-enabled/mineplus-upload
sudo nginx -t
sudo systemctl reload nginx
```

## SSL

بعد از اینکه DNS ساب‌دامنه به IP سرور وصل شد:

```bash
sudo certbot --nginx -d mineplus.arcdailylotto.fun
```

## تست

```bash
curl https://mineplus.arcdailylotto.fun/health
```

تست آپلود:

```bash
curl -X POST "https://mineplus.arcdailylotto.fun/api/upload" \
  -H "x-api-key: replace-with-strong-secret" \
  -F "files=@/path/to/test.jpg"
```

## Envهای Vercel

```env
UPLOAD_API_URL="https://mineplus.arcdailylotto.fun/api/upload"
UPLOAD_PUBLIC_BASE_URL="https://mineplus.arcdailylotto.fun"
UPLOAD_API_KEY="same-as-vps"
```
