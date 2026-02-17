#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
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
    name: "@tempots/native",
    dir: "packages/tempots-native",
    priority: 3,
    dependencies: ["@tempots/core", "@tempots/render"],
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

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");

  if (fs.existsSync(packageLibPath)) {
    const packageLibJson = JSON.parse(fs.readFileSync(packageLibPath, "utf8"));
    packageLibJson.version = newVersion;

    if (packageLibJson.peerDependencies) {
      for (const [depName, depVersion] of Object.entries(updatedDependencies)) {
        if (packageLibJson.peerDependencies[depName]) {
          packageLibJson.peerDependencies[depName] = `^${depVersion}`;
          console.log(`   Updated ${depName} to ^${depVersion}`);
        }
      }
    }

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
    console.log(`\n  Skipping build for ${pkg.name} (dist-only)`);
    return true;
  }

  const absolutePackageDir = path.join(process.cwd(), pkg.dir);
  const packageJson = JSON.parse(fs.readFileSync(path.join(absolutePackageDir, "package.json"), "utf8"));

  if (!packageJson.scripts || !packageJson.scripts.build) {
    console.log(`\n  Skipping build for ${pkg.name} (no build script)`);
    return true;
  }

  console.log(`\n  Building ${pkg.name}...`);
  try {
    execSync("pnpm build", { cwd: absolutePackageDir, stdio: "inherit" });

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
    console.error(`  Build failed for ${pkg.name}`);
    return false;
  }
}

function publishPackage(pkg) {
  console.log(`\n  Publishing ${pkg.name}...`);
  const absolutePackageDir = path.join(process.cwd(), pkg.dir);

  try {
    const distDir = path.join(absolutePackageDir, "dist");
    const publishDir = fs.existsSync(distDir) ? "dist" : ".";

    const packagePath = path.join(absolutePackageDir, publishDir, "package.json");
    const version = getVersion(packagePath);

    const args = ["--access public", "--no-git-checks"];
    if (version.includes("next")) {
      args.push("--tag next");
    }

    const publishCommand = `pnpm publish ${publishDir} ${args.join(" ")}`;
    execSync(publishCommand, { cwd: absolutePackageDir, stdio: "inherit" });

    console.log(`  Published ${pkg.name}@${version}`);
    return true;
  } catch (error) {
    console.error(`  Publish failed for ${pkg.name}`);
    return false;
  }
}

async function ensureNpmAuth() {
  try {
    execSync("npm whoami", { stdio: "pipe" });
  } catch {
    console.log("\n  Not logged in to npm. Running `npm login`...\n");
    execSync("npm login", { stdio: "inherit" });
    // Verify login succeeded
    try {
      execSync("npm whoami", { stdio: "pipe" });
    } catch {
      console.error("\n  npm login failed. Aborting.\n");
      process.exit(1);
    }
  }
}

async function main() {
  // Dynamic import for ESM-only inquirer
  const { default: inquirer } = await import("inquirer");

  console.log("\n  Tempo Package Publisher\n");

  // Step 1: Load versions for all packages
  const packagesWithVersions = PACKAGES.map((pkg) => {
    const packagePath = getPackageJsonPath(pkg);
    const version = getVersion(packagePath);
    return { ...pkg, currentVersion: version };
  });

  // Step 2: Select which packages to publish (checkbox multi-select)
  const { selected } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selected",
      message: "Select packages to publish:",
      choices: packagesWithVersions.map((pkg) => ({
        name: `${pkg.name}  (${pkg.currentVersion})`,
        value: pkg.name,
        short: pkg.name,
      })),
      validate: (answer) =>
        answer.length > 0 || "Select at least one package.",
    },
  ]);

  const selectedPackages = packagesWithVersions.filter((pkg) =>
    selected.includes(pkg.name)
  );

  // Step 3: For each selected package, pick a version bump type
  const publishPlan = [];

  for (const pkg of selectedPackages) {
    const choices = {
      patch: incrementVersion(pkg.currentVersion, "patch"),
      minor: incrementVersion(pkg.currentVersion, "minor"),
      major: incrementVersion(pkg.currentVersion, "major"),
      next: incrementVersion(pkg.currentVersion, "next"),
    };

    const { bumpType } = await inquirer.prompt([
      {
        type: "select",
        name: "bumpType",
        message: `${pkg.name} (${pkg.currentVersion}) — version bump:`,
        choices: [
          { name: `patch  ${choices.patch}`, value: "patch" },
          { name: `minor  ${choices.minor}`, value: "minor" },
          { name: `major  ${choices.major}`, value: "major" },
          { name: `next   ${choices.next}`, value: "next" },
        ],
        default: "patch",
      },
    ]);

    publishPlan.push({
      ...pkg,
      type: bumpType,
      oldVersion: pkg.currentVersion,
      newVersion: choices[bumpType],
    });
  }

  // Step 4: Show summary and confirm
  console.log("\n" + "=".repeat(60));
  console.log("  PUBLISH PLAN");
  console.log("=".repeat(60));

  for (const p of publishPlan) {
    console.log(`  ${p.name}:  ${p.oldVersion}  ->  ${p.newVersion}  (${p.type})`);
  }

  const skipped = packagesWithVersions.filter(
    (pkg) => !selected.includes(pkg.name)
  );
  if (skipped.length > 0) {
    console.log("\n  Skipping:");
    for (const p of skipped) {
      console.log(`  ${p.name}  (${p.currentVersion})`);
    }
  }

  console.log("\n" + "=".repeat(60));

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: "Proceed with publishing?",
      default: false,
    },
  ]);

  if (!confirmed) {
    console.log("\n  Publishing cancelled.\n");
    process.exit(0);
  }

  await ensureNpmAuth();

  // Step 5: Update versions
  console.log("\n  Updating versions...\n");
  const updatedVersions = {};

  for (const plan of publishPlan) {
    console.log(`  ${plan.name} -> ${plan.newVersion}`);
    updatePackageVersions(plan, plan.newVersion, updatedVersions);
    updatedVersions[plan.name] = plan.newVersion;
  }

  // Step 6: Build and publish in order
  console.log("\n  Building and publishing...\n");

  for (const plan of publishPlan) {
    const buildSuccess = buildPackage(plan);
    if (!buildSuccess) {
      console.error(`\n  Stopping due to build failure in ${plan.name}`);
      process.exit(1);
    }

    const publishSuccess = publishPackage(plan);
    if (!publishSuccess) {
      console.error(`\n  Stopping due to publish failure in ${plan.name}`);
      process.exit(1);
    }
  }

  // Step 7: Summary
  console.log("\n" + "=".repeat(60));
  console.log("  DONE\n");
  for (const p of publishPlan) {
    console.log(`  ${p.name}@${p.newVersion}`);
  }
  console.log("\n" + "=".repeat(60) + "\n");
}

main().catch((error) => {
  console.error("\n  Error:", error);
  process.exit(1);
});
