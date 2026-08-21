import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "const TestimonialsSection = lazy(() => import('./components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));"
if "TestimonialsSection" not in content:
    content = content.replace("const PlatformFeedbackModal = lazy(() => import('./components/PlatformFeedbackModal')", import_stmt + "\nconst PlatformFeedbackModal = lazy(() => import('./components/PlatformFeedbackModal')")

# Add component in JSX
component_jsx = """
          <Suspense fallback={<Skeletons.Section />}>
            <TestimonialsSection feedbacks={config?.approvedFeedbacks || []} />
          </Suspense>
"""
if "<TestimonialsSection" not in content:
    content = content.replace("<ProgrammaticSeoArticles", component_jsx + "\n          <ProgrammaticSeoArticles")

with open('src/App.tsx', 'w') as f:
    f.write(content)
