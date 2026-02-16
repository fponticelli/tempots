#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { execSync } = require("child_process");
const { getVersion, incrementVersion } = require("./version");

// Define packages in dependency order (dependencies first, dependents later)
const PACKAGES = [
  {
    name: "@tempots/core",
    dir: "packages/tempots-core",
    priority: 1,
    dependencies: [],
  },
  {
    name: "@tempots/render",
    dir: "packages/tempots-render",
    priority: 1.5,
    dependencies: ["@tempots/core"],
    // Pre-built package: no src, no build step, version lives in dist/package.json
    distOnly: true,
  },
  {
    name: "@tempots/std",
    dir: "packages/tempots-std",
    priority: 4,
    dependencies: [],
  },
  {
    name: "@tempots/dom",
    dir: "packages/tempots-dom",
    priority: 2,
    dependencies: ["@tempots/core"],
  },
  {
    name: "@tempots/ui",
    dir: "packages/tempots-ui",
    priority: 8,
    dependencies: ["@tempots/dom", "@tempots/std"],
  },
  {
    name: "@tempots/server",
    dir: "packages/tempots-server",
    priority: 5,
    dependencies: ["@tempots/core", "@tempots/dom"],
  },
  {
    name: "@tempots/client",
    dir: "packages/tempots-client",
    priority: 5,
    dependencies: ["@tempots/core", "@tempots/dom"],
  },
  {
    name: "@tempots/vite",
    dir: "packages/tempots-vite",
    priority: 6,
    dependencies: ["@tempots/dom", "@tempots/server"],
  },
  {
    name: "@tempots/eslint-plugin",
    dir: "packages/tempots-eslint-plugin",
    priority: 10,
    dependencies: [],
  },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function getPublishChoice(packageInfo, currentVersion) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📦 ${packageInfo.name}${packageInfo.distOnly ? " (dist-only)" : ""}`);
  console.log(`   Current version: ${currentVersion}`);
  console.log(`${"=".repeat(60)}`);

  const choices = {
    patch: incrementVersion(currentVersion, "patch"),
    minor: incrementVersion(currentVersion, "minor"),
    major: incrementVersion(currentVersion, "major"),
    next: incrementVersion(currentVersion, "next"),
  };

  console.log("\nVersion options:");
  console.log(`  1) patch → ${choices.patch}`);
  console.log(`  2) minor → ${choices.minor}`);
  console.log(`  3) major → ${choices.major}`);
  console.log(`  4) next  → ${choices.next}`);
  console.log(`  5) skip (don't publish)`);

  const answer = await question("\nYour choice (1-5, default: 5): ");
  const choice = answer.trim() || "5";

  switch (choice) {
    case "1":
      return { type: "patch", newVersion: choices.patch };
    case "2":
      return { type: "minor", newVersion: choices.minor };
    case "3":
      return { type: "major", newVersion: choices.major };
    case "4":
      return { type: "next", newVersion: choices.next };
    case "5":
    default:
      return { type: "skip", newVersion: null };
  }
}

/**
 * Resolves the path to the package.json used for reading the current version.
 * For dist-only packages, this is dist/package.json.
 * For regular packages, this is package.json at the package root.
 */
function getPackageJsonPath(pkg) {
  if (pkg.distOnly) {
    return path.join(process.cwd(), pkg.dir, "dist", "package.json");
  }
  return path.join(process.cwd(), pkg.dir, "package.json");
}

function updatePackageVersions(pkg, newVersion, updatedDependencies) {
  if (pkg.distOnly) {
    // For dist-only packages, update dist/package.json directly
    const distPackagePath = path.join(process.cwd(), pkg.dir, "dist", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(distPackagePath, "utf8"));
    packageJson.version = newVersion;

    // Update dependencies with new versions of @tempots/* packages
    if (packageJson.dependencies) {
      for (const [depName, depVersion] of Object.entries(updatedDependencies)) {
        if (packageJson.dependencies[depName]) {
          packageJson.dependencies[depName] = `^${depVersion}`;
          console.log(`   Updated dependency ${depName} to ^${depVersion}`);
        }
      }
    }
    if (packageJson.peerDependencies) {
      for (const [depName, depVersion] of Object.entries(updatedDependencies)) {
        if (packageJson.peerDependencies[depName]) {
          packageJson.peerDependencies[depName] = `^${depVersion}`;
          console.log(`   Updated peerDependency ${depName} to ^${depVersion}`);
        }
      }
    }

    fs.writeFileSync(distPackagePath, JSON.stringify(packageJson, null, 2) + "\n");
    return;
  }

  // Regular package: update both package.json and package.lib.json
  const packagePath = path.join(process.cwd(), pkg.dir, "package.json");
  const packageLibPath = path.join(process.cwd(), pkg.dir, "package.lib.json");

  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");

  // Update package.lib.json if it exists
  if (fs.existsSync(packageLibPath)) {
    const packageLibJson = JSON.parse(fs.readFileSync(packageLibPath, "utf8"));
    packageLibJson.version = newVersion;

    // Update peerDependencies with new versions of @tempots/* packages
    if (packageLibJson.peerDependencies) {
      for (const [depName, depVersion] of Object.entries(updatedDependencies)) {
        if (packageLibJson.peerDependencies[depName]) {
          packageLibJson.peerDependencies[depName] = `^${depVersion}`;
          console.log(`   Updated ${depName} to ^${depVersion}`);
        }
      }
    }

    // Update dependencies with new versions of @tempots/* packages
    if (packageLibJson.dependencies) {
      for (const [depName, depVersion] of Object.entries(updatedDependencies)) {
        if (packageLibJson.dependencies[depName]) {
          packageLibJson.dependencies[depName] = `^${depVersion}`;
          console.log(`   Updated dependency ${depName} to ^${depVersion}`);
        }
      }
    }

    fs.writeFileSync(
      packageLibPath,
      JSON.stringify(packageLibJson, null, 2) + "\n"
    );
  }
}

function buildPackage(pkg) {
  if (pkg.distOnly) {
    console.log(`\n⏭️  Skipping build for ${pkg.name} (dist-only)`);
    return true;
  }

  console.log(`\n🔨 Building ${pkg.name}...`);
  const absolutePackageDir = path.join(process.cwd(), pkg.dir);
  try {
    execSync("pnpm build", { cwd: absolutePackageDir, stdio: "inherit" });

    // Copy README if it exists
    const readmePath = path.join(absolutePackageDir, "README.md");
    const distPath = path.join(absolutePackageDir, "dist");
    if (fs.existsSync(readmePath) && fs.existsSync(distPath)) {
      execSync("cp README.md dist/", {
        cwd: absolutePackageDir,
        stdio: "inherit",
      });
    }

    return true;
  } catch (error) {
    console.error(`❌ Build failed for ${pkg.name}`);
    return false;
  }
}

async function confirmPublish(publishPlan) {
  console.log("\n" + "=".repeat(60));
  console.log("📋 PUBLISH PLAN SUMMARY");
  console.log("=".repeat(60));

  const toPublish = publishPlan.filter((p) => p.type !== "skip");

  if (toPublish.length === 0) {
    console.log("\n⚠️  No packages selected for publishing.");
    return false;
  }

  console.log("\nPackages to publish:");
  toPublish.forEach((p) => {
    const suffix = p.distOnly ? " (dist-only)" : "";
    console.log(`  • ${p.name}: ${p.oldVersion} → ${p.newVersion} (${p.type})${suffix}`);
  });

  console.log("\nPackages to skip:");
  const skipped = publishPlan.filter((p) => p.type === "skip");
  if (skipped.length > 0) {
    skipped.forEach((p) => {
      console.log(`  • ${p.name}: ${p.oldVersion} (no change)`);
    });
  } else {
    console.log("  (none)");
  }

  console.log("\n" + "=".repeat(60));
  const answer = await question("\n✅ Proceed with publishing? (y/N): ");
  return answer.trim().toLowerCase() === "y";
}

async function publishPackage(pkg) {
  console.log(`\n🚀 Publishing ${pkg.name}...`);
  const absolutePackageDir = path.join(process.cwd(), pkg.dir);

  try {
    const distDir = path.join(absolutePackageDir, "dist");
    const publishDir = fs.existsSync(distDir) ? "dist" : ".";

    const packagePath = path.join(
      absolutePackageDir,
      publishDir,
      "package.json"
    );
    const version = getVersion(packagePath);

    const args = ["--access public", "--no-git-checks"];
    if (version.includes("next")) {
      args.push("--tag next");
    }

    const publishCommand = `pnpm publish ${publishDir} ${args.join(" ")}`;
    execSync(publishCommand, { cwd: absolutePackageDir, stdio: "inherit" });

    console.log(`✅ Successfully published ${pkg.name}@${version}`);
    return true;
  } catch (error) {
    console.error(`❌ Publish failed for ${pkg.name}`);
    return false;
  }
}

async function main() {
  console.log("🎯 Interactive Package Publishing Tool");
  console.log("=".repeat(60));

  // Step 1: Collect publish choices for each package
  const publishPlan = [];

  for (const pkg of PACKAGES) {
    const packagePath = getPackageJsonPath(pkg);
    const currentVersion = getVersion(packagePath);

    const choice = await getPublishChoice(pkg, currentVersion);

    publishPlan.push({
      ...pkg,
      type: choice.type,
      oldVersion: currentVersion,
      newVersion: choice.newVersion,
    });
  }

  // Step 2: Show summary and confirm
  const confirmed = await confirmPublish(publishPlan);

  if (!confirmed) {
    console.log("\n❌ Publishing cancelled.");
    rl.close();
    process.exit(0);
  }

  // Step 3: Update versions and build packages
  console.log("\n" + "=".repeat(60));
  console.log("📝 UPDATING VERSIONS");
  console.log("=".repeat(60));

  const updatedVersions = {};

  for (const plan of publishPlan) {
    if (plan.type === "skip") continue;

    console.log(`\n📝 Updating ${plan.name} to ${plan.newVersion}...`);
    updatePackageVersions(plan, plan.newVersion, updatedVersions);
    updatedVersions[plan.name] = plan.newVersion;
  }

  // Step 4: Build and publish packages in order
  console.log("\n" + "=".repeat(60));
  console.log("🔨 BUILDING AND PUBLISHING");
  console.log("=".repeat(60));

  for (const plan of publishPlan) {
    if (plan.type === "skip") continue;

    const buildSuccess = buildPackage(plan);
    if (!buildSuccess) {
      console.error(`\n❌ Stopping due to build failure in ${plan.name}`);
      rl.close();
      process.exit(1);
    }

    const publishSuccess = await publishPackage(plan);
    if (!publishSuccess) {
      console.error(`\n❌ Stopping due to publish failure in ${plan.name}`);
      rl.close();
      process.exit(1);
    }
  }

  // Step 5: Summary
  console.log("\n" + "=".repeat(60));
  console.log("✅ PUBLISHING COMPLETE");
  console.log("=".repeat(60));

  const published = publishPlan.filter((p) => p.type !== "skip");
  console.log(`\nSuccessfully published ${published.length} package(s):`);
  published.forEach((p) => {
    console.log(`  ✅ ${p.name}@${p.newVersion}`);
  });

  rl.close();
}

main().catch((error) => {
  console.error("\n❌ Error:", error);
  rl.close();
  process.exit(1);
});
