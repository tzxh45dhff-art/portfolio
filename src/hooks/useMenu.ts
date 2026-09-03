import { useSyncExternalStore } from 'react'
import { menuStore } from '../lib/menuStore'

/** `[isOpen, controls]` for the global menu overlay. */
export function useMenu() {
  const isOpen = useSyncExternalStore(
    menuStore.subscribe,
    menuStore.getSnapshot,
    menuStore.getServerSnapshot,
  )
  return [isOpen, menuStore] as const
}

export default useMenu
