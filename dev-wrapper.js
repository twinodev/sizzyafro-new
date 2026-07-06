import { spawn } from "child_process";

console.log("Starting Next.js development server via dev-wrapper...");
console.log("Intercepted original CLI arguments:", process.argv.slice(2));

// Filter out `--host` and its value if they exist, or just run a clean spawn command
// because we hardcode port 3000 and 0.0.0.0 hostname anyway.
const child = spawn("npx", ["next", "dev", "-p", "3000", "-H", "0.0.0.0"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
