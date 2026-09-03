/**
 * Tiny external store for the menu overlay.
 *
 * The overlay is mounted once at the app root while the button that opens it
 * lives inside the nav, so the two need shared state. A module-level store read
 * through `useSyncExternalStore` keeps that out of the render tree — no extra
 * provider wrapping every route just to carry one boolean.
 */

let open = false
const listeners = new Set<() => void>()

const emit = () => {
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const menuStore = {
  subscribe,
  getSnapshot: () => open,
  /* The overlay never renders on the server, so it is always closed there. */
  getServerSnapshot: () => false,
  open() {
    if (open) return
    open = true
    emit()
  },
  close() {
    if (!open) return
    open = false
    emit()
  },
  toggle() {
    open = !open
    emit()
  },
}
