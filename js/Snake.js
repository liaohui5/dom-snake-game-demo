function Snake(options) {
  var options = options || {}; // size, speed, mapInfo
  this.speed = options.speed;
  this.size = options.size;
  this.len = options.length || 5;
  this.gameMap = options.gameMap;
  if (!(this.gameMap instanceof GameMap)) {
    throw new TypeError("must provide gameMap instance");
  }
  this.food = options.food;
  if (!(this.food instanceof Food)) {
    throw new TypeError("must provide Food instance");
  }
  this.gameManager = options.gameManager;
  if (!(this.gameManager !== GameManager)) {
    throw new TypeError("must provide Food gameManager");
  }
  this.bodyItems = this.initBodyPositions(); // [x:0, y:0, dom: null, isHead: false ]
  this.timer = null;
  this.dir = "down"; // allow values: ['down', 'up', 'left', 'right']
  this.bindEvents();
}

// 根据大小创建坐标
Snake.prototype.initBodyPositions = function () {
  var y = 0,
    res = [];
  for (var i = 0; i < this.len; i++) {
    res.push({ x: 0, y: y, dom: null });
    y += this.size;
  }
  res[this.len - 1].isHead = true;
  return res;
};

// 创建一部分身体DOM
Snake.prototype.createBodyItemDom = function (x, y) {
  var size = this.size + "px";
  domItem = document.createElement("div");
  domItem.className = "body";
  domItem.style.width = size;
  domItem.style.height = size;
  domItem.style.left = x + "px";
  domItem.style.top = y + "px";
  return domItem;
};

// 根据坐标创建蛇
Snake.prototype.render = function () {
  var item,
    domItem,
    bodyItems = this.bodyItems,
    fragment = document.createDocumentFragment();
  for (var i = 0, len = bodyItems.length; i < len; i++) {
    item = bodyItems[i];
    domItem = this.createBodyItemDom(item.x, item.y);
    item.isHead && (domItem.className += " head");
    item.dom = domItem;
    fragment.append(domItem);
  }
  this.gameMap.dom.append(fragment);
};

// 不停的跑动起来
Snake.prototype.run = function () {
  this.timer && clearInterval(this.timer);
  this.timer = setInterval(this.move.bind(this), this.speed);
};

// 移动位置
Snake.prototype.move = function () {
  var head,
    item,
    nextItem,
    step = this.size,
    mapSize = this.gameMap.size,
    bodyItems = this.bodyItems;
  for (var i = 0, len = bodyItems.length; i < len; i++) {
    item = bodyItems[i];
    nextItem = bodyItems[i + 1];
    if (item.isHead) {
      // 蛇的头部控制方向
      switch (this.dir) {
        case "left":
          item.x = item.x <= 0 ? mapSize : item.x - step;
          break;
        case "right":
          item.x = item.x >= mapSize ? 0 : item.x + step;
          break;
        case "up":
          item.y = item.y <= 0 ? mapSize : item.y - step;
          break;
        case "down":
          item.y = item.y >= mapSize ? 0 : item.y + step;
          break;
      }
      head = item;
    } else {
      item.x = nextItem.x;
      item.y = nextItem.y;
    }
    item.dom.style.left = item.x + "px";
    item.dom.style.top = item.y + "px";
  }
  this.checkHeadInBody(head);
  this.checkEatFood(head);
};

// 绑定事件(按键让蛇改变移动的方向)
Snake.prototype.bindEvents = function () {
  document.addEventListener("keydown", this.setDirection.bind(this));
};

// 改变蛇移动的方向
Snake.prototype.setDirection = function (e) {
  // 贪食蛇的游戏规则: 默认向下走
  // 不能直接向反方向走, 比如: 现在是向左走, 只能通过按键向下或者向上, 不能直接向上
  // 如果当前走的方向与按键按的方向一致则无效, 比如当前就是向下走的, 又按下了下键, 没有效果
  var e = e || window.event;
  var keyCode = e.keyCode;
  var dir = this.dir;
  switch (keyCode) {
    case 37: // left
      if (dir !== "left" && dir !== "right") {
        this.dir = "left";
      }
      break;
    case 39: // right
      if (dir !== "left" && dir !== "right") {
        this.dir = "right";
      }
      break;
    case 38: // up
      if (dir !== "up" && dir !== "down") {
        this.dir = "up";
      }
      break;
    case 40: // down
      if (dir !== "up" && dir !== "down") {
        this.dir = "down";
      }
      break;
  }
};

// 检查蛇头是否碰撞到身体
Snake.prototype.checkHeadInBody = function (head) {
  var item,
    bodyItems = this.bodyItems;
  for (var i = 0, len = bodyItems.length - 2; i < len; i++) {
    // 因为游戏规则是不能直接向反方向走, 所以可以直接减2, 减少循环
    item = bodyItems[i];
    if (item.x === head.x && item.y === head.y) {
      this.gameManager.gameOver();
    }
  }
};

// 判断是否吃到了食物
Snake.prototype.checkEatFood = function (head) {
  var food = this.food;
  if (head.x === food.x && head.y === food.y) {
    this.gameManager.addScore();
    this.addBodyItem();
    food.resetPosition();
  }
};

// 得分后增加一个身体部位
Snake.prototype.addBodyItem = function () {
  var bodyItems = this.bodyItems,
    item0 = bodyItems[0],
    item1 = bodyItems[1],
    newItem = { x: 0, y: 0, dom: null };

  if (item0.x === item1.x) {
    // 上下移动
    newItem.x = item0.x;
    newItem.y = item0.y > item1.y ? /* down move */ item0.y + 20 : /* up move */ item0.y - 20;
  }
  if (item0.y === item1.y) {
    // 左右移动
    newItem.y = item0.y;
    newItem.x = item0.x > item1.x ? /* right move */ item0.x + 20 : item0.x /* left move */ - 20;
  }
  var newItemDom = this.createBodyItemDom(newItem.x, newItem.y);
  newItem.dom = newItemDom;
  bodyItems.unshift(newItem);
  this.gameMap.dom.append(newItemDom);
};

// 获取蛇的实例对象
Snake.getInstance = (function () {
  var singleInstance = null;
  return function (options) {
    if (!singleInstance) {
      singleInstance = new Snake(options);
    }
    return singleInstance;
  };
})();
