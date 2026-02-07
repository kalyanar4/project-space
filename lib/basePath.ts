const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

export const basePath = envBasePath || (repoName ? `/${repoName}` : "");

export const withBasePath = (assetPath: string) => {
  if (!assetPath) {
    return basePath || "";
  }

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${basePath}${normalizedPath}`;
};
