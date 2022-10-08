class Snow {
  constructor(opt = {}) {
    // 是否是雨
    this.isRain = opt.isRain || false;
    // 元素
    this.el = null;
    // 倾斜方向
    this.dir = opt.dir || "r";
    // 直径
    this.width = 0;
    // 最大直径
    this.maxWidth = opt.maxWidth || 30;
    // 最小直径
    this.minWidth = opt.minWidth || 2;
    // 透明度
    this.opacity = 0;
    // 水平位置
    this.x = 0;
    // 重置位置
    this.y = 0;
    // z轴位置
    this.z = 0;
    // 水平速度
    this.sx = 0 | opt.sx;
    // 是否左右摇摆
    this.isSwing = false;
    // 左右摇摆的步长
    this.stepSx = 0.02;
    // 左右摇摆的正弦函数x变量
    this.swingRadian = 1;
    // 左右摇摆的正弦x步长
    this.swingStep = 0.01;
    // 垂直速度
    this.sy = 0;
    // 最大速度
    this.maxSpeed = opt.maxSpeed || 4;
    // 最小速度
    this.minSpeed = opt.minSpeed || 1;
    // 快速划过的最大速度
    this.quickMaxSpeed = opt.quickMaxSpeed || 10;
    // 快速划过的最小速度
    this.quickMinSpeed = opt.quickMinSpeed || 8;
    // 快速划过的宽度
    this.quickWidth = opt.quickWidth || 80;
    // 快速划过的透明度
    this.quickOpacity = opt.quickOpacity || 0.2;
    // 窗口尺寸
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.init();
  }

  // 随机初始化属性
  init(reset) {
    let isQuick = Math.random() > 0.8;
    this.isSwing = Math.random() > 0.8;
    this.width = isQuick
      ? this.quickWidth
      : Math.floor(Math.random() * this.maxWidth + this.minWidth);
    this.opacity = isQuick ? this.quickOpacity : Math.random() * 0.8;
    this.x = Math.floor(Math.random() * (this.windowWidth - this.width));
    this.y = Math.floor(Math.random() * (this.windowHeight - this.width));
    if (reset && Math.random() > 0.8) {
      this.x = -this.width;
    } else if (reset) {
      this.y = -this.width;
    }
    this.sy = isQuick
      ? Math.random() * this.quickMaxSpeed + this.quickMinSpeed
      : Math.random() * this.maxSpeed + this.minSpeed;
    if (!this.isRain) {
      this.sx = this.dir === "r" ? this.sy : -this.sy;
    }
    this.z = isQuick ? Math.random() * 300 + 200 : 0;
    this.swingStep = 0.01 * Math.random();
    this.swingRadian = Math.random() * (1.1 - 0.9) + 0.9;
  }

  // 设置样式
  setStyle() {
    if (this.isRain) {
        this.el.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            display: block;
            width: ${this.isRain ? 5 : this.width}px;
            height: ${this.width}px;
            opacity: ${this.opacity};
            background-image: radial-gradient(rgba(130, 216, 224, 1) 0%, rgba(255, 255, 255, 0) 60%);
            border-radius: 50%;
            z-index: 9999999999999;
            pointer-events: none;
            transform: translate(${this.x}px, ${this.y}px) ${this.getRotate(
          this.sy,
          this.sx
        )};
        `;
    } else {
        this.el.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            display: block;
            width: ${this.isRain ? 5 : this.width}px;
            height: ${this.width}px;
            opacity: ${this.opacity};
            background-image: radial-gradient(#fff 0%, rgba(255, 255, 255, 0) 60%);
            border-radius: 50%;
            z-index: 9999999999999;
            pointer-events: none;
            transform: translate(${this.x}px, ${this.y}px) ${this.getRotate(
          this.sy,
          this.sx
        )};
        `;
    }
  }

  // 渲染
  render() {
    this.el = document.createElement("div");
    this.setStyle();
    document.body.appendChild(this.el);
  }

  move() {
    if (this.isSwing) {
      // if (this.sx >= 1 || this.sx <= -1) {
      //     this.stepSx = -this.stepSx
      // }
      // this.sx += this.stepSx
      if (this.swingRadian > 1.1 || this.swingRadian < 0.9) {
        this.swingStep = -this.swingStep;
      }
      this.swingRadian += this.swingStep;
      if (this.isRain) {
        this.x += this.sx;
      } else {
        this.x += this.sx * Math.sin(this.swingRadian * Math.PI);
      }
      this.y -= this.sy * Math.cos(this.swingRadian * Math.PI);
    } else {
      this.x += this.sx;
      this.y += this.sy;
    }
    // 完全离开窗口就调一下初始化方法，另外还需要修改一下init方法，因为重新出现我们是希望它的y坐标为0或者小于0，这样就不会又凭空出现的感觉，而是从天上下来的
    if (
      this.x < -this.width ||
      this.x > this.windowWidth ||
      this.y > this.windowHeight
    ) {
      this.init(true);
      this.setStyle();
    }
    this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, ${
      this.z
    }px) ${this.getRotate(this.sy, this.sx)}`;
  }

  getRotate(sy, sx) {
    return this.isRain
      ? `rotate(${sx === 0 ? 0 : 90 + Math.atan(sy / sx) * (180 / Math.PI)}deg)`
      : "";
  }
}

export default class Snows {
  constructor(opt = {}) {
    this.num = opt.num || 100;
    this.opt = opt;
    this.snowList = [];
    this.createSnows();
    this.moveSnow();
  }
  createSnows() {
    this.snowList = [];
    for (let i = 0; i < this.num; i++) {
      let snow = new Snow(this.opt);
      snow.render();
      this.snowList.push(snow);
    }
  }
  moveSnow() {
    window.requestAnimationFrame(() => {
      this.snowList.forEach((item) => {
        item.move();
      });
      this.moveSnow();
    });
  }
}

const random = Math.ceil(Math.random() * 3);
$(function () {
  let colors = []
  switch (random) {
    case 1:
        generateRain()
        $("body").css("background-image", "url(./img/changdeng.png)");
        colors = [
          "#fff",
          "#FFC0CB",
          "#ACDC93",
          "#EF5989",
          "#C3E455",
        ];
        $("#rain_code").css("display", "block");
        $("#rain_code").show().typewriter();
      break;
    case 2:
        generateSnow()
        $("body").css("background-image", "url(./img/changdeng1.png)");
        colors = ['#fff',"#C0D8FF", "#FFC0CB", "#ACDC93", "#EF5989", "#C3E455"];
        $("#snow_code").css("display", "block");
        $("#snow_code").show().typewriter();
      break;
    default:
        generateRain();
        generateSnow();
          $("body").css("background-image", "url(./img/changdeng2.png)");
            colors = [
            '#fff',
            "#C0D8FF",
            "#FFC0CB",
            "#ACDC93",
            "#EF5989",
            "#C3E455",
          ];
        $("#rain_snow_code").css("display", "block");
        $("#rain_snow_code").show().typewriter();
      break;
  }
  console.log(colors);
    $("body").css("background-color", colors[Math.round(Math.random() * colors.length)]);
});

// 造雪
function generateRain() {
  new Snows({
    isRain: true,
    num: 300,
    maxSpeed: 1,
    minSpeed: 1,
    maxWidth: 20,
    quickMaxSpeed: 1.5,
    quickMinSpeed: 1.5,
    quickWidth: 15,
    quickOpacity: 0.1,
    isSwing: true,
    stepSx: 10,
    sx: 0.5,
  });
}

// 造🌧
function generateSnow() {
  new Snows({
    isRain: false,
    num: 150,
  });
}
