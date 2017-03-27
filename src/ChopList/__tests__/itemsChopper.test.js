import { getItemsRangeToRender, getNextScrollState } from '../itemsChopper';

test('base', () => {
  const actual = getItemsRangeToRender({
    itemCount: 30,
    windowCount: 5,
    offset: 0,
    overscan: 5,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('base 2', () => {
  const actual = getItemsRangeToRender({
    itemCount: 30,
    windowCount: 5,
    offset: 15,
    overscan: 5,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('base 3', () => {
  const actual = getItemsRangeToRender({
    itemCount: 5,
    windowCount: 10,
    offset: 0,
    overscan: 5,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('no items', () => {
  const actual = getItemsRangeToRender({
    itemCount: 0,
    windowCount: 10,
    offset: 0,
    overscan: 5,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('no overscan', () => {
  const actual = getItemsRangeToRender({
    itemCount: 10,
    windowCount: 5,
    offset: 2,
    overscan: 0,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('windowCount of 1', () => {
  const actual = getItemsRangeToRender({
    itemCount: 10,
    windowCount: 1,
    offset: 5,
    overscan: 0,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('offset greather than itemCount', () => {
  const actual = getItemsRangeToRender({
    itemCount: 10,
    windowCount: 5,
    offset: 11,
    overscan: 0,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('offset less than 0', () => {
  const actual = getItemsRangeToRender({
    itemCount: 10,
    windowCount: 5,
    offset: -2,
    overscan: 0,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('windowCount equal to offset', () => {
  const actual = getItemsRangeToRender({
    itemCount: 1,
    windowCount: 1,
    offset: 1,
    overscan: 0,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('overscan greather than itemCount', () => {
  const actual = getItemsRangeToRender({
    itemCount: 5,
    windowCount: 2,
    offset: 0,
    overscan: 10,
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('initial scroll', () => {
  const actual = getNextScrollState({
    itemCount: 30,
    windowCount: 5,
    estimatedItemSize: 50,
    overscan: 5,
    currentScrollPosition: 0
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('scroll to middle', () => {
  const actual = getNextScrollState({
    itemCount: 30,
    windowCount: 5,
    estimatedItemSize: 50,
    overscan: 5,
    currentScrollPosition: 420
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('scroll to bottom', () => {
  const actual = getNextScrollState({
    itemCount: 30,
    windowCount: 5,
    estimatedItemSize: 50,
    overscan: 5,
    currentScrollPosition: 1100
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});

test('scroll with empty list', () => {
  const actual = getNextScrollState({
    itemCount: 0,
    windowCount: 0,
    estimatedItemSize: 0,
    overscan: o,
    currentScrollPosition: 0
  });

  expect(JSON.stringify(actual)).toMatchSnapshot();
});
