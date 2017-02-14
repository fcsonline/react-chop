import React, { Component } from 'react';

class ChopList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      overscan: 20,
      burgerHeight: 0,
    };
  }

  getCurrentChildrenMeanHeight() {
    const childHeights = [...this.refs.innerScrollList.children].map(child => child.offsetHeight);

    return childHeights.reduce((h1, h2) => h1 + h2) / childHeights.length;
  }

  componentDidMount() {
    const estimatedHeight = this.getCurrentChildrenMeanHeight();

    this.scrollTop = 0; // Avoid state updates
    this.estimatedHeight = estimatedHeight; // Avoid state updates
    this.windowSize = Math.ceil(this.refs.list.offsetHeight / estimatedHeight) + this.state.overscan;

    this.refs.innerScrollContainer.style.height = `${this.props.rowCount * estimatedHeight}px`;
  }

  onScroll(event) {
    const maxHeight = this.estimatedHeight * this.props.rowCount;
    const scrollTop = this.refs.list.scrollTop;

    if (!scrollTop || (!this.state.offset && scrollTop < 0)) return;

    const realScrollTop = Math.min(Math.max(this.scrollTop + scrollTop * this.estimatedHeight, 0), maxHeight);
    const offset = Math.min(Math.floor(Math.max(scrollTop, 0) / this.estimatedHeight), this.props.rowCount - Math.ceil(this.refs.list.offsetHeight / this.estimatedHeight));
    const overscanHeight = this.estimatedHeight * this.state.overscan / 2;
    const burgerHeight = !offset ? 0 : Math.max(Math.round(scrollTop - overscanHeight) + Math.random() * this.estimatedHeight, 0);

    // console.log('s', scrollTop, burgerHeight, realScrollTop, offset);

    this.scrollTop = realScrollTop;  // Avoid state updates

    this.setState({ offset, burgerHeight });
  }

  render() {
    const { offset, burgerHeight } = this.state;
    const windowSize = this.windowSize || this.state.overscan;

    return (
      <div ref='list' className="List" onScroll={this.onScroll.bind(this)}>
        <div ref='innerScrollContainer' className="innerScrollContainer">
        {burgerHeight > 0 && (
          <div ref='burger' className="Burger" style={ { height: burgerHeight } }/>
        )}

          <div ref='innerScrollList' className="innerScrollList">
          {[...Array(windowSize)].map((x, i) =>
            { return this.props.rowRenderer({key: 'k' + (i + offset), index: (i + offset)}) }
          )}
          </div>
        </div>
      </div>
    );
  }
};

export default ChopList;
