# DEPLOYMENT.md — Production Deployment & Hosting Runbook

**Project:** Visa Convention — Official Website  
**Client:** Visa Convention (Hanumangarh, Rajasthan, India & Global)  
**Architecture:** Static Site Generation (Astro 5 + Tailwind CSS v4 + TypeScript)  
**Status:** READY FOR PRODUCTION DEPLOYMENT (Awaiting Explicit User Approval)

---

## 1. Hosting Provider Recommendation & Architectural Fit

Based on Visa Convention's static-first architecture, traffic expectations, zero-database requirement, low maintenance needs, and zero-cost operational profile, the following hosting platforms are recommended:

### Recommended Primary Host: Cloudflare Pages
| Evaluation Criteria | Cloudflare Pages Specification | Benefit for Visa Convention |
| :--- | :--- | :--- |
| **Hosting Cost** | Free Tier (Unlimited bandwidth & requests) | \$0/month ongoing operational hosting cost |
| **Global CDN Distribution** | 330+ Edge PoPs (including Indian Edge nodes in Delhi, Mumbai, Chennai) | Ultra-fast Time to First Byte (TTFB < 50ms in Rajasthan) |
| **SSL / HTTPS** | Automated edge TLS 1.3 certificates with automatic renewal | Zero manual certificate management or renewal fees |
| **Git Integration** | Automated continuous deployment from GitHub / GitLab | Instant builds upon pushing content updates |
| **DDoS Protection** | Industry-leading unmetered enterprise DDoS mitigation | Resilient against traffic spikes and malicious bot floods |
| **Forms & Edge Functions** | Native Cloudflare Workers integration for lead webhooks | Secure, serverless form forwarding without a database |

### Alternative Host: Netlify Edge
- **Pros:** Native Astro integration, built-in forms handling, instant deploy previews, branch deploys.
- **Cost:** Free Starter Tier (100 GB bandwidth / 300 build minutes per month).
- **Ideal For:** Teams wanting drag-and-drop manual deployments alongside Git workflows.

---

## 2. Account Ownership & Client Domain Governance

> [!IMPORTANT]
> **Client Ownership Principle:**  
> The client (Visa Convention) must maintain direct ownership and billing control of:
> 1. The Domain Registrar account (e.g., Cloudflare Registrar, Namecheap, GoDaddy, Google Domains / Squarespace).
> 2. The Cloud Hosting account (Cloudflare or Netlify).
> 3. Official business email Google Workspace / Microsoft 365 accounts.
> 
> *The developer or development agency should never own the client's domain registration or payment credentials.*

---

## 3. Step-by-Step Deployment Guide (Cloudflare Pages)

### Step 1: Connect GitHub Repository
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) under the client's account.
2. In the left navigation, select **Compute (Workers & Pages)** $\rightarrow$ **Pages**.
3. Click **Create Application** $\rightarrow$ **Connect to Git**.
4. Select the repository: `visa-convention-wesbite` (or your production organization repo).

### Step 2: Configure Build Settings
Fill in the build configuration fields exactly as follows:

| Field | Configuration Value |
| :--- | :--- |
| **Project Name** | `visa-convention` |
| **Production Branch** | `main` |
| **Framework Preset** | `Astro` |
| **Build Command** | `npm run build` |
| **Build Output Directory** | `dist` |
| **Root Directory** | `/` (leave blank or default) |
| **Node.js Version** | `20.x` or `22.x` |

### Step 3: Production Environment Variables
Under **Settings** $\rightarrow$ **Environment Variables**, add the following:

| Variable Name | Production Value | Description |
| :--- | :--- | :--- |
| **`PUBLIC_SITE_URL`** | `https://visaconvention.com` | Canonical production domain for sitemaps and Open Graph |
| **`NODE_VERSION`** | `20.18.0` | Enforces LTS Node.js build runtime |
| **`LEAD_WEBHOOK_URL`** | *(Optional client CRM / Zapier endpoint)* | Secure serverless lead notification target |

### Step 4: Run Initial Deployment
1. Click **Save and Deploy**.
2. Cloudflare Pages will clone the repo, install dependencies via `npm ci`, and execute `astro build`.
3. Build completes in approximately 25–40 seconds.
4. Cloudflare provisions a temporary preview domain: `https://visa-convention.pages.dev`.

---

## 4. Custom Domain Binding & DNS Configuration

Once the preview URL is verified, bind the official domain (`visaconvention.com`):

### Option A: Cloudflare as DNS Provider (Recommended)
1. Add the domain `visaconvention.com` to Cloudflare DNS.
2. In the Pages project, navigate to **Custom Domains** $\rightarrow$ **Set up a domain**.
3. Enter `visaconvention.com` and `www.visaconvention.com`.
4. Cloudflare automatically provisions the CNAME and Apex flattening records with automated SSL.

### Option B: External DNS Provider (e.g., Namecheap, GoDaddy)
Configure the following DNS records at your registrar:

| Record Type | Name / Host | Target / Value | TTL | Proxy Status |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `visa-convention.pages.dev` | Automatic / 300 | Proxied / Yes |
| **CNAME / ALIAS** | `@` (Apex) | `visa-convention.pages.dev` | Automatic / 300 | Proxied / Yes |

---

## 5. Security & HTTPS Hardening

Ensure the following security rules are active in your hosting dashboard:
1. **Always Use HTTPS:** Redirect all incoming HTTP requests (`http://visaconvention.com/*` $\rightarrow$ `https://visaconvention.com/*`) with status 301.
2. **Minimum TLS Version:** Set to **TLS 1.2** or **TLS 1.3**.
3. **HTTP Strict Transport Security (HSTS):** Enable with `max-age=31536000; includeSubDomains; preload`.
4. **Security Headers:**
   Configure a `public/_headers` file for Cloudflare Pages:
   ```text
   /*
     X-Frame-Options: SAMEORIGIN
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: geolocation=(), camera=(), microphone=()
   ```

---

## 6. Rollback & Disaster Recovery Runbook

### Instant Rollback (Zero Downtime)
If an erroneous commit is pushed to production:
1. Open Cloudflare Pages $\rightarrow$ Project **Deployments**.
2. Locate the last known good deployment (e.g., Commit `7cd597c`).
3. Click the **three dots (...)** next to that deployment and select **Rollback to this deployment**.
4. Cloudflare instantly points the edge CDN routing to the previous build in under 2 seconds.

### Local Backup & Offline Storage
Keep a local copy of the compiled `dist/` folder and the client data repositories:
- `client-content/countries/countries.json`
- `client-content/universities/universities.csv` & `.json`
- `client-content/leads/enquiries.json`
