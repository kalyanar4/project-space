import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

let cacheBustCounter = 0;

const loadBasePath = async () => {
  const moduleUrl = new URL("./basePath.ts", import.meta.url);
  cacheBustCounter += 1;
  const cacheBustedUrl = `${moduleUrl.href}?cacheBust=${cacheBustCounter}`;
  return await import(cacheBustedUrl);
};

const originalEnvBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const originalRepo = process.env.GITHUB_REPOSITORY;

afterEach(() => {
  if (originalEnvBasePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = originalEnvBasePath;
  }

  if (originalRepo === undefined) {
    delete process.env.GITHUB_REPOSITORY;
  } else {
    process.env.GITHUB_REPOSITORY = originalRepo;
  }
});

describe("basePath", () => {
  it("prefers NEXT_PUBLIC_BASE_PATH when set", async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/custom";
    process.env.GITHUB_REPOSITORY = "owner/repo";

    const { basePath } = await loadBasePath();

    assert.equal(basePath, "/custom");
  });

  it("falls back to GITHUB_REPOSITORY when NEXT_PUBLIC_BASE_PATH is unset", async () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    process.env.GITHUB_REPOSITORY = "owner/project-space";

    const { basePath } = await loadBasePath();

    assert.equal(basePath, "/project-space");
  });

  it("defaults to an empty string when no base path is configured", async () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    delete process.env.GITHUB_REPOSITORY;

    const { basePath } = await loadBasePath();

    assert.equal(basePath, "");
  });
});

describe("withBasePath", () => {
  it("prefixes assets with NEXT_PUBLIC_BASE_PATH when set", async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/custom";
    delete process.env.GITHUB_REPOSITORY;

    const { withBasePath } = await loadBasePath();

    assert.equal(withBasePath("globe.svg"), "/custom/globe.svg");
  });

  it("handles leading slashes when no base path is set", async () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    delete process.env.GITHUB_REPOSITORY;

    const { withBasePath } = await loadBasePath();

    assert.equal(withBasePath("/globe.svg"), "/globe.svg");
  });
});
