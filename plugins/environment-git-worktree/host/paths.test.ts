import { describe, expect, it } from "vitest";
import { deriveRepoDirName } from "./paths.js";

describe("deriveRepoDirName", () => {
  it.each([
    ["local absolute path", "/Users/someone/code/my-repo", "my-repo"],
    [
      "local path with trailing slash",
      "/Users/someone/code/my-repo/",
      "my-repo",
    ],
    ["dotted name", "/Users/me/code/my.repo", "my.repo"],
    [
      "local path with .git suffix",
      "/Users/me/code/Hello-World.git",
      "Hello-World",
    ],
    [
      "name with spaces",
      "/Users/me/bb-repro/Repo With Space",
      "Repo-With-Space",
    ],
    [
      "runs of disallowed characters",
      "/Users/me/Obsidian Vault (iCloud) ",
      "Obsidian-Vault-iCloud",
    ],
    ["non-ASCII prefix", "/Users/me/Проект docs", "docs"],
    [
      "leading dash (could be interpreted as flag)",
      "/tmp/-dangerous",
      "dangerous",
    ],
    ["hidden directory", "/Users/me/.dotfiles", ".dotfiles"],
  ])("derives %s", (_label, input, expected) => {
    const derived = deriveRepoDirName(input);
    expect(derived).toBe(expected);
    expect(deriveRepoDirName(derived)).toBe(expected);
  });

  it.each([
    ["root-only path", "/"],
    ["empty string", ""],
    ["bare .git", "/Users/me/code/.git"],
    ["parent traversal", "/Users/me/code/.."],
    ["current dir", "/Users/me/code/."],
    ["only disallowed characters", "/Users/me/Проект"],
    ["only dashes", "/tmp/---"],
  ])("falls back to repo for %s", (_label, input) => {
    expect(deriveRepoDirName(input)).toBe("repo");
  });
});
