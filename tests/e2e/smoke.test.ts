import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { blogPosts } from "../../app/data/blogPosts.ts";
import { plannedToolCategories, toolCategories } from "../../app/data/toolCategories.ts";

const root = process.cwd();

const routeFile = (...segments: string[]) => path.join(root, ...segments);
const exists = (...segments: string[]) => fs.existsSync(routeFile(...segments));

describe("route integrity", () => {
  it("has core app routes", () => {
    assert.equal(exists("app", "page.tsx"), true);
    assert.equal(exists("app", "tools", "page.tsx"), true);
    assert.equal(exists("app", "contact", "page.tsx"), true);
    assert.equal(exists("app", "blog", "page.tsx"), true);
  });

  it("has concrete pages for live tool categories", () => {
    const live = toolCategories.filter((item) => item.status === "live");
    for (const category of live) {
      assert.equal(
        exists("app", "tools", category.slug, "page.tsx"),
        true,
        `Missing live category page for /tools/${category.slug}`
      );
    }
  });

  it("has dynamic planned category route", () => {
    assert.equal(exists("app", "tools", "[category]", "page.tsx"), true);
    assert.ok(plannedToolCategories.length > 0);
  });

  it("has dynamic blog detail route and mapped slugs", () => {
    assert.equal(exists("app", "blog", "[slug]", "page.tsx"), true);
    const uniqueSlugs = new Set(blogPosts.map((post) => post.slug));
    assert.equal(uniqueSlugs.size, blogPosts.length, "Duplicate blog slugs found");
  });

  it("keeps tools list data file present", () => {
    assert.equal(exists("app", "data", "toolsList.ts"), true);
  });
});

describe("funnel analytics instrumentation", () => {
  it("tracks tools page view and category clicks", () => {
    const content = fs.readFileSync(routeFile("app", "tools", "page.tsx"), "utf8");
    assert.match(content, /tools_page_view/);
    assert.match(content, /tools_category_click/);
  });

  it("tracks contact page view", () => {
    const content = fs.readFileSync(routeFile("app", "contact", "page.tsx"), "utf8");
    assert.match(content, /contact_page_view/);
  });

  it("tracks join early access clicks for planned categories", () => {
    const content = fs.readFileSync(routeFile("app", "tools", "[category]", "page.tsx"), "utf8");
    assert.match(content, /planned_join_early_access_click/);
  });
});
