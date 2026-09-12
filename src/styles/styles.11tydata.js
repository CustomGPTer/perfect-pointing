export default {
  layout: "styles-item.njk",
  tags: [],
  permalink: (data) => `/pointing-styles/${data.page.fileSlug}/`,
  eleventyComputed: {
    breadcrumbs: (d) => [{ name: "Pointing styles", url: "/pointing-styles/" }, { name: d.name, url: d.page.url }],
    title: (d) => d.name,
    seo_title: (d) => `${d.name.replace(/ pointing$/i, "")} Pointing Explained | Perfect Pointing`,
    og_image: (d) => d.pages.styles.image,
  },
};
