import { WorkspaceError } from "bb-environment-provider-host/git";
import path from "node:path";

const FALLBACK_REPO_DIR_NAME = "repo";

export function deriveRepoDirName(sourcePath: string): string {
  const trimmed = sourcePath.replace(/\/+$/, "");
  const basename = path.posix.basename(trimmed);
  const candidate = basename.endsWith(".git")
    ? basename.slice(0, -".git".length)
    : basename;
  const slug = candidate
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug === "" || slug === "." || slug === "..") {
    return FALLBACK_REPO_DIR_NAME;
  }
  return slug;
}

export function resolveWorktreesRoot(dataDir: string): string {
  return path.posix.join(dataDir, "worktrees");
}

export function resolveWorktreeAttemptRoot(args: {
  dataDir: string;
  pathKey: string;
}): string {
  if (
    args.pathKey === "." ||
    args.pathKey === ".." ||
    path.posix.basename(args.pathKey) !== args.pathKey
  ) {
    throw new WorkspaceError(
      "invalid_path_key",
      "A worktree path key must be a single path segment",
    );
  }
  return path.posix.join(resolveWorktreesRoot(args.dataDir), args.pathKey);
}

export function resolveWorktreeTargetPath(args: {
  dataDir: string;
  pathKey: string;
  sourcePath: string;
}): string {
  return path.posix.join(
    resolveWorktreeAttemptRoot(args),
    deriveRepoDirName(args.sourcePath),
  );
}
