import React, { Component } from 'react';
import './ChopList.css';

const DEFAULT_OVERSCAN = 5;
const DEFAULT_INITIAL_ELEMENT = 10;

const FLEX_MAPPING = {
  vertical: 'column',
  horizontal: 'row',
};

const DIRECTION_MAPPING = {
  vertical: 'height',
  horizontal: 'width',
};

const RELATIVE_MAPPING = {
  vertical: 'top',
  horizontal: 'left',
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class ChopList extends Component {

  constructor(props) {
    super(props);

    // TODO: Move to oneOf propType
    if (props.direction && ['horizontal', 'vertical'].indexOf(props.direction) < -1) {
      throw Error('Wrong direction');
    }

    this.state = {
      direction: props.direction || 'vertical',
      offset: 0,
      overscan: DEFAULT_OVERSCAN,
      burger: 0,
      debug: false,
    };
  }

  getCurrentChildrenMeanSize() {
    const direction = this.directionProperty();
    const offsetProperty = `offset${capitalize(direction)}`;
    const childSizes = [...this.refs.innerScrollList.children].map(child => child[offsetProperty]);

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
    const direction = this.directionProperty();
    const offsetProperty = `offset${capitalize(direction)}`;
    const estimatedSize = this.getCurrentChildrenMeanSize();

    this.windowSize = Math.ceil(this.refs.list[offsetProperty] / estimatedSize);

    // Set real scrollbar size
    this.refs.innerScrollContainer.style[direction] = `${this.props.rowCount * estimatedSize}px`;
  }

  onScroll(event) {
    const relativeProperty = `scroll${capitalize(this.relativeProperty())}`;
    const scrollRelative = this.refs.list[relativeProperty];

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

  directionFlexProperty() {
    return FLEX_MAPPING[this.state.direction];
  }

  directionProperty() {
    return DIRECTION_MAPPING[this.state.direction];
  }

  inverseDirectionProperty() {
    return DIRECTION_MAPPING[this.state.direction === 'vertical' ? 'horizontal' : 'vertical'];
  }

  relativeProperty() {
    return RELATIVE_MAPPING[this.state.direction];
  }

  renderElements(renderedElements, realOffset) {
    return (
      [...Array(renderedElements)].map((x, i) =>
        { return this.props.rowRenderer({key: 'k' + (i + realOffset), index: (i + realOffset)}) }
      )
    );
  }

  render() {
    const { offset, burger, overscan } = this.state;
    const realOffset = Math.max(offset - overscan, 0);

    const containerStyle = { flexDirection: this.directionFlexProperty(), [`${this.inverseDirectionProperty()}`]: '100%' };
    const burgerStyle = { [`${this.directionProperty()}`]: burger };

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
