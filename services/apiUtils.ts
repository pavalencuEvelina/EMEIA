/**
 * apiUtils.ts
 *
 * InfinityFree free hosting has two obstacles:
 *   1. AES bot challenge — must decrypt a cookie value and retry
 *   2. HTML ad injection — appends <script> tags after PHP output
 *
 * Requires: npm install crypto-js
 *           npm install --save-dev @types/crypto-js
 */

import CryptoJS from "crypto-js";

// ─────────────────────────────────────────────────────────
//  AES challenge solver
// ─────────────────────────────────────────────────────────
function solveCookieChallenge(html: string): string | null {
  try {
    const aMatch = html.match(/var a=toNumbers\("([a-f0-9]+)"\)/);
    const bMatch = html.match(/b=toNumbers\("([a-f0-9]+)"\)/);
    const cMatch = html.match(/c=toNumbers\("([a-f0-9]+)"\)/);
    if (!aMatch || !bMatch || !cMatch) return null;

    const key       = CryptoJS.enc.Hex.parse(aMatch[1]);
    const iv        = CryptoJS.enc.Hex.parse(bMatch[1]);
    const encrypted = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(cMatch[1]),
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv,
      mode:    CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding,
    });

    return decrypted.toString(CryptoJS.enc.Hex);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────
//  JSON extractor — depth-counting, ignores surrounding HTML
// ─────────────────────────────────────────────────────────
export function parseJson(text: string): any {
  const candidates: Array<{ pos: number; open: string; close: string }> = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") candidates.push({ pos: i, open: "{", close: "}" });
    else if (text[i] === "[") candidates.push({ pos: i, open: "[", close: "]" });
  }
  if (candidates.length === 0) throw new Error("No JSON found in response");

  for (const { pos: start, open, close } of candidates) {
    let depth = 0, inString = false, escape = false, end = -1;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (escape)               { escape = false; continue; }
      if (ch === "\\" && inString) { escape = true; continue; }
      if (ch === '"')            { inString = !inString; continue; }
      if (inString)              continue;
      if (ch === open)           { depth++; continue; }
      if (ch === close)          { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) continue;
    try { return JSON.parse(text.slice(start, end + 1)); } catch { continue; }
  }
  throw new Error("No valid JSON found in response");
}

// ─────────────────────────────────────────────────────────
//  Cookie cache — module-level, persists for the app session
// ─────────────────────────────────────────────────────────
let cachedCookie: string | null = null;

// Solve the challenge once and store the cookie.
// Exported so the app can call this at startup to pre-warm.
export async function warmUp(baseUrl: string): Promise<void> {
  if (cachedCookie) return; // already solved
  try {
    const res  = await fetch(baseUrl);
    const text = await res.text();
    if (!text.includes("slowAES.decrypt")) return; // no challenge, nothing to do
    const val = solveCookieChallenge(text);
    if (val) cachedCookie = val;
  } catch {
    // warmup failure is silent — apiFetch will retry on next real call
  }
}

// ─────────────────────────────────────────────────────────
//  apiFetch — handles challenge + JSON extraction
// ─────────────────────────────────────────────────────────
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<{ response: Response; data: any }> {

  const bodyStr: string | undefined =
    options.body instanceof URLSearchParams
      ? options.body.toString()
      : (options.body as string | undefined);

  const buildOpts = (extraHeaders?: Record<string, string>): RequestInit => ({
    ...options,
    body: bodyStr,
    headers: {
      ...(bodyStr ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      ...(options.headers as Record<string, string> | undefined),
      ...extraHeaders,
    },
  });

  const doFetch = async (reqUrl: string, cookie?: string) => {
    const res  = await fetch(reqUrl, buildOpts(cookie ? { Cookie: `__test=${cookie}` } : undefined));
    const text = await res.text();
    return { res, text };
  };

  // ── Attempt 1 — use cached cookie if we have one ──────
  const { res: r1, text: t1 } = await doFetch(url, cachedCookie ?? undefined);

  if (!t1.includes("slowAES.decrypt")) {
    // No challenge — either we had a valid cookie or no challenge needed
    return { response: r1, data: parseJson(t1) };
  }

  // ── Got a challenge — solve it ────────────────────────
  const cookie1 = solveCookieChallenge(t1);
  if (!cookie1) throw new Error("Failed to solve InfinityFree bot challenge");
  cachedCookie = cookie1;

  const retryUrl = url.includes("?") ? `${url}&i=1` : `${url}?i=1`;
  const { res: r2, text: t2 } = await doFetch(retryUrl, cookie1);

  if (!t2.includes("slowAES.decrypt")) {
    return { response: r2, data: parseJson(t2) };
  }

  // ── Got a second challenge (rare but happens on cold start) ──
  const cookie2 = solveCookieChallenge(t2);
  if (!cookie2) throw new Error("Double bot challenge — could not solve second challenge");
  cachedCookie = cookie2;

  const retryUrl2 = retryUrl.includes("i=1") ? retryUrl : `${retryUrl}&i=1`;
  const { res: r3, text: t3 } = await doFetch(retryUrl2, cookie2);

  if (t3.includes("slowAES.decrypt"))
    throw new Error("Bot challenge loop — check InfinityFree account status");

  return { response: r3, data: parseJson(t3) };
}
