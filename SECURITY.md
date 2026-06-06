# Security Policy

Maintainer-Bot processes GitHub event metadata and, when AI-assisted mode is
enabled, selected pull request diff context.

## Reporting a Vulnerability

Please open a private security advisory on GitHub if the vulnerability should
not be public before a fix is available. For lower-risk issues, open a normal
GitHub issue with the `security` label.

## Safe Usage

- Dry-run mode is enabled by default.
- Posting comments is opt-in.
- OpenAI API usage is opt-in.
- Do not enable AI-assisted mode for repositories where pull request diffs,
  issue bodies, or release notes may contain secrets.
- Use least-privilege GitHub permissions in workflows.

Recommended permissions:

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: read
```

## Scope

Maintainer-Bot is intended to assist with maintainer workflows. It does not
replace human review, security review, release approval, or incident response.
