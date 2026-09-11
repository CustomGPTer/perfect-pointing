export default {
  layout: "advice-item.njk",
  tags: [],
  permalink: (data) => `/advice/${data.page.fileSlug}/`,
  eleventyComputed: {
    breadcrumbs: (d) => [{ name: "Advice", url: "/advice/" }, { name: d.title, url: d.page.url }],
    seo_title: (d) => `${d.title} | Perfect Pointing`,
    og_image: (d) => d.image,
  },
};
