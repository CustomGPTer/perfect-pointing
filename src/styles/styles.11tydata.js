export default {
  layout: "styles-item.njk",
  tags: [],
  permalink: (data) => `/pointing-styles/${data.page.fileSlug}/`,
  eleventyComputed: {
    breadcrumbs: (d) => [{ name: "Pointing styles", url: "/pointing-styles/" }, { name: d.name, url: d.page.url }],
    title: (d) => d.name,
    seo_title: (d) => `${d.name} pointing — what it is and where it's used | Perfect Pointing`,
  },
};
