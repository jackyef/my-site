Put any temporary files (like screenshots) in `./tmp`

Just run typecheck and lint to test builds, no need to actually build.

Ask user to run dev server instead of running your own — except when working in
a remote cloud container (Claude Code on the web, or any other sandboxed session
that isn't the user's own machine). There, start the dev server yourself and
verify the change in a browser; nothing you start there competes with the user's
local processes or ports.

Always use `*Icon` prefix when importing Icon components.
