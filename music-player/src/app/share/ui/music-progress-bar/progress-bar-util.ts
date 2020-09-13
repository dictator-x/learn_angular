export function clearEventDefaultAndPropoagation(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}
