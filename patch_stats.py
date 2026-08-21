import re

with open('server.ts', 'r') as f:
    content = f.read()

# Modify loadState to load stats
load_state_patch = """
    // 5. Load Stats
    const statsSnap = await getDoc('settings', 'globalStats');
    if (statsSnap) {
      stateStats = statsSnap as AnalyticsStats;
    } else {
      logger.info("Database missing globalStats: Seeding...");
      await setDoc('settings', 'globalStats', stateStats);
    }
"""
if "const statsSnap = await getDoc" not in content:
    content = content.replace('logger.info("Loaded state from MySQL Collections.");', load_state_patch + '\n    logger.info("Loaded state from MySQL Collections.");')

# Modify saveState to save stats
save_state_patch = """
    // 5. Sync Stats
    if (stateStats) {
      await setDoc('settings', 'globalStats', stateStats);
    }
"""
if "await setDoc('settings', 'globalStats', stateStats);" not in content:
    content = content.replace('logger.info("Successfully synced all in-memory state', save_state_patch + '\n    logger.info("Successfully synced all in-memory state')

# Add Reset API Endpoint
reset_api = """
app.post('/api/admin/reset-stats', verifyJwtToken, async (req, res) => {
  try {
    stateStats = { totalVisits: 0, totalClicks: 0, totalPromoCopies: 0, totalSubPartnerApps: 0, platformStats: {} };
    await setDoc('settings', 'globalStats', stateStats);
    res.json({ success: true, message: "Stats reset successfully", stats: stateStats });
  } catch (err) {
    logger.error("Error resetting stats", err);
    res.status(500).json({ error: "Failed to reset stats" });
  }
});
"""

if "/api/admin/reset-stats" not in content:
    # insert before app.get('/api/admin/data'
    content = content.replace("app.get('/api/admin/data', verifyJwtToken, (req, res) => {", reset_api + "\napp.get('/api/admin/data', verifyJwtToken, (req, res) => {")

with open('server.ts', 'w') as f:
    f.write(content)

