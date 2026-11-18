/**
 * Close the dialog or popover with this id, whichever it is. Editors are
 * hosted in modal <dialog>s (design Popover `modal`), plain popovers, or
 * directly on a page (dev routes), so they can't hard-code one API.
 */
export function closeContainer(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.matches(":popover-open")) el.hidePopover();
  else if (el instanceof HTMLDialogElement && el.open) el.close();
}
