import React, { Component } from 'react';
import './ChopList.css';

const DEFAULT_INITIAL_ELEMENTS = 10;
const SCALE_FACTOR = 100;

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

    this.handleResize = this.handleResize.bind(this);

    const direction = props.direction || VERTICAL_DIRECTION;
    const keys = direction === HORIZONTAL_DIRECTION ? HORIZONTAL_KEYS : VERTICAL_KEYS;

    this.state = {
      keys,
      offset: 0,
      burger: 0,
      windowSize: DEFAULT_INITIAL_ELEMENTS,
      initializing: true,
      debug: true,
      scale: 1,
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
    const { rowCount } = this.props;
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
          windowSize: newWindowSize,
        });
      } else {
        const newWindowSize = Math.ceil(this.refs.list[keys.offset] / estimatedSize);
        const newScale = Math.ceil(rowCount / SCALE_FACTOR);
        const newSize = Math.round(rowCount * estimatedSize / newScale);

        // Set real scrollbar size
        this.refs.innerScrollContainer.style[keys.dimension] = `${newSize}px`;

        this.setState({
          initializing: false,
          windowSize: newWindowSize,
          overscan: this.props.overscan || newWindowSize,
          scale: newScale,
        });
      }
    }
  }

  handleResize() {
    if (!this.state.initializing) {
      return;
    }

    this.setState({
      initializing: true
    });

    this.chechInitialization();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps, prevState) {
    this.chechInitialization();
  }

  componentDidMount() {
    this.chechInitialization();

    window.addEventListener('resize', this.handleResize);
  }

  onScroll(event) {
    const { rowCount } = this.props;
    const { windowSize, overscan, keys, scale } = this.state;

    const scrollRelative = this.refs.list[keys.scroll] * scale;
    const meanSize = this.getCurrentChildrenMeanSize();
    const offset = Math.min(Math.floor(scrollRelative / meanSize), rowCount - windowSize - overscan);
    const burger = (offset - overscan) * meanSize;

    if (this.state.debug) {
      console.group();
      console.log('Offset', offset);
      console.log('Element size', meanSize);
      console.log('Elements', rowCount);
      console.log('Overscan', overscan);
      console.log('WindowSize', windowSize);
      console.log('Total', rowCount * meanSize);
      console.log('Burger', burger);
      console.log('Scale', scale);
      console.groupEnd();
    }

    this.setState({
      offset,
      burger: Math.ceil(burger / scale)
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

    const containerStyle = { flexDirection: keys.flex, [`${keys.inverse_dimension}`]: '100%' };
    const burgerStyle = { [`${keys.dimension}`]: burger };

    let renderedElements = windowSize;
    let realOffset = 0;

    if (!initializing) {
      renderedElements = windowSize + Math.min(offset, overscan) + Math.min(this.props.rowCount - (overscan + offset), overscan)
      realOffset = Math.max(offset - overscan, 0);
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
