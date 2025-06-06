# Shiprocket Proxy for Shopify (Secure)

This is a secure Node.js backend to protect your Shiprocket API token when estimating delivery dates from your Shopify site.

## 🚀 How to Deploy on Render

1. Visit [https://render.com](https://render.com) and log in or sign up.
2. Click **New > Web Service**
3. Connect your GitHub account and select this repo (`shiprocket-proxy`)
4. Use the following settings:
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Root Directory: *(leave blank)*
   - Instance Type: **Free**

5. After deployment, go to **Environment** tab in Render and add:

```
Key: SHIPROCKET_TOKEN
Value: your_actual_token_here
```

6. Save and redeploy.

## 🧪 Test API

After deployment, you can test like this:

```
https://your-render-subdomain.onrender.com/check?pincode=641001
```
