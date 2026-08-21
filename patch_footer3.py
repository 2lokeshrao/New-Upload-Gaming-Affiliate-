import re

with open('src/components/Footer.tsx', 'r') as f:
    content = f.read()

func = """
  const handleModalOpen = (setter: (v: boolean) => void) => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setTimeout(() => {
      setter(true);
    }, 50);
  };
"""

if "const handleModalOpen" not in content:
    content = content.replace("const { t } = useLanguage();", "const { t } = useLanguage();\n" + func)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(content)
