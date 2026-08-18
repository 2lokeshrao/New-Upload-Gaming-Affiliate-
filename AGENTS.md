# Custom Instructions

- **Deployment Requirement (Hostinger/Other Platforms):** Always ensure that `package.json` has a `"postinstall": "npm run build"` script under `scripts`. This is required to make sure the app builds properly during deployment on Hostinger and prevents recurring deployment errors.
