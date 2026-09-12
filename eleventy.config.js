import markdownIt from "markdown-it";
import * as yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  const md = markdownIt({ html: true, breaks: true, linkify: true });

  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("mdInline", (s) => (s ? md.renderInline(String(s)) : ""));
  eleventyConfig.addFilter("tel", (s) => "tel:" + String(s || "").replace(/\s+/g, ""));
  eleventyConfig.addFilter("initials", (name) =>
    String(name || "").split(/\s+/).map((w) => w[0] || "").join("").slice(0, 2).toUpperCase()
  );
  eleventyConfig.addFilter("byOrder", (arr) =>
    [...(arr || [])].sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  );
  eleventyConfig.addFilter("slug", (s) => String(s||"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""));
  eleventyConfig.addFilter("uniq", (arr) => [...new Set(arr)]);
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addFilter("relatedJobs", (jobs, title) => {
    const t = String(title || "").toLowerCase();
    return [...(jobs || [])]
      .filter((j) => { const c = String(j.data.category || "").toLowerCase(); return c && (t.includes(c) || c.includes(t.split(" ")[0])); })
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999)).slice(0, 3);
  });

  eleventyConfig.addCollection("services", (api) => api.getFilteredByGlob("src/services/*.md"));
  eleventyConfig.addCollection("jobs", (api) => api.getFilteredByGlob("src/jobs/*.md"));
  eleventyConfig.addCollection("reviews", (api) => api.getFilteredByGlob("src/reviews/*.md"));
  const byOrd = (a, b) => (a.data.order ?? 999) - (b.data.order ?? 999);
  // "areas" = core towns only (nav, footer, home, service chips). Extended towns live in areasExtended / areasAll.
  eleventyConfig.addCollection("areas", (api) => api.getFilteredByGlob("src/areas/*.md").filter((a) => a.data.tier !== "extended").sort(byOrd));
  eleventyConfig.addCollection("areasExtended", (api) => api.getFilteredByGlob("src/areas/*.md").filter((a) => a.data.tier === "extended").sort(byOrd));
  eleventyConfig.addCollection("areasAll", (api) => api.getFilteredByGlob("src/areas/*.md").sort(byOrd));
  eleventyConfig.addCollection("regions", (api) => api.getFilteredByGlob("src/regions/*.md").sort(byOrd));
  eleventyConfig.addCollection("styles", (api) => api.getFilteredByGlob("src/styles/*.md"));
  eleventyConfig.addCollection("advice", (api) => api.getFilteredByGlob("src/advice/*.md"));
  eleventyConfig.addFilter("jobsIn", (jobs, town) => {
    const t = String(town || "").toLowerCase();
    return [...(jobs || [])].filter((j) => String(j.data.location || "").toLowerCase().includes(t)).slice(0, 3);
  });
  eleventyConfig.addFilter("reviewsIn", (reviews, town) => {
    const t = String(town || "").toLowerCase();
    return [...(reviews || [])].filter((r) => String(r.data.job || "").toLowerCase().includes(t)).slice(0, 2);
  });
  eleventyConfig.addFilter("areaMarkers", (areas) =>
    [...(areas || [])].sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
      .map((a) => ({ name: a.data.town, lat: a.data.lat, lng: a.data.lng, url: a.url, home: a.fileSlug === "rochdale" })));
  eleventyConfig.addFilter("jsonify", (v) => JSON.stringify(v));
  // Nearest N other area pages by straight-line distance (for the "Nearby" cards on every area page).
  const milesBetween = (a, b) => {
    const R = 3958.8, r = Math.PI / 180;
    const dp = (b.lat - a.lat) * r, dl = (b.lng - a.lng) * r;
    const x = Math.sin(dp / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dl / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(x));
  };
  eleventyConfig.addFilter("nearest", (areas, here, n = 6) =>
    [...(areas || [])].filter((a) => a.url !== here.url && a.data.lat && a.data.lng)
      .map((a) => ({ a, d: milesBetween({ lat: +here.lat, lng: +here.lng }, { lat: +a.data.lat, lng: +a.data.lng }) }))
      .sort((x, y) => x.d - y.d).slice(0, n).map((x) => x.a));
  // Group area pages by county, A–Z within each county; counties in a fixed order.
  const countyOrder = ["Greater Manchester", "Lancashire", "West Yorkshire", "North Yorkshire", "South Yorkshire", "Derbyshire", "Cheshire", "Staffordshire", "Merseyside"];
  eleventyConfig.addFilter("byCounty", (areas) => {
    const g = new Map();
    for (const a of areas || []) { const c = a.data.county || "Other"; if (!g.has(c)) g.set(c, []); g.get(c).push(a); }
    return [...g.entries()].sort((x, y) => (countyOrder.indexOf(x[0]) + 1 || 99) - (countyOrder.indexOf(y[0]) + 1 || 99))
      .map(([county, list]) => ({ county, list: list.sort((a, b) => String(a.data.town).localeCompare(String(b.data.town))) }));
  });
  eleventyConfig.addFilter("inCounties", (areas, counties) => [...(areas || [])].filter((a) => (counties || []).includes(a.data.county)).sort((a, b) => String(a.data.town).localeCompare(String(b.data.town))));
  eleventyConfig.addFilter("regionFor", (regions, county) => (regions || []).find((r) => (r.data.counties || []).includes(county)));
  eleventyConfig.addFilter("smallMarkers", (areas) => (areas || []).map((a) => ({ name: a.data.town, lat: a.data.lat, lng: a.data.lng, url: a.url, small: true })));
  eleventyConfig.addFilter("concat", (a, b) => [...(a || []), ...(b || [])]);

  // Add width/height to every local <img> that lacks them (stops layout shift).
  const dimCache = new Map();
  const dims = (src) => {
    if (dimCache.has(src)) return dimCache.get(src);
    let d = null;
    try { d = imageSize(fs.readFileSync(path.join("src", src))); } catch {}
    dimCache.set(src, d);
    return d;
  };
  eleventyConfig.addTransform("imgdims", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(/<img\b[^>]*>/g, (tag) => {
      if (/\swidth=/.test(tag)) return tag;
      const m = tag.match(/\ssrc="(\/images\/[^"]+)"/);
      if (!m) return tag;
      const d = dims(m[1]);
      if (!d?.width) return tag;
      return tag.replace(/<img\b/, `<img width="${d.width}" height="${d.height}"`);
    });
  });
  eleventyConfig.addFilter("excerpt", (html, n = 160) => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, n));
  eleventyConfig.addCollection("faqs", (api) => api.getFilteredByGlob("src/faqs/*.md"));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
