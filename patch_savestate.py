import re

with open('server.ts', 'r') as f:
    content = f.read()

new_save_state = """
async function saveState() {
  try {
    // 1. Sync Platforms
    if (Array.isArray(statePlatforms)) {
      for (const p of statePlatforms) {
        await setDoc('platforms', p.id, p);
      }
    }

    // 2. Sync Config
    if (stateConfig) {
      await setDoc('settings', 'globalConfig', stateConfig);
    }

    // 3. Sync Custom Pages
    if (Array.isArray(stateCustomPages)) {
      for (const cp of stateCustomPages) {
        await setDoc('custom_pages', cp.slug, cp);
      }
    }

    // 4. Sync Sub Partners
    if (Array.isArray(stateSubPartners)) {
      for (const sp of stateSubPartners) {
        await setDoc('sub_partners', sp.id, sp);
      }
    }

    logger.info("Successfully synced all in-memory state to Firebase Firestore database.");
  } catch (e) {
    logger.error("saveState error:", e);
  }
}
"""

start_idx = content.find("async function saveState()")
end_idx = content.find("async function loadState()")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_save_state + "\n" + content[end_idx:]

with open('server.ts', 'w') as f:
    f.write(content)
