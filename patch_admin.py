import re

with open('src/components/AdminDashboardTab.tsx', 'r') as f:
    content = f.read()

# Add a reset button handler
reset_handler = """
  const handleResetStats = async () => {
    if (!window.confirm("Are you sure you want to reset all analytics stats to 0? This cannot be undone.")) return;
    try {
      const res = await fetch('/api/admin/reset-stats', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        alert("Stats reset successfully!");
        window.location.reload();
      }
    } catch (e) {
      alert("Failed to reset stats");
    }
  };
"""

if "handleResetStats" not in content:
    content = content.replace("const handleSyncAllPanels = () => {", reset_handler + "\n  const handleSyncAllPanels = () => {")

reset_button = """
          <button 
            onClick={handleResetStats}
            className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2 border border-red-500/30 text-sm whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" /> Reset Stats
          </button>
"""

# Find a good place for the reset button. Next to "Refresh S2S Postbacks" or "Fetch Live"
if "Reset Stats" not in content:
    content = content.replace('className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center gap-2 border border-sky-400/50"', 'className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center gap-2 border border-sky-400/50"')
    
    # Actually let's put it next to the "Fetch Live Partner Stats" button
    content = content.replace('<span>Fetch Live Partner Stats</span>\n            </button>', '<span>Fetch Live Partner Stats</span>\n            </button>\n' + reset_button)

with open('src/components/AdminDashboardTab.tsx', 'w') as f:
    f.write(content)
