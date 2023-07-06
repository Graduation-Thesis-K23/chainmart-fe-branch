const getLinkBySlug = (slug: string) => {
  if (process.env.NODE_ENV === "development") {
    return `${"http://localhost:8080"}/${slug}`;
  } else {
    return `${"http://chainmart.site"}/${slug}`;
  }
};

export default getLinkBySlug;
