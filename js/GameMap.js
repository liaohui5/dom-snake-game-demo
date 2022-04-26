function GameMap(options) {
  this.bgColor = options.bgColor;
  this.size = options.size;
  this.dom = null;
}

// 绘制地图
GameMap.prototype.render = function () {
  var oMap = document.createElement("div");
  oMap.style.width = this.size + "px";
  oMap.style.height = this.size + "px";
  oMap.style.backgroundColor = this.bgColor;
  oMap.className = "game_map";
  this.dom = oMap;
  document.body.append(oMap);
};

// 单例模式
GameMap.getInstance = (function () {
  return function (options) {
    var gameMap = null;
    if (!gameMap) {
      gameMap = new GameMap(options);
    }
    return gameMap;
  };
})();
