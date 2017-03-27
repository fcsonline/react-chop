import renderer from 'react-test-renderer';
import ChopList from '../';

test('basic chop list', () => {
  const list = Array.from({length: 50}, (_, i) => i);
  const renderItem = (index) => (
    <a href="#">{ `test ${index}` }</a>
  );
  const component = renderer.create(
    <ChopList
      itemCount={list.length}
      itemRenderer={renderItem}
    />
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('horizontal chop list', () => {
  const list = Array.from({length: 30}, (_, i) => i);
  const renderItem = (index) => (
    <strong>{ `test ${index}` }</strong>
  );
  const component = renderer.create(
    <ChopList
      itemCount={list.length}
      itemRenderer={renderItem}
      direction='horizontal'
    />
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('chop list with a custom overscan', () => {
  const list = Array.from({length: 20}, (_, i) => i);
  const renderItem = (index) => (
    <strong>{ `test ${index}` }</strong>
  );
  const component = renderer.create(
    <ChopList
      itemCount={list.length}
      itemRenderer={renderItem}
      overscan={10}
    />
  );

  expect(component.toJSON()).toMatchSnapshot();
});
