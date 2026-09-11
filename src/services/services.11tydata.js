export default {
  layout: "service.njk",
  tags: [],
  permalink: (data) => `/services/${data.page.fileSlug}/`,
  eleventyComputed: {
    seo_title: (d) => `${d.title} Rochdale, Oldham & Greater Manchester | Perfect Pointing`,
    og_image: (d) => d.image,
    breadcrumbs: (d) => [{ name: "Services", url: "/services/" }, { name: d.title, url: d.page.url }],
  },
};
