export const sluggify = (string: string) => {
  // Convert the string to lowercase
  let slug = string.toLowerCase();

  // Remove special characters, leaving only letters, numbers, and spaces
  slug = slug.replace(/[^\w\s-]/g, '');

  // Remove non-alphanumeric at the start and the end of the string
  slug = slug.replace(/(^[^a-zA-Z0-9]|[^a-zA-Z0-9]$)/g, '');

  // Replace spaces with dashes
  slug = slug.replace(/\s+/g, '-');

  return slug;
};

export const cleanHeadingContent = (string: string) => {
  // This strips the italic markdown syntax (e.g.: _text in italic_)
  return string.replace(/(^_| _|_ |_$)/g, ' ');
};
