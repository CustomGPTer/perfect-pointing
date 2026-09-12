// Weekly rebuild so new Google reviews appear without anyone touching the site.
// Needs NETLIFY_BUILD_HOOK in the Netlify environment (Site settings → Build & deploy → Build hooks).
export default async () => {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) return new Response("NETLIFY_BUILD_HOOK not set", { status: 500 });
  const r = await fetch(hook, { method: "POST" });
  return new Response(`build hook ${r.status}`, { status: r.ok ? 200 : 502 });
};
export const config = { schedule: "0 6 * * 1" };
