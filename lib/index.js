'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMeasure = require('react-measure');

var _reactMeasure2 = _interopRequireDefault(_reactMeasure);

var _lodash = require('lodash.property');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.debounce');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.throttle');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.flatten');

var _lodash8 = _interopRequireDefault(_lodash7);

var _propTypes = require('./propTypes');

var _itemsChopper = require('./itemsChopper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HORIZONTAL_LENSES = {
  size: (0, _lodash2.default)('offsetWidth'),
  getScroll: (0, _lodash2.default)('scrollLeft'),
  setScroll: function setScroll(child, value) {
    child['scrollLeft'] = value;
  },
  dimension: (0, _lodash2.default)('width'),
  beforeMargin: (0, _lodash2.default)('marginLeft'),
  afterMargin: (0, _lodash2.default)('marginRight'),
  scrollClass: 'scrollHorizontal',
  makeStyles: function makeStyles(width) {
    return { width: width };
  },
  log: function log(msg) {
    console.log(msg);
  }
};

var VERTICAL_LENSES = {
  size: (0, _lodash2.default)('offsetHeight'),
  getScroll: (0, _lodash2.default)('scrollTop'),
  setScroll: function setScroll(child, value) {
    child['scrollTop'] = value;
  },
  dimension: (0, _lodash2.default)('height'),
  beforeMargin: (0, _lodash2.default)('marginTop'),
  afterMargin: (0, _lodash2.default)('marginBottom'),
  scrollClass: 'scrollVertical',
  makeStyles: function makeStyles(height) {
    return { height: height };
  },
  log: function log(msg) {
    console.log(msg);
  }
};

var ChopList = function (_Component) {
  _inherits(ChopList, _Component);

  function ChopList(props) {
    _classCallCheck(this, ChopList);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onResize = _this.onResize.bind(_this);
    _this.onScroll = _this.onScroll.bind(_this);

    // Review this
    _this.onResize = (0, _lodash4.default)(_this.onResize, 150);
    _this.onScroll = (0, _lodash6.default)(_this.onScroll, 50);

    _this.lenses = props.direction === _propTypes.HORIZONTAL_DIRECTION ? HORIZONTAL_LENSES : VERTICAL_LENSES;

    _this.getSize = function (child) {
      // More info here: https://facebook.github.io/react/docs/refs-and-the-dom.html#caveats
      if (!child) {
        console.warn('empty child');
        return 0;
      }

      // TODO: get-node-dimensions package for this
      var style = window.getComputedStyle ? getComputedStyle(child, null) : child.currentStyle;

      var size = _this.lenses.size(child);
      var beforeMargin = parseInt(_this.lenses.beforeMargin(style), 10) || 0;
      var afterMargin = parseInt(_this.lenses.afterMargin(style), 10) || 0;

      return beforeMargin + size + afterMargin;
    };

    _this.state = {
      offset: 0, // index
      windowCount: 1, // amount
      burgerCount: 0, // amount
      estimatedItemSize: 0, // px
      isBuffering: false
    };
    return _this;
  }

  ChopList.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return this.props.itemCount !== nextProps.itemCount || this.state.estimatedItemSize !== nextState.estimatedItemSize || this.state.offset !== nextState.offset || this.state.burgerCount !== nextState.burgerCount || this.state.windowCount !== nextState.windowCount;
  };

  ChopList.prototype.getRenderedItems = function getRenderedItems() {
    // TODO: Review nwb/babel/arrays hell
    return (0, _lodash8.default)(this._innerScrollList.children);
  };

  ChopList.prototype.getRenderedItemsSizes = function getRenderedItemsSizes() {
    var _this2 = this;

    return this.getRenderedItems().map(function (child) {
      return _this2.getSize(child);
    });
  };

  ChopList.prototype.getRenderedItemsTotalSize = function getRenderedItemsTotalSize() {
    return this.getRenderedItemsSizes().reduce(function (totalSize, size) {
      return totalSize + size;
    }, 0);
  };

  ChopList.prototype.shouldRenderMoreItems = function shouldRenderMoreItems(totalSize, renderedSize, totalItems, renderedItems) {
    return renderedSize < totalSize && renderedItems < totalItems;
  };

  ChopList.prototype.startBuffering = function startBuffering() {
    var _props = this.props,
        itemCount = _props.itemCount,
        shrink = _props.shrink;


    this.lenses.log('buffering...');
    var containerSize = this.getSize(this._list);

    if (!containerSize && !this.props.shrink) {
      this.lenses.log('Chop container has no size!!');
      return;
    }

    if (itemCount === 0) {
      return;
    }

    var renderedItemsCount = this.getRenderedItems().length;
    var renderedItemsTotalSize = this.getRenderedItemsTotalSize();

    var shouldRenderMoreItems = this.shouldRenderMoreItems(containerSize, renderedItemsTotalSize, itemCount, renderedItemsCount);

    var shrinkCalc = shrink && renderedItemsTotalSize < containerSize;

    if (shouldRenderMoreItems) {
      this.lenses.log('need more items: rendered ' + renderedItemsCount + ' items');
      this.setState((0, _itemsChopper.getNextBufferingState)({ renderedItemsTotalSize: renderedItemsTotalSize, renderedItemsCount: renderedItemsCount, containerSize: containerSize, shrink: shrinkCalc, itemCount: itemCount }));
      return;
    }

    this.setState((0, _itemsChopper.getFinalBufferingState)({ renderedItemsTotalSize: renderedItemsTotalSize, renderedItemsCount: renderedItemsCount, containerSize: containerSize }));
  };

  ChopList.prototype.getOverscan = function getOverscan() {
    return this.props.overscan || this.state.windowCount;
  };

  ChopList.prototype.onResize = function onResize() {
    if (this.state.isBuffering) {
      return;
    }

    this.lenses.log('onResize');
    this.startBuffering();
  };

  ChopList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.scrollTo !== this.props.scrollTo) {
      this.lenses.setScroll(this._list, nextProps.scrollTo);
    } else if (nextProps.scrollToItem !== this.props.scrollToItem) {
      var estimatedItemSize = this.state.estimatedItemSize;

      var estimatedScrollPosition = estimatedItemSize * nextProps.scrollToItem;

      this.lenses.setScroll(this._list, estimatedScrollPosition);
    }
  };

  ChopList.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!this.state.isBuffering) {
      return;
    }

    this.lenses.log('didUpdate');
    this.startBuffering();
  };

  ChopList.prototype.componentDidMount = function componentDidMount() {
    this.startBuffering();
  };

  ChopList.prototype.onScroll = function onScroll(event) {
    var currentScrollPosition = this.lenses.getScroll(this._list);

    this.scrollTo(currentScrollPosition);
  };

  ChopList.prototype.scrollTo = function scrollTo(currentScrollPosition) {
    var itemCount = this.props.itemCount;
    var _state = this.state,
        windowCount = _state.windowCount,
        estimatedItemSize = _state.estimatedItemSize;

    var overscan = this.getOverscan();

    this.setState((0, _itemsChopper.getNextScrollState)({
      itemCount: itemCount,
      windowCount: windowCount,
      estimatedItemSize: estimatedItemSize,
      overscan: overscan,
      currentScrollPosition: currentScrollPosition
    }));
  };

  ChopList.prototype.getStyles = function getStyles() {
    var itemCount = this.props.itemCount;
    var _state2 = this.state,
        estimatedItemSize = _state2.estimatedItemSize,
        burgerCount = _state2.burgerCount;


    var containerSize = Math.round(itemCount * estimatedItemSize);
    var burgerSize = Math.round(burgerCount * estimatedItemSize);

    var chopStyle = {};
    var containerStyle = this.lenses.makeStyles(containerSize);
    var burgerStyle = this.lenses.makeStyles(burgerSize);

    if (this.props.shrink) {
      chopStyle = { position: 'static', overflowY: 'scroll', overflowX: 'hidden', height: 'initial', margin: 'initial' };
      containerStyle = _extends({}, containerStyle, { position: 'static' });
    }

    return {
      chopStyle: chopStyle,
      containerStyle: containerStyle,
      burgerStyle: burgerStyle
    };
  };

  ChopList.prototype.renderElements = function renderElements() {
    var _this3 = this;

    var itemCount = this.props.itemCount;
    var _state3 = this.state,
        offset = _state3.offset,
        windowCount = _state3.windowCount;

    var overscan = this.getOverscan();
    var range = (0, _itemsChopper.getItemsRangeToRender)({ itemCount: itemCount, windowCount: windowCount, offset: offset, overscan: overscan });

    return range.map(function (i) {
      return _this3.props.itemRenderer({ key: 'k' + i, index: i });
    });
  };

  ChopList.prototype.render = function render() {
    var _this4 = this;

    var scrollClassName = this.lenses.scrollClass;

    var _getStyles = this.getStyles(),
        chopStyle = _getStyles.chopStyle,
        containerStyle = _getStyles.containerStyle,
        burgerStyle = _getStyles.burgerStyle;

    return _react2.default.createElement(
      'div',
      { className: 'ChopList', ref: function ref(c) {
          return _this4._list = c;
        }, onScroll: this.onScroll, style: chopStyle },
      _react2.default.createElement(
        'div',
        { className: 'innerScrollContainer ' + scrollClassName, style: containerStyle },
        _react2.default.createElement('div', { className: 'Burger', style: burgerStyle }),
        _react2.default.createElement(
          _reactMeasure2.default,
          { onMeasure: this.onResize },
          _react2.default.createElement(
            'div',
            { className: 'innerScrollList ' + scrollClassName, ref: function ref(c) {
                return _this4._innerScrollList = c;
              } },
            this.renderElements()
          )
        )
      )
    );
  };

  return ChopList;
}(_react.Component);

;

process.env.NODE_ENV !== "production" ? ChopList.propTypes = _propTypes.propTypes : void 0;
ChopList.defaultProps = _propTypes.defaultProps;

exports.default = ChopList;
module.exports = exports['default'];