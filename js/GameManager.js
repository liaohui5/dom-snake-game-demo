// 游戏管理类,管理游戏的开始,结束,重新开始
function GameManager() {}

// 设置游戏的属性
GameManager.prototype.setOptions = function () {
  this.score = 0; // 得分
  this.gameMap = null;
  this.food = null;
  this.snake = null;
};

// 初始化
GameManager.prototype.init = function () {
  // 蛇和食物的宽度/高度
  var snakeAndFoodSize = 20;

  // 初始化地图
  this.gameMap = GameMap.getInstance({
    size: 800,
    bgColor: "#000",
  });

  // 初始化食物
  this.food = Food.getInstance({
    size: snakeAndFoodSize,
    gameMap: this.gameMap,
  });

  // 初始化蛇
  this.snake = Snake.getInstance({
    size: snakeAndFoodSize,
    speed: 100, // ms
    length: 5, // 默认长度
    gameMap: this.gameMap,
    food: this.food,
    gameManager: this,
  });
};

// 开启游戏
GameManager.prototype.start = function () {
  this.setOptions();
  this.init();

  // 绘制
  this.gameMap.render();
  this.food.render();
  this.snake.render();
  this.snake.run();
};

// 结束游戏
GameManager.prototype.gameOver = function () {
  alert("游戏结束, 您的得分是:" + this.score);
  window.location.reload(true);
};

// 加分
GameManager.prototype.addScore = function () {
  this.score += 1;
};

// 单例
GameManager.getInstance = (function () {
  var gameMgr = null;
  return function () {
    if (!gameMgr) {
      gameMgr = new GameManager();
    }
    return gameMgr;
  };
})();
