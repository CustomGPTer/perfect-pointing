export default {
  layout: "areas-item.njk",
  tags: [],
  permalink: (data) => `/repointing-${data.page.fileSlug}/`,
  eleventyComputed: {
    breadcrumbs: (d) => {
      const region = (d.collections?.regions || []).find((r) => (r.data.counties || []).includes(d.county));
      return [{ name: "Areas", url: "/areas/" }, ...(region ? [{ name: region.data.name, url: region.url }] : []), { name: d.town, url: d.page.url }];
    },
    title: (d) => `Repointing in ${d.town}`,
    seo_title: (d) => `Repointing ${d.town} | Brick & Stone | Perfect Pointing`,
    og_image: (d) => d.pages.areas.image,
  },
};
