function Food(options) {
  this.dom = null;
  this.x = 0;
  this.y = 0;
  this.size = options.size;
  this.gameMap = options.gameMap;
  if (!(this.gameMap instanceof GameMap)) {
    throw new TypeError("must provide gameMap instance");
  }
}

// 渲染食物
Food.prototype.render = function () {
  var food = document.createElement("div");
  food.className = "food";
  food.style.width = this.size + "px";
  food.style.height = this.size + "px";
  this.dom = food;
  this.resetPosition();
  this.gameMap.dom.append(food);
};

// 随机生成食物位置(根据食物大小和地图大小)
Food.prototype.getRandomPosition = function () {
  var foodSize = this.size;
  var mapSize = this.gameMap.size;
  var pos = Math.ceil(Math.random() * (mapSize / foodSize)) * foodSize;
  return pos + foodSize > mapSize ? pos - foodSize : pos;
};

// 重新设置位置
Food.prototype.resetPosition = function () {
  var x, y;
  x = this.getRandomPosition();
  y = this.getRandomPosition();
  this.x = x;
  this.y = y;
  this.dom.style.left = x + "px";
  this.dom.style.top = y + "px";
};

// 单例
Food.getInstance = function (options) {
  var foodInstance = null;
  if (!foodInstance) {
    foodInstance = new Food(options);
  }
  return foodInstance;
};
