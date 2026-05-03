export default async function sitemap() {
  return [
    {
      url: "https://gemsage.ai",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: "https://gemsage.ai/auth/signin",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: "https://gemsage.ai/auth/signup",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];
}
