export default {
  layout: "areas-item.njk",
  tags: [],
  permalink: (data) => `/repointing-${data.page.fileSlug}/`,
  eleventyComputed: {
    breadcrumbs: (d) => [{ name: "Areas", url: "/areas/" }, { name: d.town, url: d.page.url }],
    title: (d) => `Repointing in ${d.town}`,
    seo_title: (d) => `Repointing ${d.town} | Brick & Stone | Perfect Pointing`,
    og_image: (d) => d.pages.areas.image,
  },
};
