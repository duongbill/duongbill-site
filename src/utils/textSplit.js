export const splitText = (element) => {
  if (!element) return () => {};

  const original = element.textContent ?? '';
  element.setAttribute('data-split-original', original);
  element.innerHTML = '';

  const parts = original.split(/(\s+)/);
  parts.forEach((part) => {
    if (part.trim() === '') {
      element.appendChild(document.createTextNode(part));
      return;
    }

    const span = document.createElement('span');
    span.className = 'split-word';
    span.textContent = part;
    element.appendChild(span);
  });

  return () => {
    element.textContent = original;
    element.removeAttribute('data-split-original');
  };
};
