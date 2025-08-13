import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return isObject(error) && 'status' in error
}

export function isSerializedError(error: unknown): error is SerializedError {
  return isObject(error) && 'message' in error
}

function pickBackendMessage(data: unknown): string | undefined {
  if (!isObject(data)) return undefined
  const val = data.error
  return typeof val === 'string' ? val : undefined
}

export function extractErrorMessage(e: unknown): string {
  if (isFetchBaseQueryError(e)) {
    // case 1: typical HTTP error like { status: 400, data: { error: '...' } }
    const msgFromData = 'data' in e ? pickBackendMessage((e as { data?: unknown }).data) : undefined
    if (msgFromData) return msgFromData

    // case 2: network/timeout/parsing style objects often have a string `error`
    const raw = (e as { error?: unknown }).error
    if (typeof raw === 'string') return raw

    const status = (e as { status?: unknown }).status
    if (status === 'FETCH_ERROR') return 'Network error'
    if (status === 'TIMEOUT_ERROR') return 'Request timed out'
    if (status === 'PARSING_ERROR') return 'Response parsing error'

    return 'Request failed'
  }

  if (isSerializedError(e)) {
    return typeof e.message === 'string' && e.message.length > 0 ? e.message : 'Unknown error'
  }

  return 'Unknown error'
}