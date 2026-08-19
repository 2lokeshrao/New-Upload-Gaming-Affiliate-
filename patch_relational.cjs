const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const regexRead = /async function readDataFile\(\) \{[\s\S]*?^async function writeDataFile/m;

const readReplacement = `
async function readDataFile() {
  const db = { platforms: {}, settings: { globalConfig: {} }, custom_pages: {}, sub_partners: {} };
  
  try {
    const pool = await getMysqlPool();
    if (!pool) throw new Error("No MySQL Pool");

    // 1. Fetch Global Config
    const [configRows] = await pool.query('SELECT * FROM global_config ORDER BY id DESC LIMIT 1');
    if (configRows && configRows.length > 0) {
      const gc = configRows[0];
      db.settings.globalConfig = {
        heroHeadline: gc.hero_headline || "Claim Your 100% Guaranteed Welcome Bonuses",
        heroSubheading: gc.hero_subheading || "Stop Wasting Money on Unverified Sites.",
        topBannerTemplate: gc.top_banner_template || "",
        enableSubPartnerProgram: !!gc.enable_sub_partner_program,
        subPartnerHeadline: gc.sub_partner_headline || "",
        copyrightText: gc.copyright_text || "© 2026 Bonus Promo Code. All rights reserved.",
        footerDisclaimerText: gc.footer_disclaimer_text || "",
        telegramUrl: gc.telegram_url || "",
        instagramUrl: gc.instagram_url || "",
        tiktokUrl: gc.tiktok_url || "",
        whatsappGroupUrl: gc.whatsapp_group_url || "",
        youtubeUrl: gc.youtube_url || "",
        articles: []
      };
    }

    // 2. Fetch Platforms
    const [platformRows] = await pool.query('SELECT * FROM platforms');
    if (platformRows) {
      for (const r of platformRows) {
        db.platforms[r.id] = {
          id: r.id,
          slug: r.slug,
          name: r.name,
          logoUrl: r.logo_url,
          rating: Number(r.rating) || 0,
          starRating: r.star_rating || 5,
          bonusText: r.bonus_text,
          promoCode: r.promo_code,
          rawAffiliateUrl: r.raw_affiliate_url,
          masterPartnerUrl: r.master_partner_url,
          claimUrl: r.claim_url,
          reviewContent: r.review_content,
          isFeatured: !!r.is_featured,
          featuredRank: r.featured_rank,
          isActive: !!r.is_active,
          clicksCount: r.clicks_count || 0,
          copiesCount: r.copies_count || 0,
          category: r.category,
          bonusTitle: r.bonus_title,
          minDeposit: r.min_deposit,
          metaTitle: r.meta_title,
          metaDescription: r.meta_description,
          metaKeywords: r.meta_keywords,
          averageUserRating: Number(r.average_user_rating) || 0,
          totalReviewsCount: r.total_reviews_count || 0
        };
      }
    }

    // 3. Fetch Custom Pages
    const [pageRows] = await pool.query('SELECT * FROM custom_pages');
    if (pageRows) {
      for (const r of pageRows) {
        db.custom_pages[r.slug] = {
          id: r.id,
          slug: r.slug,
          title: r.title,
          content: r.content,
          isActive: !!r.is_active
        };
      }
    }

    // 4. Fetch Sub Partners
    const [subRows] = await pool.query('SELECT * FROM sub_partners');
    if (subRows) {
      for (const r of subRows) {
        db.sub_partners[r.id] = {
          id: r.id,
          fullName: r.full_name,
          email: r.email,
          whatsapp: r.whatsapp,
          platformId: r.platform_id,
          platformName: r.platform_name,
          trafficSource: r.traffic_source,
          estimatedMonthlyPlayers: r.estimated_monthly_players,
          status: r.status,
          appliedAt: r.applied_at ? new Date(r.applied_at).toISOString() : new Date().toISOString()
        };
      }
    }

    // 5. Fetch Articles
    const [articleRows] = await pool.query('SELECT * FROM articles');
    let articlesData = [];
    if (articleRows) {
      articlesData = articleRows.map(r => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        content: r.content,
        category: r.category,
        platformId: r.platform_id || undefined,
        platformName: r.platform_name || undefined,
        metaTitle: r.meta_title,
        metaDescription: r.meta_description,
        coverImage: r.cover_image || undefined,
        author: r.author || 'Admin',
        views: r.views || 0,
        status: r.status || 'published',
        publishedAt: r.published_at ? new Date(r.published_at).toISOString() : new Date().toISOString(),
        tags: []
      }));
    }

    // 6. Merge with JSON state (for complex fields like customCoupons, trackingPixels that aren't relational)
    try {
      const [jsonRows] = await pool.query('SELECT state_json FROM mysql_state_store WHERE id = 1');
      if (jsonRows && jsonRows.length > 0) {
        const fullJson = JSON.parse(jsonRows[0].state_json);
        
        // Map complex settings
        if (fullJson.settings && fullJson.settings.globalConfig) {
          db.settings.globalConfig = { ...fullJson.settings.globalConfig, ...db.settings.globalConfig };
        }
        db.settings.globalConfig.articles = articlesData; // Force override with relational data

        // Only use JSON platforms/pages if relational is completely empty
        if (Object.keys(db.platforms).length === 0 && fullJson.platforms) {
          db.platforms = fullJson.platforms;
        }
        if (Object.keys(db.custom_pages).length === 0 && fullJson.custom_pages) {
          db.custom_pages = fullJson.custom_pages;
        }
      }
    } catch(e) {}

  } catch(e) {
    logger.error('Error reading from MySQL relational tables', e);
  }

  // Seed Initial Data if Tables are Empty
  if (Object.keys(db.platforms).length === 0) {
     db.platforms = {};
     for (const p of initialPlatforms) db.platforms[p.id] = p;
     db.settings.globalConfig = initialGlobalConfig;
     for (const c of initialCustomPages) db.custom_pages[c.slug] = c;
     await writeDataFile(db); // Push to DB
  }

  return db;
}

async function writeDataFile`;

code = code.replace(regexRead, readReplacement.trim() + '\n');


const regexWrite = /async function writeDataFile\(data: any\) \{[\s\S]*?^async function setDoc/m;

const writeReplacement = `async function writeDataFile(data: any) {
  const jsonStr = JSON.stringify(data, null, 2);
  
  try {
    const pool = await getMysqlPool();
    if (pool) {
      // 1. Save Full JSON for backup & complex objects
      await pool.query(
        'INSERT INTO mysql_state_store (id, state_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE state_json = VALUES(state_json)',
        [jsonStr]
      );

      // 2. Sync Platforms to Relational Table
      if (data.platforms) {
        for (const p of Object.values(data.platforms) as any) {
          await pool.query(\`
            INSERT INTO platforms (id, slug, name, logo_url, rating, star_rating, bonus_text, promo_code, raw_affiliate_url, claim_url, master_partner_url, is_featured, is_active, category, bonus_title)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            name=VALUES(name), logo_url=VALUES(logo_url), rating=VALUES(rating), star_rating=VALUES(star_rating), bonus_text=VALUES(bonus_text), promo_code=VALUES(promo_code), raw_affiliate_url=VALUES(raw_affiliate_url), claim_url=VALUES(claim_url), master_partner_url=VALUES(master_partner_url), is_featured=VALUES(is_featured), is_active=VALUES(is_active), category=VALUES(category), bonus_title=VALUES(bonus_title)
          \`, [p.id, p.slug || p.id, p.name, p.logoUrl, p.rating||0, p.starRating||5, p.bonusText||'', p.promoCode||'', p.rawAffiliateUrl||'', p.claimUrl||'', p.masterPartnerUrl||'', p.isFeatured?1:0, p.isActive?1:0, p.category||'', p.bonusTitle||'']);
        }
      }

      // 3. Sync Global Config
      if (data.settings && data.settings.globalConfig) {
        const gc = data.settings.globalConfig;
        await pool.query(\`
          INSERT INTO global_config (id, hero_headline, hero_subheading, top_banner_template, enable_sub_partner_program, copyright_text)
          VALUES (1, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          hero_headline=VALUES(hero_headline), hero_subheading=VALUES(hero_subheading), top_banner_template=VALUES(top_banner_template), enable_sub_partner_program=VALUES(enable_sub_partner_program), copyright_text=VALUES(copyright_text)
        \`, [gc.heroHeadline || '', gc.heroSubheading || '', gc.topBannerTemplate || '', gc.enableSubPartnerProgram?1:0, gc.copyrightText || '']);
        
        // 4. Sync Articles
        if (gc.articles && Array.isArray(gc.articles)) {
          for (const a of gc.articles) {
            await pool.query(\`
              INSERT INTO articles (id, slug, title, content, category, platform_id, platform_name, meta_title, meta_description, cover_image, status, views)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
              title=VALUES(title), content=VALUES(content), category=VALUES(category), platform_id=VALUES(platform_id), platform_name=VALUES(platform_name), meta_title=VALUES(meta_title), meta_description=VALUES(meta_description), cover_image=VALUES(cover_image), status=VALUES(status), views=VALUES(views)
            \`, [a.id, a.slug, a.title, a.content, a.category||'', a.platformId||null, a.platformName||null, a.metaTitle||'', a.metaDescription||'', a.coverImage||null, a.status||'published', a.views||0]);
          }
        }
      }

      // 5. Sync Custom Pages
      if (data.custom_pages) {
        for (const cp of Object.values(data.custom_pages) as any) {
          await pool.query(\`
            INSERT INTO custom_pages (id, slug, title, content, is_active)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), is_active=VALUES(is_active)
          \`, [cp.id, cp.slug, cp.title, cp.content, cp.isActive?1:0]);
        }
      }

      return; 
    }
  } catch(e) {
    logger.error('Error writing to MySQL relational tables', e);
  }

  // Backup to File if SQL fails completely
  try {
    await fs.promises.writeFile(DATA_FILE, jsonStr);
  } catch (e) {}
}

async function setDoc`;

code = code.replace(regexWrite, writeReplacement);
fs.writeFileSync('server.ts', code, 'utf8');
console.log("Patched server.ts with full bidirectional relational DB mapping.");
