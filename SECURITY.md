# Security Policy

## Supported Versions

Security updates are applied to the latest release of Nova Motion. Older
versions are not actively maintained.

| Version | Supported |
| --- | --- |
| latest (main) | yes |
| older releases | no |

## Reporting a Vulnerability

Please do not open a public issue for security vulnerabilities. Report them
privately by emailing **samuelolubukun@gmail.com**.

Please include:

- The affected version / commit and file(s).
- A description of the vulnerability and the impact.
- Steps to reproduce, if possible.

You will receive a response acknowledging the report, and we will follow up
with the status and next steps. We ask that you give us reasonable time to
address the issue before disclosing it publicly.

### What to report

Anything that could compromise the security of the project or its users,
including but not limited to:

- Exposure of API keys, tokens, or secrets (for example, keys committed to the
  repository or logged in job output).
- Prompt injection or command injection through user-supplied content.
- Unauthorized access to the render server or job queue (`RENDER_SERVER_SECRET`
  bypass, missing auth on `POST /render/*`).
- Insecure handling of uploaded assets or generated files (path traversal,
  arbitrary file read/write).
- Dependency vulnerabilities in the runtime stack.

### Non-security bugs

Non-security bugs, including AI model failures, rendering issues, and feature
requests, belong in the issue tracker - see the issue templates.
