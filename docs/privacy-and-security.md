# Privacy and Security

Maintainer-Bot is designed around safe defaults for public OSS repositories.

## Default Behavior

By default, `dry-run` is true. In dry-run mode, Maintainer-Bot:

- does not call the OpenAI API;
- does not post GitHub comments;
- writes a Markdown report to the GitHub Actions step summary.

## AI-Assisted Mode

When `openai-api-key` is configured and `dry-run` is false, Maintainer-Bot can
send selected event context to the OpenAI API:

- issue title, labels, and body;
- pull request title, description, changed-file metadata, and selected patch
  text;
- release title, tag, and release notes.

Maintainers should review whether that context is appropriate for their
repository before enabling AI-assisted mode.

## Recommended Workflow Permissions

Use least-privilege permissions:

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: read
```

If `post-comment` is false, `issues: read` is enough for issue events.

## Secrets

Do not place secrets in issue bodies, release notes, or pull request diffs.
GitHub Actions secrets are not printed by this action, but repository content
may still contain sensitive values if contributors commit them.

## Human Control

Maintainer-Bot generates suggestions. It does not merge, close, label, release,
or approve anything automatically in the current MVP.
