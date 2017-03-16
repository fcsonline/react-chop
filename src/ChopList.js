import React, { Component } from 'react';
import './ChopList.css';

const DEFAULT_OVERSCAN = 5;
const DEFAULT_INITIAL_ELEMENTS = 10;

const HORIZONTAL_DIRECTION = 'horizontal';
const VERTICAL_DIRECTION = 'vertical';

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

    const direction = props.direction || VERTICAL_DIRECTION;
    const keys = direction === HORIZONTAL_DIRECTION ? HORIZONTAL_KEYS : VERTICAL_KEYS;

    this.state = {
      keys,
      offset: 0,
      overscan: DEFAULT_OVERSCAN,
      burger: 0,
      windowSize: DEFAULT_INITIAL_ELEMENTS,
      initializing: true,
      debug: false,
    };
  }

  getCurrentChildrenMeanSize() {
    const childSizes = [...this.refs.innerScrollList.children].map(child => child[this.state.keys.offset]);

    return childSizes.reduce((h1, h2) => h1 + h2) / childSizes.length;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.offset !== nextState.offset ||
           this.state.burger !== nextState.burger ||
           this.state.windowSize !== nextState.windowSize;
  }

  chechInitialization() {
    const { keys, windowSize } = this.state;

    const estimatedSize = this.getCurrentChildrenMeanSize();

    // Just during the initialization
    if (this.state.initializing) {
      const containerSize = this.refs.innerScrollContainer[keys.offset];
      const elementsSize = this.refs.innerScrollList.children.length * estimatedSize;

      if (containerSize > elementsSize) {
        const newWindowSize = windowSize + DEFAULT_INITIAL_ELEMENTS

        if (this.state.debug) {
          console.log(`Initializing with ${newWindowSize} elements...`);
        }

        this.setState({
          windowSize: newWindowSize
        });
      } else {
        const newWindowSize = Math.ceil(this.refs.list[keys.offset] / estimatedSize);

        this.setState({
          initializing: false,
          windowSize: newWindowSize,
          overscan: this.props.overscan || newWindowSize,
        });

        // Set real scrollbar size
        this.refs.innerScrollContainer.style[keys.dimension] = `${this.props.rowCount * estimatedSize}px`;
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.chechInitialization();
  }

  componentDidMount() {
    this.chechInitialization();
  }

  onScroll(event) {
    const { rowCount } = this.props;
    const { windowSize, overscan, keys } = this.state;

    const scrollRelative = this.refs.list[keys.scroll];
    const meanSize = this.getCurrentChildrenMeanSize();
    const offset = Math.min(Math.floor(scrollRelative / meanSize), rowCount - windowSize - overscan);
    const burger = !offset ? 0 : (offset - overscan) * meanSize;

    if (this.state.debug) {
      console.group();
      console.log('Offset', offset);
      console.log('Element size', meanSize);
      console.log('Elements', rowCount);
      console.log('Overscan', overscan);
      console.log('WindowSize', windowSize);
      console.log('Total', rowCount * meanSize);
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
    const { offset, burger, overscan, keys, initializing, windowSize } = this.state;
    const realOffset = Math.max(offset - overscan, 0);

    const containerStyle = { flexDirection: keys.flex, [`${keys.inverse_dimension}`]: '100%' };
    const burgerStyle = { [`${keys.dimension}`]: burger };

    let renderedElements;

    if (initializing) {
      renderedElements = windowSize;
    } else {
      renderedElements = windowSize + Math.min(offset, overscan) + Math.min(this.props.rowCount - (overscan + offset), overscan)
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

ChopList.propTypes = {
  rowCount: React.PropTypes.number.isRequired,
  rowRenderer: React.PropTypes.func.isRequired,
  direction: React.PropTypes.oneOf([HORIZONTAL_DIRECTION, VERTICAL_DIRECTION]),
  overscan: React.PropTypes.number,
};

export default ChopList;
