// TODO: Simplify contract providing just offset and count. Normalize values
// is not a responsibility of this function
export function getItemsRangeToRender({ itemCount, windowCount, offset, overscan }) {
  console.assert(offset >= 0, 'Offset must be positive');
  console.assert(!offset || offset < itemCount, 'Offset must be less than itemCount');

  const previousOverscanCount = Math.min(offset, overscan);
  const nextOverscanCount = Math.min(itemCount - (overscan + offset), overscan);

  const itemsCountToRender = Math.min(previousOverscanCount + windowCount + nextOverscanCount, itemCount);
  const renderOffset = Math.max(offset - overscan, 0);

  return Array
    .from({length: itemsCountToRender}, (_, i) => renderOffset + i)
    .filter((i) => i < itemCount);
}

export function getNextScrollState({ itemCount, windowCount, estimatedItemSize, overscan, currentScrollPosition }) {
  const startIndex = Math.floor(currentScrollPosition / estimatedItemSize);
  const maxIndex = Math.max(0, itemCount - windowCount - overscan);
  const offset = Math.max(0, Math.min(startIndex, maxIndex));
  const burgerCount = Math.max(0, offset - overscan);

  return {
    offset,
    burgerCount
  };
}

export function getFinalBufferingState({ renderedItemsTotalSize, renderedItemsCount, containerSize }) {
  const estimatedItemSize = renderedItemsTotalSize / renderedItemsCount;
  const newWindowCount = Math.ceil(containerSize / estimatedItemSize);

  return {
    isBuffering: false,
    windowCount: newWindowCount,
    estimatedItemSize,
  };
}

export function getNextBufferingState({ renderedItemsTotalSize, renderedItemsCount, containerSize }) {
  const itemSize = renderedItemsTotalSize / renderedItemsCount;
  const nextBump = Math.round(containerSize / itemSize);

  return (prevState) => ({
    isBuffering: true,
    windowCount: prevState.windowCount + nextBump,
  });
}
