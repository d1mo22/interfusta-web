// Run: SESSION_SECRET=$(openssl rand -hex 32) node --experimental-strip-types lib/session.check.ts
import assert from "node:assert";
import { signSession, verifySession } from "./session.ts";

const user = { id: 1, username: "admin", name: "Admin" };
const token = await signSession(user);
assert.deepStrictEqual(await verifySession(token), user);

const [payload, sig] = token.split(".");
const forged = Buffer.from(JSON.stringify({ ...user, name: "x", exp: 9e15 })).toString("base64url");
assert.equal(await verifySession(`${forged}.${sig}`), null, "tampered payload");
assert.equal(await verifySession(payload), null, "missing sig");
assert.equal(await verifySession('{"id":1,"username":"admin","name":"x"}'), null, "old unsigned cookie");
assert.equal(await verifySession(undefined), null);
console.log("session ok");
