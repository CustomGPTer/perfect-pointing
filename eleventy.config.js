import markdownIt from "markdown-it";
import * as yaml from "js-yaml";

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  const md = markdownIt({ html: true, breaks: true, linkify: true });

  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

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
  eleventyConfig.addCollection("areas", (api) => api.getFilteredByGlob("src/areas/*.md"));
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
  eleventyConfig.addFilter("excerpt", (html, n = 160) => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, n));
  eleventyConfig.addCollection("faqs", (api) => api.getFilteredByGlob("src/faqs/*.md"));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
