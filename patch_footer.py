import re

with open('src/components/Footer.tsx', 'r') as f:
    content = f.read()

nav_to_home = """
  const handleModalOpen = (setter: (v: boolean) => void) => {
    // If not on home page, navigate home first
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    // Small delay to allow state update before showing modal
    setTimeout(() => {
      setter(true);
    }, 50);
  };
"""

if "handleModalOpen" not in content:
    content = content.replace("export const Footer: React.FC<FooterProps> = ({", "export const Footer: React.FC<FooterProps> = ({\n")
    # find where to inject handleModalOpen. Inside the component.
    content = re.sub(r'(const \{ t, language \} = useLanguage\(\);)', r'\1\n' + nav_to_home, content)

    # replace setShowSubPartnerModal(true)
    content = content.replace("setShowSubPartnerModal(true)", "handleModalOpen(setShowSubPartnerModal)")
    content = content.replace("setShowReferModal(true)", "handleModalOpen(setShowReferModal)")
    content = content.replace("setShowPwaModal(true)", "handleModalOpen(setShowPwaModal)")
    
    # For Admin
    admin_click = """onClick={() => {
                if (adminToken) {
                  // go home first to close any pages
                  if (window.location.pathname !== '/') {
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                  setTimeout(() => setViewingAdmin(true), 50);
                } else {
                  handleModalOpen(setShowAdminLogin);
                }
              }}"""
    old_admin_click = """onClick={() => {
                if (adminToken) {
                  setViewingAdmin(true);
                } else {
                  setShowAdminLogin(true);
                }
              }}"""
    content = content.replace(old_admin_click, admin_click)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(content)
