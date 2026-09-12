// Pulls the live Google Business Profile rating and reviews at build time.
// Needs GOOGLE_PLACES_API_KEY in the Netlify environment. Without it (or if
// Google is unreachable) the site builds normally with no Google data.
import fs from "node:fs";
import yaml from "js-yaml";

const site = yaml.load(fs.readFileSync("src/_data/site.yml", "utf8"));
const KEY = process.env.GOOGLE_PLACES_API_KEY;
const EMPTY = { ok: false, rating: null, count: 0, reviews: [], mapsUrl: site.google_maps_url || "", reviewUrl: site.google_review_url || "" };

async function call(url, mask, body) {
  const r = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": mask },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}

export default async function () {
  if (!KEY) return EMPTY;
  try {
    let id = site.google_place_id;
    if (!id) {
      const s = await call("https://places.googleapis.com/v1/places:searchText", "places.id,places.displayName",
        { textQuery: `${site.business_name} ${site.town}`, languageCode: "en-GB", regionCode: "GB", maxResultCount: 1 });
      id = s.places?.[0]?.id;
      if (!id) return EMPTY;
    }
    const d = await call(`https://places.googleapis.com/v1/places/${id}?languageCode=en-GB&regionCode=GB`,
      "rating,userRatingCount,reviews,googleMapsUri,writeAReviewUri,displayName");
    const reviews = (d.reviews || [])
      .filter((r) => (r.text?.text || "").trim())
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .map((r, i) => ({
        // same shape as the CMS review cards so review-card.njk works unchanged
        data: { name: r.authorAttribution?.displayName || "Google customer", job: r.relativePublishTimeDescription ? `Google review · ${r.relativePublishTimeDescription}` : "Google review", rating: r.rating || 5, featured: i < 3, order: i, google: true },
        templateContent: r.text.text.trim(),
      }));
    return {
      ok: true, id,
      rating: d.rating ? Number(d.rating).toFixed(1) : null,
      count: d.userRatingCount || 0,
      reviews,
      mapsUrl: d.googleMapsUri || site.google_maps_url || "",
      reviewUrl: site.google_review_url || d.writeAReviewUri || "",
    };
  } catch (e) {
    console.warn("[google] reviews fetch skipped:", e.message);
    return EMPTY;
  }
}
