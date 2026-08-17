import { createRpc } from '@lvce-editor/api'
import type { Shape } from '../DrawState/DrawState.ts'

// cspell:ignore builtindraw

export type ExportFormat = 'jpg' | 'svg'

export interface ExportDrawingOptions {
  readonly format: ExportFormat
  readonly height: number
  readonly shapes: readonly Shape[]
  readonly width: number
}

interface Rpc {
  readonly dispose: () => Promise<void> | void
  readonly invoke: (
    method: string,
    ...params: readonly unknown[]
  ) => Promise<unknown>
}

type CreateRpc = (options: { readonly id: string }) => Promise<Rpc>

export const state: {
  createRpc: CreateRpc
  rpcPromise: Promise<Rpc> | undefined
} = {
  createRpc,
  rpcPromise: undefined,
}

const getRpc = (): Promise<Rpc> => {
  const { createRpc: createRpcFn, rpcPromise } = state
  if (rpcPromise) {
    return rpcPromise
  }
  const newRpcPromise = createRpcFn({ id: 'builtindraw.export-worker' })
  state.rpcPromise = newRpcPromise
  return newRpcPromise
}

export const exportDrawing = async (
  options: Readonly<ExportDrawingOptions>,
): Promise<Blob> => {
  const rpc = await getRpc()
  return rpc.invoke('DrawExport.export', options) as Promise<Blob>
}

export const dispose = async (): Promise<void> => {
  const { rpcPromise } = state
  state.rpcPromise = undefined
  if (!rpcPromise) {
    return
  }
  const rpc = await rpcPromise
  await rpc.dispose()
}
