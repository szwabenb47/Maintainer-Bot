"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildIssueReport,
  buildPullRequestReport,
  detectMode,
  missingIssueInformation,
  parseBoolean,
  parseInteger,
  scorePullRequestRisk,
  suggestedIssueLabels,
  truncate
} = require("../src/index.js");

test("detectMode selects supported GitHub events", () => {
  assert.equal(detectMode({ pull_request: {} }), "pull_request");
  assert.equal(detectMode({ issue: {} }), "issue");
  assert.equal(detectMode({ release: {} }), "release");
  assert.equal(detectMode({}, "issue"), "issue");
  assert.equal(detectMode({}), "unknown");
});

test("input parsers handle common values", () => {
  assert.equal(parseBoolean("true"), true);
  assert.equal(parseBoolean("1"), true);
  assert.equal(parseBoolean("false"), false);
  assert.equal(parseBoolean("", true), true);
  assert.equal(parseInteger("42", 10), 42);
  assert.equal(parseInteger("nope", 10), 10);
});

test("issue labels are suggested from issue text", () => {
  const labels = suggestedIssueLabels({
    title: "Crash when loading docs",
    body: "The app throws an exception in the README example."
  });
  assert.ok(labels.includes("bug"));
  assert.ok(labels.includes("documentation"));
});

test("missing issue information finds useful follow-up questions", () => {
  const missing = missingIssueInformation({ body: "It fails on startup." });
  assert.ok(missing.includes("affected version or commit"));
  assert.ok(missing.includes("clear reproduction steps"));
});

test("pull request risk flags sensitive changes", () => {
  const risk = scorePullRequestRisk([
    {
      filename: "src/auth/token.js",
      changes: 30,
      patch: "+ const token = eval(input);"
    }
  ]);
  assert.equal(risk.level, "high");
  assert.ok(risk.signals.some((signal) => signal.includes("security-sensitive")));
});

test("reports produce maintainer-oriented markdown", () => {
  const issueReport = buildIssueReport({
    number: 7,
    title: "Feature request: add labels",
    body: "Please add label automation.",
    labels: []
  });
  assert.match(issueReport, /Maintainer-Bot Issue Triage/);
  assert.match(issueReport, /Suggested labels/);

  const prReport = buildPullRequestReport({
    number: 9,
    title: "Add review summaries",
    user: { login: "contributor" }
  }, [
    { filename: "src/index.js", status: "modified", additions: 10, deletions: 2, changes: 12 }
  ]);
  assert.match(prReport, /Maintainer-Bot Pull Request Review/);
  assert.match(prReport, /Review Checklist/);
});

test("truncate shortens long text", () => {
  const value = truncate("abcdefghij", 5);
  assert.match(value, /^abcde/);
  assert.match(value, /truncated/);
});
