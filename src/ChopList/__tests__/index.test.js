import React from 'react';
import renderer from 'react-test-renderer';
import ChopList from '../';

test('basic chop list', () => {
  const list = Array.from({length: 50}, (_, i) => i);
  const renderItem = ({key, index}) => (
    <a key={key} href="#">{ `test ${index}` }</a>
  );
  const component = renderer.create(
    <div style={ { height: 200 } }>
      <ChopList
        itemCount={list.length}
        itemRenderer={renderItem}
      />
    </div>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('horizontal chop list', () => {
  const list = Array.from({length: 30}, (_, i) => i);
  const renderItem = ({key, index}) => (
    (<strong key={key}>{ `test ${index}` }</strong>)
  );
  const component = renderer.create(
    <div style={ { height: 200, width: 600 } }>
      <ChopList
        itemCount={list.length}
        itemRenderer={renderItem}
        direction='horizontal'
      />
    </div>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('chop list with a custom overscan', () => {
  const list = Array.from({length: 20}, (_, i) => i);
  const renderItem = ({key, index}) => {
    return (
        <strong key={key}>{ `test ${index}` }</strong>
    );
  };
  const component = renderer.create(
    <div style={ { height: 200 } }>
      <ChopList
        itemCount={list.length}
        itemRenderer={renderItem}
        overscan={10}
      />
    </div>
  );

  expect(component.toJSON()).toMatchSnapshot();
});
