import { access, cp, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path, { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

const extensionId = 'builtindraw'

const assertFileExists = async (file: string): Promise<void> => {
  try {
    await access(file)
  } catch {
    throw new Error(`Expected static build file to exist: ${file}`)
  }
}

const readJson = async <T>(file: string): Promise<T> => {
  const content = await readFile(file, 'utf8')
  return JSON.parse(content) as T
}

const assertDrawExtensionEntry = (
  entries: readonly Record<string, unknown>[],
  file: string,
): Record<string, unknown> => {
  const entry = entries.find((entry) => entry.id === extensionId)
  if (!entry) {
    throw new Error(`Expected ${file} to include ${extensionId}`)
  }
  return entry
}

const assertStaticDrawExtension = async (commitHash: string): Promise<void> => {
  const commitDir = path.join(root, 'dist', commitHash)
  const extensionDir = path.join(commitDir, 'extensions', extensionId)
  const extensionJsonPath = path.join(extensionDir, 'extension.json')
  const extensionsJsonPath = path.join(commitDir, 'config', 'extensions.json')
  const webExtensionsJsonPath = path.join(
    commitDir,
    'config',
    'webExtensions.json',
  )

  await assertFileExists(extensionJsonPath)

  const extensionJson =
    await readJson<Record<string, unknown>>(extensionJsonPath)
  if (typeof extensionJson.browser !== 'string' || !extensionJson.browser) {
    throw new Error(`Expected ${extensionJsonPath} to define a browser entry`)
  }
  await assertFileExists(path.join(extensionDir, extensionJson.browser))

  const rpcEntries = extensionJson.rpc
  if (!Array.isArray(rpcEntries)) {
    throw new Error(`Expected ${extensionJsonPath} to define RPC workers`)
  }
  const exportWorker = rpcEntries.find(
    (entry) =>
      entry &&
      typeof entry === 'object' &&
      'id' in entry &&
      entry.id === 'builtindraw.export-worker',
  )
  if (
    !exportWorker ||
    typeof exportWorker !== 'object' ||
    !('url' in exportWorker) ||
    typeof exportWorker.url !== 'string'
  ) {
    throw new Error(
      `Expected ${extensionJsonPath} to define the Draw export worker`,
    )
  }
  await assertFileExists(path.join(extensionDir, exportWorker.url))

  const extensionsJson =
    await readJson<readonly Record<string, unknown>[]>(extensionsJsonPath)
  const extensionEntry = assertDrawExtensionEntry(
    extensionsJson,
    extensionsJsonPath,
  )
  const expectedPathSuffix = `/${commitHash}/extensions/${extensionId}`
  if (
    typeof extensionEntry.path !== 'string' ||
    !extensionEntry.path.endsWith(expectedPathSuffix)
  ) {
    throw new Error(
      `Expected ${extensionsJsonPath} path for ${extensionId} to end with ${expectedPathSuffix}, got ${extensionEntry.path}`,
    )
  }

  const webExtensionsJson = await readJson<readonly Record<string, unknown>[]>(
    webExtensionsJsonPath,
  )
  assertDrawExtensionEntry(webExtensionsJson, webExtensionsJsonPath)

  const workerPath = path.join(
    commitDir,
    'packages',
    'extension-management-worker',
    'dist',
    'extensionManagementWorkerMain.js',
  )
  const worker = await readFile(workerPath, 'utf8')
  const requiredRuntimeContext = [
    `return typeof assetDir !== 'string' || assetDir.length === 0;`,
    `const getRuntimeContext = async (assetDir, platform) => {`,
    `isHttpLocation() && isStaticHttpAssetDir(resolvedAssetDir)`,
    `platform: Web`,
  ]
  if (requiredRuntimeContext.some((snippet) => !worker.includes(snippet))) {
    throw new Error(
      `Expected ${workerPath} to include static web runtime context resolution`,
    )
  }
}

const serverPackagePath = join(root, 'packages', 'server', 'package.json')
const serverRequire = createRequire(serverPackagePath)
const sharedProcessPath = serverRequire.resolve('@lvce-editor/shared-process')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

const { exportStatic } = sharedProcess

await import('./build.ts')

await cp(path.join(root, 'dist'), path.join(root, 'dist2'), {
  recursive: true,
  force: true,
})

const { commitHash } = await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

await cp(
  path.join(root, 'dist2'),
  path.join(root, 'dist', commitHash, 'extensions', extensionId),
  { recursive: true, force: true },
)

await assertStaticDrawExtension(commitHash)
