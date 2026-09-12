export default {
  layout: "service.njk",
  tags: [],
  permalink: (data) => `/services/${data.page.fileSlug}/`,
  eleventyComputed: {
    seo_title: (d) => d.seo_title_override || `${String(d.title).replace(/\b[a-z]/g, (c) => c.toUpperCase())} Rochdale & Oldham | Perfect Pointing`,
    og_image: (d) => d.image,
    breadcrumbs: (d) => [{ name: "Services", url: "/services/" }, { name: d.title, url: d.page.url }],
  },
};
