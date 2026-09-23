import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { force: true, recursive: true });
await mkdir("dist", { recursive: true });
await cp("src/server.js", "dist/server.js");
console.log("Built dist/server.js");
