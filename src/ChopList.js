import React, { Component } from 'react';
import './ChopList.css';

const DEFAULT_OVERSCAN = 5;
const DEFAULT_INITIAL_ELEMENT = 10;

const HORIZONTAL_KEYS = {
  flex: 'row',
  offset: 'offsetWidth',
  dimension: 'width',
  inverse_dimension: 'height',
  scroll: 'scrollLeft'
}

const VERTICAL_KEYS = {
  flex: 'column',
  offset: 'offsetHeight',
  dimension: 'height',
  inverse_dimension: 'width',
  scroll: 'scrollTop'
}

class ChopList extends Component {

  constructor(props) {
    super(props);

    // TODO: Move to oneOf propType
    if (props.direction && ['horizontal', 'vertical'].indexOf(props.direction) < -1) {
      throw Error('Wrong direction');
    }

    const direction = props.direction || 'vertical';
    const keys = direction === 'vertical' ? VERTICAL_KEYS : HORIZONTAL_KEYS;

    this.state = {
      keys,
      offset: 0,
      overscan: DEFAULT_OVERSCAN,
      burger: 0,
      debug: false,
    };
  }

  getCurrentChildrenMeanSize() {
    const childSizes = [...this.refs.innerScrollList.children].map(child => child[this.state.keys.offset]);

    return childSizes.reduce((h1, h2) => h1 + h2) / childSizes.length;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.offset !== nextState.offset ||
           this.state.burger !== nextState.burger;
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('Render');
  }

  componentDidMount() {
    const { keys } = this.state;

    const estimatedSize = this.getCurrentChildrenMeanSize();

    this.windowSize = Math.ceil(this.refs.list[keys.offset] / estimatedSize);

    // Set real scrollbar size
    this.refs.innerScrollContainer.style[keys.dimension] = `${this.props.rowCount * estimatedSize}px`;
  }

  onScroll(event) {
    const scrollRelative = this.refs.list[this.state.keys.scroll];

    const meanSize = this.getCurrentChildrenMeanSize();
    const offset = Math.min(Math.floor(scrollRelative / meanSize), this.props.rowCount - this.windowSize - this.state.overscan);
    const burger = !offset ? 0 : (offset - this.state.overscan) * meanSize;

    if (this.state.debug) {
      console.group();
      console.log('Offset', offset);
      console.log('Element size', meanSize);
      console.log('Elements', this.props.rowCount);
      console.log('Overscan', this.state.overscan);
      console.log('WindowSize', this.refs.list.offsetSize);
      console.log('WindowSize', this.refs.list.offsetSize / meanSize);
      console.log('Total', this.props.rowCount * meanSize);
      console.log('Burger', burger);
      console.groupEnd();
    }

    this.setState({
      offset,
      burger: Math.round(burger)
    });
  }

  renderElements(renderedElements, realOffset) {
    return (
      [...Array(renderedElements)].map((x, i) =>
        { return this.props.rowRenderer({key: 'k' + (i + realOffset), index: (i + realOffset)}) }
      )
    );
  }

  render() {
    const { offset, burger, overscan, keys } = this.state;
    const realOffset = Math.max(offset - overscan, 0);

    const containerStyle = { flexDirection: keys.flex, [`${keys.inverse_dimension}`]: '100%' };
    const burgerStyle = { [`${keys.dimension}`]: burger };

    let renderedElements;

    if (this.windowSize) {
      renderedElements = this.windowSize + Math.min(offset, overscan) + Math.min(this.props.rowCount - (overscan + offset), overscan)
    } else {
      renderedElements = DEFAULT_INITIAL_ELEMENT; // TODO: Decide what for the initial render
    }

    return (
      <div ref='list' className="List" onScroll={this.onScroll.bind(this)}>
        <div ref='innerScrollContainer' className="innerScrollContainer" style={ containerStyle }>
          <div ref='burger' className="Burger" style={ burgerStyle }/>
          <div ref='innerScrollList' className="innerScrollList" style={ containerStyle }>
            {renderedElements > 0 && this.renderElements(renderedElements, realOffset)}
          </div>
        </div>
      </div>
    );
  }
};

export default ChopList;
