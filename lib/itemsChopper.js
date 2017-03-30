'use strict';

exports.__esModule = true;
exports.getItemsRangeToRender = getItemsRangeToRender;
exports.getNextScrollState = getNextScrollState;
exports.getFinalBufferingState = getFinalBufferingState;
exports.getNextBufferingState = getNextBufferingState;
function getItemsRangeToRender(_ref) {
  var itemCount = _ref.itemCount,
      windowCount = _ref.windowCount,
      offset = _ref.offset,
      overscan = _ref.overscan;

  console.assert(offset >= 0, 'Offset must be positive');
  console.assert(!offset || offset < itemCount, 'Offset must be less than itemCount');

  var previousOverscanCount = Math.min(offset, overscan);
  var nextOverscanCount = Math.min(itemCount - (overscan + offset), overscan);

  var itemsCountToRender = Math.min(previousOverscanCount + windowCount + nextOverscanCount, itemCount);
  var renderOffset = Math.max(offset - overscan, 0);

  return Array.from({ length: itemsCountToRender }, function (_, i) {
    return renderOffset + i;
  }).filter(function (i) {
    return i < itemCount;
  });
}

function getNextScrollState(_ref2) {
  var itemCount = _ref2.itemCount,
      windowCount = _ref2.windowCount,
      estimatedItemSize = _ref2.estimatedItemSize,
      overscan = _ref2.overscan,
      currentScrollPosition = _ref2.currentScrollPosition;

  var startIndex = Math.floor(currentScrollPosition / estimatedItemSize);
  var maxIndex = Math.max(0, itemCount - windowCount - overscan);
  var offset = Math.max(0, Math.min(startIndex, maxIndex));
  var burgerCount = Math.max(0, offset - overscan);

  return {
    offset: offset,
    burgerCount: burgerCount
  };
}

function getFinalBufferingState(_ref3) {
  var renderedItemsTotalSize = _ref3.renderedItemsTotalSize,
      renderedItemsCount = _ref3.renderedItemsCount,
      containerSize = _ref3.containerSize;

  var estimatedItemSize = renderedItemsTotalSize / renderedItemsCount;
  var newWindowCount = Math.ceil(containerSize / estimatedItemSize);

  return {
    isBuffering: false,
    windowCount: newWindowCount,
    estimatedItemSize: estimatedItemSize
  };
}

function getNextBufferingState(_ref4) {
  var renderedItemsTotalSize = _ref4.renderedItemsTotalSize,
      renderedItemsCount = _ref4.renderedItemsCount,
      containerSize = _ref4.containerSize,
      itemsCount = _ref4.itemsCount,
      shrink = _ref4.shrink,
      itemCount = _ref4.itemCount;

  var itemSize = renderedItemsTotalSize / renderedItemsCount;
  var nextBump = shrink ? itemCount : Math.round(containerSize / itemSize);

  return function (prevState) {
    return {
      isBuffering: true,
      windowCount: prevState.windowCount + nextBump
    };
  };
}