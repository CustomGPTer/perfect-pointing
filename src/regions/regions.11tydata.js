export default {
  layout: "region.njk",
  tags: [],
  permalink: (data) => `/areas/${data.page.fileSlug}/`,
  eleventyComputed: {
    breadcrumbs: (d) => [{ name: "Areas", url: "/areas/" }, { name: d.name, url: d.page.url }],
    title: (d) => `Repointing in ${d.name}`,
    seo_title: (d) => `Repointing ${d.name} | Brick, Stone & Lime | Perfect Pointing`,
    og_image: (d) => d.pages.areas.image,
  },
};
