## react-chop

[![Build Status](https://travis-ci.org/react-chop/react-chop.svg?branch=master)](https://travis-ci.org/react-chop/react-chop)
![NPM version](https://img.shields.io/npm/v/react-chop.svg?style=flat)
![NPM license](https://img.shields.io/npm/l/react-chop.svg?style=flat)
![NPM total downloads](https://img.shields.io/npm/dt/react-chop.svg?style=flat)
![NPM monthly downloads](https://img.shields.io/npm/dm/react-chop.svg?style=flat)

A react-virtualized alternative without measuring.

> *Let the browser do its job* — Ferran Basora

Check this out:

![react-chop](https://cloud.githubusercontent.com/assets/135988/24015189/fb8c00de-0a87-11e7-9808-00256a43333e.gif)

Some demos: [here](https://)

## Install

```
npm install react-chop --save
```

or:

```
yarn add react-chop
```

## Example

For example, take the following code:

```js
import ChopList from 'react-chop';

const SIZE = 10000;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list: Array.from({length: SIZE}, (_, i) => i)
    };
  }

  itemRenderer ({ key, index, style}) {
    const { list } = this.state;

    return (
        <div key={key} className='Item'>
          {list[index]}
        </div>
    )
  }

  render () {
    const { list } = this.state;

    <ChopList
      itemCount={list.length}
      itemRenderer={this.itemRenderer.bind(this)}
    />
  }
}
```
