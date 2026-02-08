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
    assert.equal(exists("app", "pricing", "page.tsx"), true);
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
  it("tracks landing and conversion click events", () => {
    const home = fs.readFileSync(routeFile("app", "page.tsx"), "utf8");
    const tools = fs.readFileSync(routeFile("app", "tools", "page.tsx"), "utf8");
    const pricing = fs.readFileSync(routeFile("app", "pricing", "page.tsx"), "utf8");

    assert.match(home, /landing_view/);
    assert.match(tools, /tool_start/);
    assert.match(pricing, /upgrade_click/);
  });

  it("tracks contact page as a landing view", () => {
    const content = fs.readFileSync(routeFile("app", "contact", "page.tsx"), "utf8");
    assert.match(content, /landing_view/);
  });

  it("tracks planned category early access using tool_start", () => {
    const content = fs.readFileSync(routeFile("app", "tools", "[category]", "page.tsx"), "utf8");
    assert.match(content, /tool_start/);
  });

  it("tracks tool start and tool success events in hero tools", () => {
    const aiTool = fs.readFileSync(routeFile("app", "tools", "ai", "text-generator", "page.tsx"), "utf8");
    const mergeTool = fs.readFileSync(routeFile("app", "tools", "pdf", "merge", "page.tsx"), "utf8");
    const pdfToWordTool = fs.readFileSync(routeFile("app", "tools", "pdf", "pdf-to-word", "page.tsx"), "utf8");

    assert.match(aiTool, /tool_start/);
    assert.match(aiTool, /tool_success/);
    assert.match(mergeTool, /tool_start/);
    assert.match(mergeTool, /tool_success/);
    assert.match(pdfToWordTool, /tool_start/);
    assert.match(pdfToWordTool, /tool_success/);
  });

  it("captures email only after successful output sections", () => {
    const capture = fs.readFileSync(routeFile("components", "PostSuccessEmailCapture.tsx"), "utf8");
    assert.match(capture, /email_capture/);

    const aiTool = fs.readFileSync(routeFile("app", "tools", "ai", "text-generator", "page.tsx"), "utf8");
    const mergeTool = fs.readFileSync(routeFile("app", "tools", "pdf", "merge", "page.tsx"), "utf8");
    const pdfToWordTool = fs.readFileSync(routeFile("app", "tools", "pdf", "pdf-to-word", "page.tsx"), "utf8");

    assert.match(aiTool, /PostSuccessEmailCapture/);
    assert.match(mergeTool, /PostSuccessEmailCapture/);
    assert.match(pdfToWordTool, /PostSuccessEmailCapture/);
  });
});
