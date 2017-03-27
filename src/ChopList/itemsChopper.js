// TODO: Simplify contract providing just offset and count. Normalize values
// is not a responsibility of this function
export function getItemsRangeToRender({ itemCount, windowCount, offset, overscan }) {
  // Offset range goes from 0 to itemCount - 1
  const normalizedOffset = Math.max(0, Math.min(offset, itemCount - 1));
  const previousOverscanCount = Math.min(normalizedOffset, overscan);
  const nextOverscanCount = Math.min(itemCount - (overscan + normalizedOffset), overscan);

  const itemsCountToRender = Math.min(previousOverscanCount + windowCount + nextOverscanCount, itemCount);
  const renderOffset = Math.max(normalizedOffset - overscan, 0);

  return Array
    .from({length: itemsCountToRender}, (_, i) => renderOffset + i)
    .filter((i) => i < itemCount);
}

export function  getNextScrollState({ itemCount, windowCount, estimatedItemSize, overscan, currentScrollPosition }) {
  const startIndex = Math.floor(currentScrollPosition / estimatedItemSize);
  const maxIndex = Math.max(0, itemCount - windowCount - overscan);
  const offset = Math.min(startIndex, maxIndex);
  const burgerCount = Math.max(0, offset - overscan);

  return {
    offset: offset,
    burgerCount
  };
}
