import type { WebR } from 'webr'
import type { RTask } from './scripts'

/**
 * WebR runtime is loaded lazily from the CDN as a native ES module so that the
 * heavy WebAssembly runtime stays out of the initial application bundle.
 * The version is pinned to match the `webr` package installed in package.json.
 */
const WEBR_MODULE_URL = 'https://webr.r-wasm.org/v0.6.0/webr.mjs'
const WORKDIR = '/home/web_user'

export interface RunCallbacks {
  onStatus: (message: string) => void
}

export interface RunResult {
  consoleText: string
  images: ImageBitmap[]
}

let webRPromise: Promise<WebR> | null = null
const installedPackages = new Set<string>()
const loadedFiles = new Set<string>()

function publicDataUrl(filename: string): string {
  const base = import.meta.env.BASE_URL || './'
  return `${base}data/${filename}`
}

function stringifyEntry(data: unknown): string {
  if (typeof data === 'string') return data
  try {
    return JSON.stringify(data)
  } catch {
    return String(data)
  }
}

async function getWebR(): Promise<WebR> {
  if (!webRPromise) {
    webRPromise = (async () => {
      const mod = (await import(/* @vite-ignore */ WEBR_MODULE_URL)) as {
        WebR: new () => WebR
      }
      const instance = new mod.WebR()
      await instance.init()
      return instance
    })().catch((error: unknown) => {
      webRPromise = null
      throw error
    })
  }
  return webRPromise
}

/**
 * Warm up the runtime and install the packages required by a task.
 * Safe to call repeatedly; work is cached across calls.
 */
export async function prepareRuntime(task: RTask, onStatus: (m: string) => void): Promise<void> {
  onStatus('Iniciando o ambiente R (WebAssembly)...')
  const webR = await getWebR()

  const missing = task.packages.filter((pkg) => !installedPackages.has(pkg))
  if (missing.length > 0) {
    onStatus(`Instalando pacotes R: ${missing.join(', ')} (pode demorar na primeira vez)...`)
    await webR.installPackages(missing)
    missing.forEach((pkg) => installedPackages.add(pkg))
  }

  for (const file of task.dataFiles) {
    if (loadedFiles.has(file)) continue
    onStatus(`Carregando dados: ${file}...`)
    const response = await fetch(publicDataUrl(file))
    if (!response.ok) {
      throw new Error(`Falha ao carregar ${file} (HTTP ${response.status})`)
    }
    const bytes = new Uint8Array(await response.arrayBuffer())
    await webR.FS.writeFile(`${WORKDIR}/${file}`, bytes)
    loadedFiles.add(file)
  }
}

/**
 * Execute a task's R code in the browser and capture its console output and
 * any generated plots (returned as ImageBitmaps).
 */
export async function runRTask(task: RTask, callbacks: RunCallbacks): Promise<RunResult> {
  await prepareRuntime(task, callbacks.onStatus)
  const webR = await getWebR()

  callbacks.onStatus('Executando análise estatística...')
  const captured = await webR.globalShelter.captureR(task.code, {
    captureGraphics: { width: 900, height: 560, capture: true },
  })

  const consoleText = captured.output.map((entry) => stringifyEntry(entry.data)).join('')

  await webR.globalShelter.purge()

  callbacks.onStatus('Concluído.')
  return { consoleText, images: captured.images }
}
