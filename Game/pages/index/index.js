var startX = 0;
var startY = 0;

var moveX = 0;
var moveY = 0;

var X = 0;
var Y = 0;

var st = {
  x: 0,
  y: 0,
  color: "#000000",
  w: 20,
  h: 20
}

//身体对象数组
var snb = [];


//食物对象数组
var foods = [];

//窗口宽高
var windowWidth = 0;
var windowHeight = 0;
//用于确定是否删除


var collideBol = true;


//手指方向
var direction = null;
//蛇移动方向
var sd = "right"

Page({
  ss: function (e) {
    startX = e.touches[0].x;
    startY = e.touches[0].y;
  },
  dd: function (e) {
    moveX = e.touches[0].x;
    moveY = e.touches[0].y;

    X = moveX - startX;
    Y = moveY - startY;


    if (Math.abs(X) > Math.abs(Y) && X > 0) {
      direction = "right";
    } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      direction = "left";
    } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
      direction = "bottom";
    } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
      direction = "top";
    }
  },

  //方向
  canvasEnd: function () {
    sd = direction;
  },

  onReady: function () {
    //获取绘图上下文
    var context = wx.createCanvasContext();

    //速度帧率
    var frameNum = 0;

    function draw(obj) {
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x, obj.y, obj.w, obj.h);
      context.closePath();
      context.fill();
    }
    //碰撞函数
    function collide(obj1, obj2) {
      var l1 = obj1.x;
      var r1 = l1 + obj1.w
      var t1 = obj1.y;
      var b1 = t1 + obj1.h

      var l2 = obj2.x;
      var r2 = l2 + obj2.w;
      var t2 = obj2.y;
      var b2 = t2 + obj2.h;

      if (r1 > l2 && l1 < r2 && b1 > t2 && t1 < b2) {
        return true;
      } else {
        return false;
      }
    }
    //重置食物位置
    //function resetFood(obj){}


    function qq() {
      frameNum++;
      if (frameNum % 20 == 0) {



        snb.push({
          x: st.x,
          y: st.y,
          w: 20,
          h: 20,
          color: "#FF0000"
        });
        if (snb.length > 4) {
          //移除
          if (collideBol) {
            snb.shift();
          } else {
            collideBol = true;
          }

        }




        switch (sd) {
          case "left":
            st.x -= st.w;
            break;
          case "right":
            st.x += st.w;
            break;
          case "top":
            st.y -= st.h;
            break;
          case "bottom":
            st.y += st.h;
            break;
        }

        //添加身体对象
        //snb.push({
        //x: st.x,
        // y: st.y,
        // w: 20,
        // h: 20,
        //color: "#FFFFFF"
        // }); 
        // if (snb.length > 4) {
        //移除
        //snb.shift();
        //}

      }

      //绘制蛇头
      //context.setFillStyle(st.color);
      //context.beginPath();
      //context.rect(st.x,st.y,st.w,st.h);
      //context.closePath();
      //context.fill();
      draw(st);
      //绘制蛇身    
      for (var i = 0; i < snb.length; i++) {
        var snbs = snb[i];
        draw(snbs);
      }




      //绘制食物
      for (var i = 0; i < foods.length; i++) {
        var foodobj = foods[i];
        draw(foodobj);

        if (collide(st, foodobj)) {

          collideBol = false;
          foodobj.reset();

        }
      }

      wx.drawCanvas({
        canvasId: "aa",
        actions: context.getActions()

      });

      requestAnimationFrame(qq);
    }

    function rand(min, max) {
      return parseInt(Math.random() * (max - min)) + min;
    }
    //构造食物对象

    function Food() {
      this.x = rand(0, windowWidth);
      this.y = rand(0, windowHeight);
      var w = rand(10, 20);
      this.w = w;
      this.h = w;
      this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")"


      this.reset = function () {
        this.x = rand(0, windowWidth);
        this.y = rand(0, windowHeight);
        this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")"
      }

    }


    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;
        for (var i = 0; i < 20; i++) {
          var foodobj = new Food();
          foods.push(foodobj);

        }


        qq();
      }

    })

  }
})
