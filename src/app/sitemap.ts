import type { MetadataRoute } from "next";

const BASE_URL = "https://pavin.me";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	return [
		{
			url: BASE_URL,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${BASE_URL}/cv`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/demos/ai-saas`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/demos/bakery`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/demos/dashboard`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/demos/fintech`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/demos/gym`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/demos/luxury`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];
}
