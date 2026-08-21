import re

with open('server.ts', 'r') as f:
    content = f.read()

# Add a debounced saveStats function or just save immediately.
save_stats_func = """
let statsSaveTimeout: any = null;
function triggerStatsSave() {
  if (statsSaveTimeout) clearTimeout(statsSaveTimeout);
  statsSaveTimeout = setTimeout(() => {
    setDoc('settings', 'globalStats', stateStats).catch(e => logger.error('Failed to save stats', e));
  }, 5000);
}
"""

if "function triggerStatsSave" not in content:
    content = content.replace("let stateStats: AnalyticsStats =", save_stats_func + "\nlet stateStats: AnalyticsStats =")

# Add triggerStatsSave() to /api/track and /api/data
content = content.replace("stateStats.totalClicks += 1;", "stateStats.totalClicks += 1; triggerStatsSave();")
content = content.replace("stateStats.totalPromoCopies += 1;", "stateStats.totalPromoCopies += 1; triggerStatsSave();")
content = content.replace("stateStats.totalVisits += 1;", "stateStats.totalVisits += 1; triggerStatsSave();")

with open('server.ts', 'w') as f:
    f.write(content)
