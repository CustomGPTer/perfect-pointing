export default {
  layout: "region.njk",
  tags: [],
  permalink: (data) => `/areas/${data.page.fileSlug}/`,
  eleventyComputed: {
    title: (d) => `Repointing in ${d.name}`,
    seo_title: (d) => `Repointing ${d.name} | Brick, Stone & Lime | Perfect Pointing`,
    og_image: (d) => d.pages.areas.image,
  },
};
