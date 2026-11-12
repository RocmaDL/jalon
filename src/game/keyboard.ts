// Raccourcis clavier : chiffres pour répondre, Entrée pour valider, Échap pour quitter,
// flèches pour les flashcards.

import {
  check,
  clearSlot,
  closeModal,
  cont,
  fcAnswer,
  fcFlip,
  leave,
  pairPick,
  pickTile,
  popOrder,
  postNext,
  pushOrder,
  retryCheckpoint,
  selectOption,
  setConfirm,
  setSelection,
} from "./actions";
import { LS, S, modal } from "./store";

export function handleKey(e: KeyboardEvent): void {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key;
  const inInput = (e.target as HTMLElement | null)?.tagName === "INPUT";

  if (modal) {
    if (k === "Escape") closeModal();
    return;
  }

  const ls = LS;
  if (!ls) {
    if (inInput) return;
    const fc = S.fc;
    if (S.tab === "practice" && S.sub === "flash" && fc && fc.queue.length) {
      if (k === " " || k === "ArrowUp" || k === "ArrowDown") {
        e.preventDefault();
        fcFlip();
      } else if (k === "ArrowRight") {
        e.preventDefault();
        if (fc.flip) fcAnswer(true);
        else fcFlip();
      } else if (k === "ArrowLeft" && fc.flip) {
        e.preventDefault();
        fcAnswer(false);
      }
    }
    return;
  }

  if (ls.state === "post") {
    if (k === "Enter" || k === "ArrowRight") {
      e.preventDefault();
      postNext();
    }
    return;
  }
  if (ls.state === "fail") {
    if (k === "Enter") {
      e.preventDefault();
      retryCheckpoint();
    } else if (k === "Escape") leave();
    return;
  }
  if (ls.state === "nohearts") {
    if (k === "Escape") leave();
    return;
  }
  if (ls.confirm) {
    if (k === "Escape" || k === "Enter") {
      e.preventDefault();
      if (k === "Escape") setConfirm(false);
      else leave();
    }
    return;
  }
  if (k === "Escape") {
    e.preventDefault();
    setConfirm(true);
    return;
  }

  const ex = ls.queue[0];
  if (!ex) return;
  if (ls.phase === "chk") {
    if (k === "Enter" || k === "ArrowRight") {
      e.preventDefault();
      cont();
    }
    return;
  }
  if (ex.type === "type") {
    if (k === "Enter") {
      e.preventDefault();
      check(false);
    }
    return;
  }
  if (inInput) return;

  let used = true;
  if (ex.type === "choice" || ex.type === "tf") {
    const n = ex.opts.length;
    if (/^[1-9]$/.test(k) && +k <= n) selectOption(+k - 1);
    else if (k === "ArrowDown") setSelection(ex.sel === null ? 0 : (ex.sel + 1) % n);
    else if (k === "ArrowUp") setSelection(ex.sel === null ? n - 1 : (ex.sel + n - 1) % n);
    else if (ex.type === "tf" && k === "ArrowLeft") setSelection(0);
    else if (k === "Enter" || k === "ArrowRight") check(false);
    else used = false;
  } else if (ex.type === "blank") {
    if (/^[1-4]$/.test(k)) pickTile(+k - 1);
    else if (k === "Backspace") clearSlot();
    else if (k === "Enter" || k === "ArrowRight") check(false);
    else used = false;
  } else if (ex.type === "order") {
    if (/^[1-9]$/.test(k) && +k <= ex.bank.length) pushOrder(ex.bank[+k - 1]);
    else if (k === "Backspace") popOrder();
    else if (k === "Enter" || k === "ArrowRight") check(false);
    else used = false;
  } else if (ex.type === "pairs") {
    if (/^[1-4]$/.test(k) && ex.left[+k - 1] !== undefined) pairPick("l", ex.left[+k - 1]);
    else if (/^[5-8]$/.test(k) && ex.right[+k - 5] !== undefined) pairPick("r", ex.right[+k - 5]);
    else used = false;
  } else used = false;
  if (used) e.preventDefault();
}
