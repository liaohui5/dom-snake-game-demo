(function () {
  var _ = Object.create(null);
  var _toString = Object.prototype.toString;

  /**
   * 判断变量是否是原始值
   * @param {any} value
   * @returns {Boolean}
   */
  function isPrimitive(value) {
    return (
      typeof value === "string" || typeof value === "number" || typeof value === "symbol" || typeof value === "boolean"
    );
  }
  _.isPrimitive = isPrimitive;

  /**
   * 获取变量类型
   * @param {any} val
   * @returns {string}
   */
  function getRawType(val) {
    return _toString.call(val).slice(8, -1);
  }
  _.getRawType = getRawType;

  /**
   * 判断变量是否是对象
   * @param {any} obj
   * @returns {Boolean}
   */
  function isObject(obj) {
    return obj !== null && typeof obj === "object";
  }
  _.isObject = isObject;

  /**
   * 判断对象是构造函数构造的
   * @param {any} obj
   * @returns {Boolean}
   */
  function isInstanceOf(obj, constructor) {
    return _toString.call(obj) === "[object " + constructor + "]";
  }
  _.isInstanceOf = isInstanceOf;

  /**
   * 判断是否是 Promise
   * @param {any} val
   * @returns {Boolean}
   */
  function isPromise(val) {
    return val && typeof val.then === "function" && typeof val.catch === "function";
  }
  _.isPromise = isPromise;

  /**
   * getElementById 的别名方法
   * @param {string} id selector
   * @returns {HTMLElement}
   */
  function $(id) {
    return document.getElementById(id);
  }
  _.$ = $;

  /**
   * 判断是否是一个 HTMLElement 元素
   * @param {any} el
   * @returns {Boolean}
   */
  function isElement(el) {
    return el && el.nodeType === Node.ELEMENT_NODE;
  }
  _.isElement = isElement;

  /**
   * 根据字符串查询元素
   * @param {string} selector
   * @param {HTMLElement|Document} el
   * @returns
   */
  function $findOne(selector, el) {
    if (typeof selector !== "string" || selector.length === 0) {
      throw new TypeError("$findOne: selector must be string");
    }
    if (typeof el !== "undefined" && el && el.nodeType !== Node.ELEMENT_NODE) {
      throw new TypeError("$findOne: el must be a HTMLElement");
    }
    var el = el || document;
    var items;
    if (selector.substr(0, 1) === ".") {
      items = el.getElementsByClassName(selector.substr(1));
    } else {
      items = el.getElementsByTagName(selector);
    }
    return items ? items[0] : items;
  }
  _.$findOne = $findOne;

  /**
   * 根据 nodeType 来获取过滤对应的节点
   * @param {HTMLElementNodes} node
   * @returns {Array}
   */
  function getChildrenByNodeType(node, nodeType) {
    var nodeType = nodeType || Node.ELEMENT_NODE;
    var nodes = [];
    var allowTypes = [
      Node.ELEMENT_NODE,
      Node.TEXT_NODE,
      Node.CDATA_SECTION_NODE,
      Node.PROCESSING_INSTRUCTION_NODE,
      Node.COMMENT_NODE,
      Node.DOCUMENT_NODE,
      Node.DOCUMENT_TYPE_NODE,
      Node.DOCUMENT_FRAGMENT_NODE,
    ];

    if (!isElement(node)) {
      throw new TypeError("getChildElementNodes: The node must be a HTMLElement");
    }

    if (allowTypes.indexOf(nodeType) === -1) {
      throw new TypeError("getChildElementNodes: unknown nodeType");
    }

    if (!node.hasChildNodes()) {
      return nodes;
    }

    var item;
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
      item = children[i];
      item.nodeType === nodeType && nodes.push(item);
    }
    return nodes;
  }
  _.getChildrenByNodeType = getChildrenByNodeType;

  /**
   * 在 node 后面插入 target 节点
   * @param {HTMLElement} node
   * @param {HTMLElement} target
   */
  function insertAfter(node, target) {
    if (!isElement(node) || !isElement(target)) {
      throw new TypeError("appendAfter: node and target must be HTMLElement");
    }
    var nextEle = node.nextElementSibling;
    if (nextEle) {
      node.parentNode.insertBefore(target, nextEle);
    } else {
      node.parentNode.appendChild(target);
    }
  }
  _.insertAfter = insertAfter;

  /**
   * 根据当前元素找兄弟元素
   * @param {HTMLElement} node
   * @returns
   */
  function findSiblings(node, index) {
    if (!isElement(node)) {
      throw new TypeError("findSiblings: node must be HTMLElement");
    }
    var index = index >> 0;
    var steps = Math.abs(index);
    var target = undefined;

    // 传入的数字为0
    if (steps === 0) {
      return node;
    }

    // 传入的 index 大于父元素的所有子元素数
    if (this.parentNode.childElementCount < steps) {
      return target;
    }

    // 找的方向: 大于0向后找, 小于0向前找
    var dirKey = index > 0 ? "nextElementSibling" : "previousElementSibling";
    var item = node;
    target = item;
    for (var i = 0; i < steps; i++) {
      if (item) {
        item = item[dirKey];
        target = item;
      } else {
        target = undefined;
      }
    }

    return target;
  }
  _.findSiblings = findSiblings;

  /**
   * 兼容: 获取offsetTop/offsetLeft
   * @returns {Object: {top, left}}
   */
  function getScrollOffset() {
    if (window.pageXOffset) {
      getScrollOffset = function () {
        return {
          top: window.pageXOffset,
          left: window.pageYOffset,
        };
      };
    } else {
      getScrollOffset = function () {
        return {
          top: document.body.scrollTop + document.documentElement.scrollTop,
          left: document.body.scrollLeft + document.documentElement.scrollLeft,
        };
      };
    }
    return getScrollOffset();
  }
  _.getScrollOffset = getScrollOffset;

  /**
   * 兼容: 获取可视区域大小
   * @returns {Object:{width, height}}
   */
  function getViewportSize() {
    if (window.innerWidth) {
      getViewportSize = function () {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      };
    } else {
      getViewportSize = function () {
        // ie
        var key = document.compatMode === "BackCompat" ? "body" : "documentElement";
        return {
          width: document[key].clientWidth,
          height: document[key].clientHeight,
        };
      };
    }
    return getViewportSize();
  }
  _.getViewportSize = getViewportSize;

  /**
   * 兼容: 获取滚动的宽度/高度
   * @returns {object: {width, height}}
   */
  function getScrollSize() {
    if (document.body.scrollHeight) {
      getScrollSize = function () {
        return {
          width: document.body.scrollWidth,
          height: document.body.scrollHeight,
        };
      };
    } else {
      getScrollSize = function () {
        return {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        };
      };
    }
    return getScrollSize();
  }
  _.getScrollSize = getScrollSize;

  /**
   * 兼容: 获取 getComputedStyle 的值
   * @returns {string|number|undefined}
   */
  function getStyles(el, prop) {
    if (window.getComputedStyle) {
      getStyles = function (el, prop) {
        var styles = window.getComputedStyle(el, null);
        return styles[prop] ? styles[prop] : undefined;
      };
    } else {
      getStyles = function (el, prop) {
        // ie
        var styles = el.currentStyle;
        return styles[prop] ? styles[prop] : undefined;
      };
    }
    return getStyles(el, prop);
  }
  _.getStyles = getStyles;

  /**
   * 兼容: 添加事件处理函数
   * @param {HTMLElement} el 事件源
   * @param {String} type 事件类型
   * @param {Function} handler 事件处理函数
   * @returns
   */
  function addEvent(el, type, handler) {
    if (el.addEventListener) {
      addEvent = function (el, type, handler) {
        el.addEventListener(type, handler, false);
      };
    } else if (el.attachEvent) {
      addEvent = function (el, type, handler) {
        el.attachEvent("on" + type, function () {
          handler.call(el);
        });
      };
    } else {
      addEvent = function (el, type, handler) {
        el["on" + type] = handler;
      };
    }
    return addEvent(el, type, handler); // 只有这一次执行会判断
  }
  _.addEvent = addEvent;

  /**
   * 兼容: 移除事件处理函数
   * @param {HTMLElement} el 事件源
   * @param {String} type 事件类型
   * @returns
   */
  function removeEvent(el, type, handler) {
    if (el.removeEventListener) {
      removeEvent = function (el, type, handler) {
        el.removeEventListener(type, handler);
      };
    } else if (el.detachEvent) {
      removeEvent = function (el, type, handler) {
        el.detachEvent("on" + type, handler);
      };
    } else {
      removeEvent = function (el, type, handler) {
        el["on" + type] = null;
      };
    }
    return removeEvent(el, type, handler); // 只有这一次执行会判断
  }
  _.removeEvent = removeEvent;

  /**
   * 兼容: 取消冒泡
   * @param {Event} e
   * @returns
   */
  function cancelBubble(e) {
    if (e.stopPropagation) {
      cancelBubble = function (e) {
        e = e || window.event;
        return e.stopPropagation();
      };
    } else {
      cancelBubble = function (e) {
        e = e || window.event; // window.event 兼容ie8及其以下版本的浏览器
        e.cancelBubble = true;
      };
    }

    return cancelBubble(e);
  }
  _.cancelBubble = cancelBubble;

  /**
   * 兼容: 取消浏览器默认事件
   * @param {Event} e
   * @returns
   */
  function preventDefault(e) {
    var e = e || widow.event;
    if (e.preventDefault) {
      // w3c standard
      preventDefault = function (e) {
        e.preventDefault(e);
      };
    } else {
      // ie: 9/8/7/6
      preventDefault = function (e) {
        e = e || widow.event;
        e.returnValue = false;
      };
    }
    return preventDefault(e);
  }
  _.preventDefault = preventDefault;

  /**
   * 兼容: pageX/pageY
   * @param {Event} e
   * @returns {Object:{x, y}}
   */
  function getPagePosition(e) {
    var scrollPos = getScrollOffset(),
      clientLeft = document.documentElement.clientLeft || 0,
      clientTop = document.documentElement.clientTop || 0;
    return {
      x: e.clientX + scrollPos.left - clientLeft,
      y: e.clientY + scrollPos.top - clientTop,
    };
  }
  _.getPagePosition = getPagePosition;

  /**
   * 让一个元素可以拖动
   * @param {object} options 配置选项
   * @param {HTMLElement} options.el: 需要被拖动的元素
   * @param {Boolean} options.xMoveable: 水平方向是否可以拖动 default: true
   * @param {Boolean} options.yMoveable: 垂直方向是否可以拖动 default: true
   * @param {Boolean} options.moveOutside: 是否限制移动边界 default: true
   */
  function drag(options) {
    if (!options || Object.prototype.toString.call(options) !== "[object Object]") {
      throw new TypeError("the options must be a object");
    }

    var el = options.el,
      offsetX,
      offsetY,
      maxWidth,
      maxHeight,
      xMoveable,
      yMoveable,
      moveOutside;
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
      throw new TypeError("The 'el' must be a HTMLElement");
    }
    xMoveable = options.xMoveable === false ? false : true;
    yMoveable = options.yMoveable === false ? false : true;
    moveOutside = options.moveOutside === false ? false : true;

    // mouse down
    var handleMouseDown = function (e) {
      var e = e || window.event;
      var target = e.target || e.srcElement;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      maxWidth = window.innerWidth - target.offsetWidth - 1;
      maxHeight = window.innerHeight - target.offsetHeight - 1;
      addEvent(document, "mousemove", handleMouseMove);
      addEvent(document, "mouseup", handleMouseUp);
    };

    // mouse move
    var handleMouseMove = function (e) {
      var e = e || window.event;
      var mousePos = getPagePosition(e);
      var left, top;
      el.style.position = "fixed";
      if (xMoveable) {
        left = mousePos.x - offsetX;
        if (moveOutside) {
          left = left >= maxWidth ? maxWidth : left;
          left = left <= 0 ? 0 : left;
        }
        el.style.left = left + "px";
      }
      if (yMoveable) {
        top = mousePos.y - offsetY;
        if (moveOutside) {
          top = top >= maxHeight ? maxHeight : top;
          top = top <= 0 ? 0 : top;
        }
        el.style.top = top + "px";
      }
      preventDefault(e);
      cancelBubble(e);
    };

    // mouse up
    var handleMouseUp = function (e) {
      var e = e || window.event;
      removeEvent(document, "mousemove", handleMouseMove);
      removeEvent(el, "mouseup", handleMouseUp);
    };

    addEvent(el, "mousedown", handleMouseDown);
  }
  _.drag = drag;

  // freeze
  Object.freeze && Object.freeze(_);
  window._ = _;
})();
