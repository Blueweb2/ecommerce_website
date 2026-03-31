export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
  } = {}
) => {
  if (!url) return url;

  let transform = "f_auto,q_auto";

  if (options.width) transform += `,w_${options.width}`;
  if (options.height) transform += `,h_${options.height}`;

  return url.replace("/upload/", `/upload/${transform}/`);
};