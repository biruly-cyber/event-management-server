export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // Replace non-alphanumeric characters with underscores
    .replace(/^_+|_+$/g, ""); // Remove leading and trailing underscores
};
