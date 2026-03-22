# Database Size Estimation & Hosting Plan Analysis

## 📋 Executive Summary

### Updated Calculation (600 Users with Files & Images)

**Database Size (Recommended Approach - External Storage):**

- **PostgreSQL Database**: ~200-250 MB (stores metadata only)
- **External File Storage**: ~390 MB (files + images in cloud storage)
- **Total Cost**: $10-15/month (Railway + Cloud Storage)

**Database Size (NOT Recommended - Direct Storage):**

- **PostgreSQL Database**: ~1-3.5 GB (stores files/images directly)
- **Total Cost**: $20-40/month (requires larger database plans)
- ⚠️ **Performance Impact**: Significant degradation with large binary data

### Key Findings:

- ✅ **Recommended**: Store files/images in cloud storage (S3/Cloudinary), store metadata in PostgreSQL
- ✅ **Database Size**: ~200-250 MB (well within 1 GB starter plans)
- ✅ **File Storage**: ~390 MB (can use free tier of Cloudinary or ~$0.10/month on S3)
- ✅ **Total Monthly Cost**: $10-15/month (Railway Starter + Cloud Storage)

---

## 📊 Database Size Calculation

### Current Data Overview

- **Questions**: ~8,766 questions (from 8266.csv, ~3.2 MB CSV file)
- **Database Type**: PostgreSQL
- **Application**: Medical Quiz Platform (SMLE/Prometric Prep)
- **Users**: 600 users
- **User Files**: 10 one-page files per user (6,000 total files)
- **User Images**: 1 image per user (600 total images)

### Database Tables Structure

#### 1. **questions** table

- **Columns**: id (INTEGER), question_text (TEXT), option1-4 (VARCHAR), question_type (VARCHAR), correct_option (VARCHAR), source (VARCHAR)
- **Estimated Row Size**: ~500-800 bytes per question (including text fields)
- **Current Records**: ~8,766 questions
- **Current Size**: ~4.4 - 7 MB (raw data)
- **With Indexes**: ~5.5 - 8.8 MB

#### 2. **accounts** table

- **Columns**: id, username, password (hashed), email, payment_status, created_at, updated_at, logged_date, isactive, terms_accepted
- **Estimated Row Size**: ~200-300 bytes per user
- **Projected Users**: 600 users
- **Size**: ~120-180 KB (raw data)
- **With Indexes**: ~150-225 KB

#### 3. **user_quiz_sessions** table

- **Columns**: id, session_id (UUID), user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, topics_covered, source, question_ids (ARRAY), quiz_type, difficulty_level, device_type, fastest_question_time, slowest_question_time, session_metadata (JSONB), start_time, end_time
- **Estimated Row Size**: ~500-800 bytes per session
- **Projected Sessions** (1 year): 30,000 sessions (assuming 50 sessions per user average for 600 users)
- **Size**: ~15-24 MB (raw data)
- **With Indexes**: ~19-30 MB

#### 4. **final_review_sessions** table

- **Columns**: id, session_id (UUID), user_id, question_type, source, total_questions, correct_answers, score, time_taken, time_limit, start_time, end_time, session_metadata (JSONB), question_ids (ARRAY), created_at
- **Estimated Row Size**: ~400-600 bytes per session
- **Projected Sessions** (1 year): 12,000 sessions (assuming 20 sessions per user for 600 users)
- **Size**: ~4.8-7.2 MB (raw data)
- **With Indexes**: ~6-9 MB

#### 5. **final_quiz_attempts** table

- **Columns**: id, session_id, question_id, user_answer, correct_answer, is_correct, time_taken, created_at
- **Estimated Row Size**: ~150-200 bytes per attempt
- **Projected Attempts** (1 year): 120,000 attempts (assuming 10 questions per session average for 12,000 sessions)
- **Size**: ~18-24 MB (raw data)
- **With Indexes**: ~22-30 MB

#### 6. **user_question_progress** table

- **Columns**: id, user_id, question_id, question_type, source, completed_at
- **Estimated Row Size**: ~100-150 bytes per record
- **Projected Records** (1 year): 300,000 records (assuming users complete 500 questions each on average for 600 users)
- **Size**: ~30-45 MB (raw data)
- **With Indexes**: ~37-56 MB

#### 7. **user_achievements** table

- **Columns**: id, user_id, achievement_type, achievement_key, achievement_name, achievement_description, earned_at
- **Estimated Row Size**: ~200-300 bytes per achievement
- **Projected Records** (1 year): 6,000 achievements (assuming 10 achievements per user for 600 users)
- **Size**: ~1.2-1.8 MB (raw data)
- **With Indexes**: ~1.5-2.3 MB

#### 8. **user_files** table (NEW - for storing user documents)

- **Columns**: id, user_id, file_name, file_type, file_size, file_path (or BYTEA for direct storage), uploaded_at, created_at
- **Estimated Row Size**:
  - **Option A (Metadata only - RECOMMENDED)**: ~200-300 bytes per file (stores file path/URL)
  - **Option B (Direct storage - NOT RECOMMENDED)**: ~50-200 KB per file (stores file as BYTEA)
- **Total Files**: 6,000 files (600 users × 10 files)
- **Size Option A (Metadata)**: ~1.2-1.8 MB (raw data) + ~1.5-2.3 MB (with indexes)
- **Size Option B (Direct Storage)**: ~300-1,200 MB (raw data) + ~375-1,500 MB (with indexes)
- **⚠️ Note**: Storing files directly in PostgreSQL is NOT recommended. Use cloud storage (S3, Cloudinary) and store file paths/URLs in the database.

#### 9. **user_images** table (NEW - for storing user profile/images)

- **Columns**: id, user_id, image_name, image_type, image_size, image_path (or BYTEA for direct storage), uploaded_at, created_at
- **Estimated Row Size**:
  - **Option A (Metadata only - RECOMMENDED)**: ~150-250 bytes per image (stores image path/URL)
  - **Option B (Direct storage - NOT RECOMMENDED)**: ~100-200 KB per image (stores image as BYTEA)
- **Total Images**: 600 images (600 users × 1 image)
- **Size Option A (Metadata)**: ~90-150 KB (raw data) + ~112-188 KB (with indexes)
- **Size Option B (Direct Storage)**: ~60-120 MB (raw data) + ~75-150 MB (with indexes)
- **⚠️ Note**: Storing images directly in PostgreSQL is NOT recommended. Use cloud storage (S3, Cloudinary, Imgur) and store image URLs in the database.

#### 10. **temporary_signup_links** & **temp_link_accounts** tables

- **Estimated Size**: ~1-2 MB (minimal data)

### Total Database Size Estimation

#### Year 1 Projection (WITHOUT storing files/images in database - RECOMMENDED):

**Scenario A: Files/Images stored externally (Cloud Storage) - RECOMMENDED**

- **Raw Data**: ~70-100 MB (includes file/image metadata only)
- **With Indexes (25% overhead)**: ~88-125 MB
- **With PostgreSQL Overhead (20%)**: ~105-150 MB
- **Backups & Logs (50% buffer)**: ~158-225 MB

**Conservative Estimate: ~200-250 MB** for Year 1

**External Storage Requirements (Cloud Storage - S3/Cloudinary/etc.):**

- **User Files**: 6,000 files × ~50 KB average = ~300 MB
- **User Images**: 600 images × ~150 KB average = ~90 MB
- **Total External Storage**: ~390 MB
- **Cost**: ~$0.10-0.50/month (S3) or included in hosting plans

#### Year 1 Projection (WITH files/images stored directly in PostgreSQL - NOT RECOMMENDED):

**Scenario B: Files/Images stored directly in database - NOT RECOMMENDED**

- **Raw Data**: ~470-1,520 MB (includes files/images as BYTEA)
- **With Indexes (25% overhead)**: ~588-1,900 MB
- **With PostgreSQL Overhead (20%)**: ~706-2,280 MB
- **Backups & Logs (50% buffer)**: ~1,059-3,420 MB

**Conservative Estimate: ~1-3.5 GB** for Year 1
**⚠️ This approach is NOT recommended** - PostgreSQL performance degrades significantly with large binary data.

#### Year 2-3 Projection (with growth):

- Assuming 2x user growth (1,200 users) and 1.5x session growth
- **Scenario A (External Storage)**: ~400-600 MB database + ~780 MB external storage
- **Scenario B (Direct Storage)**: ~2-7 GB database (NOT RECOMMENDED)

### 📋 Storage Strategy Recommendation

**✅ RECOMMENDED APPROACH:**

1. **PostgreSQL Database**: Store only metadata (file paths, URLs, file names, sizes)
2. **Cloud Storage**: Store actual files/images in:
   - **AWS S3**: ~$0.023/GB/month + transfer costs
   - **Cloudinary**: Free tier (25 GB storage, 25 GB bandwidth)
   - **DigitalOcean Spaces**: ~$5/month (250 GB storage)
   - **Supabase Storage**: Included with Supabase plans

**Benefits:**

- ✅ Better database performance
- ✅ Lower database costs
- ✅ Better scalability
- ✅ CDN integration for faster file delivery
- ✅ Easier backup and management

---

## 🌐 Hosting Plans Comparison

### Option 1: Modern Full-Stack Platforms (Recommended)

#### **Railway.app** ⭐ TOP RECOMMENDATION

- **PostgreSQL Database**:
  - Starter: $5/month (1 GB storage, 256 MB RAM)
  - Pro: $20/month (10 GB storage, 1 GB RAM)
- **Node.js Backend**:
  - Hobby: $5/month (512 MB RAM)
  - Pro: $20/month (2 GB RAM)
- **Frontend (React)**:
  - Can deploy on Railway or use Vercel (free)
- **Total Cost**: $10-40/month
- **Pros**:
  - Easy deployment, automatic SSL, great DX
  - PostgreSQL included, simple scaling
  - Free tier available for testing
- **Cons**: Can get expensive with high traffic

#### **Render.com**

- **PostgreSQL Database**:
  - Free: $0 (90 days, then paused)
  - Starter: $7/month (1 GB storage, 256 MB RAM)
  - Standard: $20/month (10 GB storage, 1 GB RAM)
- **Web Service (Node.js)**:
  - Free: $0 (spins down after inactivity)
  - Starter: $7/month (512 MB RAM)
  - Standard: $25/month (2 GB RAM)
- **Static Site (React)**: Free
- **Total Cost**: $14-45/month
- **Pros**:
  - Free tier for testing, good documentation
  - Automatic SSL, easy deployments
- **Cons**: Free tier has limitations

#### **Vercel (Frontend) + Supabase (Database)**

- **Vercel Frontend**: Free (Hobby) or $20/month (Pro)
- **Supabase PostgreSQL**:
  - Free: $0 (500 MB database, 2 projects)
  - Pro: $25/month (8 GB database, unlimited projects)
- **Total Cost**: $0-45/month
- **Pros**:
  - Excellent free tier, great performance
  - Supabase has built-in auth and real-time features
- **Cons**: Need to manage two services

#### **Koyeb** ⭐ NEW OPTION

- **PostgreSQL Database**:
  - Free Tier: $0 (1 database service, 50 hours/month, PostgreSQL 14/15/16)
  - Pay-as-you-go: ~$0.000006/second (~$15-20/month for 24/7 usage)
  
- **Web Service (Node.js Backend)**:
  - Free Tier: $0 (1 web service included)
  - Pay-as-you-go: Usage-based pricing
- **Frontend (React)**: Can deploy as static site or web service
- **Total Cost**: $0/month (Free tier) or ~$15-30/month (24/7 usage)
- **Regions**: Frankfurt (Germany), Washington D.C. (USA), Singapore
- **Pros**:
  - ✅ **Excellent free tier** - 1 database + 1 web service free
  - ✅ Serverless, auto-scaling platform
  - ✅ Databases sleep after 5 minutes inactivity (saves costs)
  - ✅ Supports PostgreSQL 14, 15, 16
  - ✅ Fault-tolerant and scalable
  - ✅ Simple deployment process
- **Cons**:
  - ⚠️ Databases sleep after inactivity (minor wake-up delay)
  - ⚠️ Pay-as-you-go can be unpredictable for high-traffic apps
  - ⚠️ Limited to 50 hours/month on free tier
- **Best For**:
  - MVPs and testing (free tier)
  - Low to medium traffic applications
  - Projects that can tolerate occasional cold starts

### Option 2: Managed PostgreSQL + VPS

#### **DigitalOcean**

- **PostgreSQL Managed Database**:
  - Basic: $15/month (1 GB RAM, 10 GB storage)
  - Standard: $60/month (2 GB RAM, 25 GB storage)
- **Droplet (VPS) for Backend**:
  - Basic: $6/month (1 GB RAM, 25 GB SSD)
  - Standard: $12/month (2 GB RAM, 50 GB SSD)
- **Total Cost**: $21-72/month
- **Pros**:
  - Reliable, good performance, predictable pricing
  - Full control, scalable
- **Cons**: Requires more setup and maintenance

#### **AWS (Amazon Web Services)**

- **RDS PostgreSQL**:
  - db.t3.micro: ~$15/month (1 GB RAM, 20 GB storage)
  - db.t3.small: ~$30/month (2 GB RAM, 20 GB storage)
- **EC2 for Backend**:
  - t3.micro: ~$8/month (1 GB RAM)
  - t3.small: ~$15/month (2 GB RAM)
- **S3 for Frontend**: ~$1-5/month
- **Total Cost**: $24-50/month
- **Pros**:
  - Highly scalable, enterprise-grade
  - Extensive services and integrations
- **Cons**: Complex pricing, can get expensive, steep learning curve

#### **Heroku**

- **PostgreSQL Database**:
  - Mini: $5/month (64 MB RAM, 10 GB storage)
  - Standard: $50/month (1 GB RAM, 64 GB storage)
- **Dyno (Backend)**:
  - Eco: $5/month (512 MB RAM)
  - Basic: $7/month (512 MB RAM)
- **Total Cost**: $10-57/month
- **Pros**:
  - Easy deployment, great developer experience
  - Add-ons ecosystem
- **Cons**:
  - Expensive for production, dynos sleep on free tier
  - Recently discontinued free tier

### Option 3: All-in-One VPS Solutions

#### **Linode / Akamai**

- **VPS with PostgreSQL**:
  - Shared CPU: $5/month (1 GB RAM, 25 GB SSD)
  - Dedicated CPU: $12/month (2 GB RAM, 50 GB SSD)
- **Total Cost**: $5-12/month (self-managed)
- **Pros**:
  - Very affordable, full control
  - Good performance
- **Cons**:
  - Requires server management
  - No managed database (self-hosted)

#### **Vultr**

- **VPS**:
  - Regular: $6/month (1 GB RAM, 25 GB SSD)
  - High Performance: $12/month (2 GB RAM, 55 GB SSD)
- **Total Cost**: $6-12/month (self-managed)
- **Pros**:
  - Affordable, good performance, global locations
- **Cons**: Self-managed, requires technical knowledge

### Option 4: Specialized Database Hosting

#### **Neon (Serverless PostgreSQL)**

- **Free Tier**: $0 (0.5 GB storage, 1 project)
- **Launch**: $19/month (10 GB storage, unlimited projects)
- **Scale**: $69/month (50 GB storage, better performance)
- **Pros**:
  - Serverless, auto-scaling, branching
  - Great for modern apps
- **Cons**:
  - Still need separate hosting for backend
  - Can be expensive at scale

#### **Supabase**

- **Free**: $0 (500 MB database, 2 projects)
- **Pro**: $25/month (8 GB database, unlimited projects)
- **Team**: $599/month (40 GB database, team features)
- **Pros**:
  - Includes auth, storage, real-time
  - Great developer experience
- **Cons**:
  - Need separate backend hosting
  - Can get expensive

---

## 💡 Recommendations

### 🥇 **Best for Startups/Small Projects: Railway.app**

**Total: ~$10-20/month**

- Easy setup, PostgreSQL included
- Good free tier for testing
- Scales well as you grow
- Perfect for Node.js + React + PostgreSQL stack

### 🥈 **Best Budget Option: Render.com**

**Total: ~$14/month (Starter)**

- Free tier available for testing
- Good balance of features and price
- Easy deployment process

### 🥉 **Best for Growth: DigitalOcean**

**Total: ~$21-30/month**

- Reliable and scalable
- Predictable pricing
- Good performance
- Full control over infrastructure

### 🏆 **Best Free Option: Vercel + Supabase**

**Total: $0/month (Free tier)**

- Excellent for MVP/testing
- Upgrade to Pro when needed ($45/month)
- Great performance and developer experience

### 💼 **Best for Enterprise: AWS**

**Total: ~$24-50/month**

- Highly scalable
- Enterprise-grade reliability
- Extensive ecosystem
- Requires technical expertise

---

## 📋 Hosting Plan Selection Guide

### Choose **Railway/Render** if:

- ✅ You want easy deployment
- ✅ You prefer managed services
- ✅ You're building an MVP or small app
- ✅ You want to focus on development, not infrastructure

### Choose **DigitalOcean/Vultr** if:

- ✅ You need more control
- ✅ You have DevOps experience
- ✅ You want predictable costs
- ✅ You're comfortable managing servers

### Choose **Vercel + Supabase** if:

- ✅ You want the best free tier
- ✅ You need modern features (auth, real-time)
- ✅ You're building a JAMstack app
- ✅ You want excellent performance

### Choose **AWS** if:

- ✅ You need enterprise features
- ✅ You expect massive scale
- ✅ You have AWS expertise
- ✅ You need compliance/security features

---

## 📊 Cost Comparison Summary

| Provider              | Monthly Cost | Database       | Backend     | Frontend    | Best For   |
| --------------------- | ------------ | -------------- | ----------- | ----------- | ---------- |
| **Railway**           | $10-40       | ✅ Included    | ✅ Included | ✅ Included | Startups   |
| **Render**            | $14-45       | ✅ Included    | ✅ Included | ✅ Free     | Budget     |
| **Vercel + Supabase** | $0-45        | ✅ Supabase    | ⚠️ Separate | ✅ Vercel   | Free Tier  |
| **DigitalOcean**      | $21-72       | ✅ Managed     | ✅ VPS      | ⚠️ Separate | Growth     |
| **AWS**               | $24-50+      | ✅ RDS         | ✅ EC2      | ✅ S3/CF    | Enterprise |
| **Heroku**            | $10-57       | ✅ Included    | ✅ Included | ⚠️ Separate | Legacy     |
| **Vultr/Linode**      | $6-12        | ⚠️ Self-hosted | ✅ VPS      | ⚠️ Separate | Budget VPS |

---

## 🎯 Final Recommendation

### **For Your MEDQIZE Project:**

**Start with Railway.app** ($10-20/month):

1. **PostgreSQL Database**: $5/month (Starter plan - 1 GB storage) ✅ Sufficient for ~200-250 MB database
2. **Node.js Backend**: $5/month (Hobby plan - 512 MB RAM)
3. **React Frontend**: Deploy on Railway or Vercel (free)
4. **File Storage**: Use Railway's included storage or add S3/Cloudinary (~$0-5/month)

**Why Railway?**

- ✅ Perfect for Node.js + PostgreSQL stack
- ✅ Easy deployment (Git push to deploy)
- ✅ Automatic SSL certificates
- ✅ Built-in monitoring and logs
- ✅ Scales automatically
- ✅ Great developer experience
- ✅ Free $5 credit monthly (can cover one service)

**Migration Path:**

**Recommended Path:**

- **Phase 1 (MVP/Testing)**: Koyeb Free Tier ($0/month) - Test your application
- **Phase 2 (Launch)**: Railway Starter ($10/month) + Cloud Storage ($0-5/month) = **$10-15/month**
- **Phase 3 (Growth)**: Railway Pro ($40/month) if traffic grows + Cloud Storage ($0-10/month) = **$40-50/month**
- **Phase 4 (Scale)**: Consider DigitalOcean or AWS if you need more control

**Alternative Path:**

- **Year 1**: Railway Starter ($10/month) + Cloud Storage ($0-5/month) = **$10-15/month**
- **Year 2**: Railway Pro ($40/month) if traffic grows + Cloud Storage ($0-10/month) = **$40-50/month**
- **Year 3+**: Consider DigitalOcean or AWS if you need more control

**File Storage Options:**

- **Free Tier**: Cloudinary (25 GB free) or Supabase Storage (included)
- **Paid**: AWS S3 (~$0.10/month for 390 MB) or DigitalOcean Spaces ($5/month for 250 GB)

---

## 📝 Additional Considerations

### Storage Requirements:

#### Database Storage (PostgreSQL):

- **Year 1 (Recommended - External Storage)**: ~200-250 MB - Current plans sufficient
- **Year 1 (NOT Recommended - Direct Storage)**: ~1-3.5 GB - Requires larger plans
- **Year 2-3**: ~400-600 MB (external storage) or ~2-7 GB (direct storage)
- **Backups**: Factor in 2-3x storage for backups

#### External File Storage (Cloud Storage):

- **Year 1**: ~390 MB (files + images)
- **Year 2-3**: ~780 MB (with growth)
- **Cost**: ~$0.10-0.50/month (S3) or included in hosting plans

### Traffic Estimates:

- **Low Traffic** (< 1,000 users/month): Railway Starter, Render Starter
- **Medium Traffic** (1,000-10,000 users/month): Railway Pro, Render Standard
- **High Traffic** (> 10,000 users/month): DigitalOcean, AWS

### Backup Strategy:

- Most managed services include automated backups
- Consider additional backup storage (S3, etc.) for critical data
- Budget: +$2-5/month for backup storage

---

## 🔗 Quick Links

- **Koyeb**: https://www.koyeb.com (Database Services: https://app.koyeb.com/database-services)
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Vercel**: https://vercel.com
- **Supabase**: https://supabase.com
- **DigitalOcean**: https://digitalocean.com
- **Neon**: https://neon.tech
- **AWS**: https://aws.amazon.com

---

_Last Updated: January 2024_
_Note: Prices are approximate and may vary. Check provider websites for current pricing._
