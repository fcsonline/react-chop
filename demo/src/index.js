import React, { Component } from 'react';
import {render} from 'react-dom'

import './styles.css';
import ChopList from '../../src'

const SIZE = 1000;

class Demo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list: Array.from({length: SIZE}, (_, i) => i)
    };
  }

  itemRendererTextAreas({ key, index, style}) {
    const { list } = this.state;

    return (
        <div key={key} className='Item'>
          <textarea defaultValue={list[index]}/>
        </div>
    )
  }

  itemRendererDifferent ({ key, index, style}) {
    const { list } = this.state;
    const className = index % 10 === 9 ? 'BigItem' : 'Item';

    return (
        <div key={key} className={className}>
          {list[index]}
        </div>
    )
  }

  itemRenderer ({ key, index, style}) {
    const { list } = this.state;

    return (
        <div key={key} className='Item'>
          {list[index]}
        </div>
    )
  }

  itemRendererHorizontal ({ key, index, style}) {
    const { list } = this.state;

    return (
        <div key={key} className='HItem'>
          {list[index]}
        </div>
    )
  }

  itemRendererKanban ({ key, index, style}) {
    const { list } = this.state;

    return (
        <div key={key} className='KItem'>
          <strong> Tasklist {list[index]}</strong>
          <ChopList
            itemCount={list.length}
            itemRenderer={this.itemRenderer.bind(this)}
          />
        </div>
    )
  }

  onAdd() {
    const index = Math.floor(Math.random() * 10); // this.state.list.length

    console.log('Added', index);

    this.setState({
      list: [ ...this.state.list.slice(0, index), 'bar', ...this.state.list.slice(index) ]
    });
  }

  onRemove() {
    const index = Math.floor(Math.random() * 10); // this.state.list.length

    console.log('Removed', index);

    this.setState({
      list: this.state.list.slice(0, index).concat(this.state.list.slice(index + 1))

    });
  }

  onAddBegin() {
    const value = this.state.list[0] - 1;

    this.setState({
      list: [value, ...this.state.list]
    });
  }

  onRemoveBegin() {
    const index = 0;

    this.setState({
      list: this.state.list.slice(0, index).concat(this.state.list.slice(index + 1))
    });
  }

  onAddEnd() {
    const value = this.state.list[this.state.list.length - 1] + 1;

    this.setState({
      list: [...this.state.list, value]
    });
  }

  onRemoveEnd() {
    this.setState({
      list: this.state.list.slice(0, -1)
    });
  }

  onScrollTo() {
    const scrollTo = Math.floor(Math.random() * 20000);

    this.setState({
      scrollTo
    })
  }

  onScrollToItem() {
    const scrollToItem = Math.floor(Math.random() * this.state.list.length);

    this.setState({
      scrollToItem
    })
  }

  render() {
    const { list, scrollTo, scrollToItem } = this.state;

    return (
      <div className="App">
        <button onClick={this.onAddBegin.bind(this)}>Add begin</button>
        <button onClick={this.onRemoveBegin.bind(this)}>Remove begin</button>

        <button onClick={this.onAdd.bind(this)}>Add</button>
        <button onClick={this.onRemove.bind(this)}>Remove</button>

        <button onClick={this.onAddEnd.bind(this)}>Add end</button>
        <button onClick={this.onRemoveEnd.bind(this)}>Remove end</button>

        <button onClick={this.onScrollTo.bind(this)}>Scrolled to { scrollTo || '??' } px</button>
        <button onClick={this.onScrollToItem.bind(this)}>Scrolled to Item { scrollToItem || '??' }</button>

        <h1>Same heights</h1>
        <div style={ {height: '200px'} }>
          <ChopList
            itemCount={list.length}
            itemRenderer={this.itemRenderer.bind(this)}
            scrollTo={scrollTo}
            scrollToItem={scrollToItem}
          />
        </div>

        <h1>Same widths</h1>
        <div style={ {height: '200px', margin: '0 auto'} }>
          <ChopList
            itemCount={list.length}
            itemRenderer={this.itemRendererHorizontal.bind(this)}
            direction='horizontal'
            scrollTo={scrollTo}
          />
        </div>

        <h1>Kanban</h1>
        <div style={ {height: '300px'} }>
          <ChopList
            itemCount={list.length}
            itemRenderer={this.itemRendererKanban.bind(this)}
            direction='horizontal'
          />
        </div>

        {
        /*

        <h1>Empty list</h1>
        <div style={ {height: '200px'} }>
          <ChopList
            itemCount={0}
            itemRenderer={this.itemRenderer.bind(this)}
          />
        </div>

        <h1>Different heights</h1>
        <div style={ {height: '200px'} }>
          <ChopList
            itemCount={list.length}
            itemRenderer={this.itemRendererDifferent.bind(this)}
          />
        </div>

        <h1>Dynamic heights</h1>
        <ChopList
          itemCount={list.length}
          itemRenderer={this.itemRendererTextAreas.bind(this)}
        />

        */
        }

      </div>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
