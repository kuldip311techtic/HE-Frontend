import type {
  FocusEvent as ReactFocusEvent,
  MutableRefObject,
  PointerEvent as ReactPointerEvent,
} from 'react';

export function setReturnFocus(
  returnFocusRef: MutableRefObject<HTMLElement | null>,
  element: HTMLElement | null,
) {
  returnFocusRef.current = element;
}

export function captureReturnFocus(
  returnFocusRef: MutableRefObject<HTMLElement | null>,
  event: ReactPointerEvent<HTMLElement> | ReactFocusEvent<HTMLElement>,
) {
  returnFocusRef.current = event.currentTarget;
}
