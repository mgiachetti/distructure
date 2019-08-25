//(function(){
"use strict"

var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');;
var fontHeight = 0;

var Distructure = window.Distructure = {};

Distructure.If = function (condition, ifBlock, elseBlock) {
  this.left = ifBlock;
  this.right = elseBlock;
  this.text = condition;
  this.ROOF_HEIGHT = 100;
  this.SEP = 20;
  this.BASE_LINE = 5;
  this.NO_ELSE_WIDTH = 100;
}

Distructure.If.prototype = {
  className: "If",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);
    var r = this.ROOF_HEIGHT;
    var w2 = w / 2;
    var sep = this.SEP;
    var l = this.left.width(ctx) + 2 * sep;


    ctx.moveTo(0, r);
    ctx.lineTo(w2, 0);
    ctx.lineTo(w, r);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, r);
    ctx.lineTo(w, r);

    ctx.moveTo(l, h);
    ctx.lineTo(l, r);

    if (!this.right) {
      //empty else
      ctx.lineTo(w, h);
    }

    ctx.textBaseline = 'bottom';
    ctx.fillText(this.text, w2, r - this.BASE_LINE);

    ctx.stroke();

    ctx.save();
    ctx.translate(sep, r + sep);
    this.left.render(ctx);
    ctx.restore();

    if (this.right) {
      ctx.save();
      ctx.translate(l + sep, r + sep);
      this.right.render(ctx);
      ctx.restore();
    }

  },
  width: function (ctx) {
    if (this._width) return this._width;

    var l = this.left.width(ctx) + 2 * this.SEP;
    var r = this.right ? this.right.width(ctx) + 2 * this.SEP : this.NO_ELSE_WIDTH;

    return this._width = l + r;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    var l = this.left.height(ctx);
    var r = this.right ? this.right.height(ctx) : 0;

    return this._height = Math.max(l, r) + this.ROOF_HEIGHT + 2 * this.SEP;
  }
}

Distructure.Case = function (condition, block) {
  this.text = condition;
  this.block = block;
}

Distructure.Switch = function (condition, cases, defaultBlock) {
  this.text = condition;
  this.cases = cases || [];
  this.defaultBlock = defaultBlock;
  this.BASE_LINE = 5;
  this.ROOF_HEIGHT = 70;
  this.CONDITION_HEIGHT = 30;
  this.SEP = 20;
  this.NO_DEFAULT_WIDTH = 100;
}

Distructure.Switch.prototype = {
  className: "Switch",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);
    var r = this.ROOF_HEIGHT;
    var ch = this.CONDITION_HEIGHT;
    var w2 = w / 2;
    var sep = this.SEP;

    ctx.moveTo(0, r);
    ctx.lineTo(w2, 0);
    ctx.lineTo(w, r);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, r);
    ctx.lineTo(w, r);

    ctx.textBaseline = 'bottom';
    ctx.fillText(this.text, w / 2, r - this.BASE_LINE);

    var x = 0;
    for (var i = 0; i < this.cases.length; i++) {
      var c = this.cases[i];
      var dx = c.block.width(ctx) + 2 * sep
      ctx.moveTo(x, r + ch);
      ctx.lineTo(x + dx, r + ch);
      ctx.lineTo(x + dx, r);
      ctx.lineTo(x + dx, h);

      ctx.textBaseline = 'middle';
      ctx.fillText(c.text, x + dx / 2, r + ch / 2);

      x += dx;
    };


    if (!this.defaultBlock) {
      //empty default
      ctx.moveTo(x, r);
      ctx.lineTo(w, h);
    }

    ctx.stroke();

    x = 0;
    for (var i = 0; i < this.cases.length; i++) {
      var c = this.cases[i];
      var dx = c.block.width(ctx) + 2 * sep

      ctx.save();
      ctx.translate(x + sep, r + ch + sep);
      c.block.render(ctx);
      ctx.restore();

      x += dx;
    };

    if (this.defaultBlock) {
      ctx.save();
      ctx.translate(x + sep, r + sep);
      this.defaultBlock.render(ctx);
      ctx.restore();
    }

  },
  width: function (ctx) {
    if (this._width) return this._width;

    var w = 0;
    for (var i = this.cases.length - 1; i >= 0; i--) {
      w += this.cases[i].block.width(ctx) + 2 * this.SEP;
    };

    w += this.defaultBlock ? this.defaultBlock.width(ctx) + 2 * this.SEP : this.NO_DEFAULT_WIDTH;

    return this._width = w;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    var h = this.defaultBlock ? this.defaultBlock.height(ctx) : 0;

    for (var i = this.cases.length - 1; i >= 0; i--) {
      h = Math.max(this.cases[i].block.height(ctx), h);
    };

    if (this.cases.length) {
      h += this.CONDITION_HEIGHT;
    }

    return this._height = h + this.ROOF_HEIGHT + 2 * this.SEP;
  }
}

Distructure.For = function (condition, block) {
  this.block = block;
  this.text = condition;
  this.ROOF_HEIGHT = 30;
  this.SEP = 20;
}

Distructure.For.prototype = {
  className: "For",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);
    var r = this.ROOF_HEIGHT;
    var sep = this.SEP;

    ctx.moveTo(w, r);
    ctx.lineTo(0, r);
    ctx.lineTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, r);

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, r / 2);

    ctx.stroke();

    ctx.save();
    ctx.translate(sep, r + sep);
    this.block.render(ctx);
    ctx.restore();
  },
  width: function (ctx) {
    if (this._width) return this._width;

    return this._width = this.block.width(ctx) + 2 * this.SEP;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    return this._height = this.block.height(ctx) + this.ROOF_HEIGHT + 2 * this.SEP;
  }
}

Distructure.While = Distructure.For;
Distructure.While.prototype = Distructure.For.prototype;

Distructure.Until = function (condition, block) {
  this.block = block;
  this.text = condition;
  this.ROOF_HEIGHT = 30;
  this.SEP = 20;
}

Distructure.Until.prototype = {
  className: "Until",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);
    var r = this.ROOF_HEIGHT;
    var sep = this.SEP;

    ctx.moveTo(w, h - r);
    ctx.lineTo(0, h - r);
    ctx.lineTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, h - r);

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, h - r / 2);

    ctx.stroke();

    ctx.save();
    ctx.translate(sep, sep);
    this.block.render(ctx);
    ctx.restore();
  },
  width: function (ctx) {
    if (this._width) return this._width;

    return this._width = this.block.width(ctx) + 2 * this.SEP;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    return this._height = this.block.height(ctx) + this.ROOF_HEIGHT + 2 * this.SEP;
  }
}

Distructure.Tag = function (text) {
  this.text = text;
  this.SEP = 14;
}

Distructure.Tag.prototype = {
  className: "Tag",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);

    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, 2 * Math.PI);

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, h / 2);

    ctx.stroke();
  },
  width: function (ctx) {
    if (this._width) return this._width;
    return this._width = Math.max(ctx.measureText(this.text).width, fontHeight) + 2 * this.SEP | 0;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    return this._height = this.width(ctx);
  }
}

Distructure.Main = function (block) {
  this.block = new Distructure.Block([
    new Distructure.Tag('B'),
    block,
    new Distructure.Tag('E')
  ]);
}

Distructure.Main.prototype = {
  className: "Main",
  render: function (ctx) {
    this.block.render(ctx);
  },
  width: function (ctx) {
    return this.block.width(ctx);
  },
  height: function (ctx) {
    return this.block.height(ctx);
  }
}

Distructure.Instruction = function (instruction) {
  this.text = instruction;
  this.SEP = 5;
}

Distructure.Instruction.prototype = {
  className: "Instruction",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);

    ctx.strokeRect(0, 0, w, h)

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, h / 2);

    ctx.stroke();
  },
  width: function (ctx) {
    if (this._width && this._ctx_width == ctx) return this._width;
    this._ctx_width = ctx;
    console.log(`${this.text}: ${ctx.measureText(this.text).width}`);
    return this._width = ctx.measureText(this.text).width + 2 * this.SEP;
  },
  height: function (ctx) {
    if (this._height && this._ctx_height == ctx) return this._height;
    this._ctx_height = ctx;
    return this._height = fontHeight + 2 * this.SEP;
  }
}

Distructure.Function = function (instruction) {
  this.text = instruction;
  this.SEP = 5;
  this.FSEP = 5;
}

Distructure.Function.prototype = {
  className: "Function",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);
    var f = this.FSEP;

    ctx.strokeRect(0, 0, w, h)
    ctx.moveTo(f, 0);
    ctx.lineTo(f, h);
    ctx.moveTo(w - f, 0);
    ctx.lineTo(w - f, h);

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, h / 2);

    ctx.stroke();
  },
  width: function (ctx) {
    if (this._width && this._ctx_width == ctx) return this._width;
    this._ctx_width = ctx;
    return this._width = ctx.measureText(this.text).width + 2 * this.SEP + 2 * this.FSEP;
  },
  height: function (ctx) {
    if (this._height && this._ctx_height == ctx) return this._height;
    this._ctx_height = ctx;

    return this._height = fontHeight + 2 * this.SEP;
  }
}

Distructure.Cin = function (instruction) {
  this.text = instruction;
  this.SEP = 5;
  this.FSEP = 5;
}

Distructure.Cin.prototype = {
  className: "Cin",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);
    var f = this.FSEP;

    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w - f, h);
    ctx.lineTo(f, h);
    ctx.lineTo(0, 0);

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, h / 2);

    ctx.stroke();
  },
  width: function (ctx) {
    if (this._width && this._ctx_width == ctx) return this._width;
    this._ctx_width = ctx;
    return this._width = ctx.measureText(this.text).width + 2 * this.SEP + 2 * this.FSEP;
  },
  height: function (ctx) {
    if (this._height && this._ctx_height == ctx) return this._height;
    this._ctx_height = ctx;

    return this._height = fontHeight + 2 * this.SEP;
  }
}

Distructure.Cout = function (instruction) {
  this.text = instruction;
  this.SEP = 5;
  this.FSEP = 5;
}

Distructure.Cout.prototype = {
  className: "Cout",
  render: function (ctx) {

    var w = this.width(ctx);
    var h = this.height(ctx);
    var f = this.FSEP;

    ctx.moveTo(f, 0);
    ctx.lineTo(w - f, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(f, 0);

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, h / 2);

    ctx.stroke();
  },
  width: function (ctx) {
    if (this._width && this._ctx_width == ctx) return this._width;
    this._ctx_width = ctx;
    return this._width = ctx.measureText(this.text).width + 2 * this.SEP + 2 * this.FSEP;
  },
  height: function (ctx) {
    if (this._height && this._ctx_height == ctx) return this._height;
    this._ctx_height = ctx;

    return this._height = fontHeight + 2 * this.SEP;
  }
}

Distructure.Block = function (children) {
  this.children = children || [];
}

Distructure.Block.prototype = {
  className: "Block",
  render: function (ctx) {

    ctx.save()

    var w = this.width(ctx);
    var h = this.height(ctx);

    var y = 0, dy = 0;
    var x = 0;

    for (var i = 0; i < this.children.length; i++) {
      var c = this.children[i];
      var cw = c.width(ctx);
      var ch = c.height(ctx);
      var dx = (w - cw) / 2 - x;

      ctx.translate(dx, dy);

      c.render(ctx);

      dy = ch;
      x += dx;
      y += dy;
    }

    ctx.restore();

  },
  makeSameSize: function (ctx) {
    var sameSizeClass = { 'Instruction': true, 'Function': true, 'Cout': true, 'Cin': true };
    var w = 0;
    var last = this.children.length - 1;
    var j = -1;
    var j1 = -1;
    for (var i = 0; i <= last; ++i) {
      var c = this.children[i];
      var s = sameSizeClass[c.className];
      if (s) {
        w = Math.max(c.width(ctx), w);
        j1 = i;
        if (j == -1) j = i;
      }

      if (j != -1 && (!s || i == last)) {

        for (; j <= j1; j++) {
          this.children[j]._width = w;
        }
        j = -1;
        w = 0;
      }
    }
  },
  width: function (ctx) {
    if (this._width) return this._width;

    var w = 0;
    for (var i = 0; i < this.children.length; ++i) {
      w = Math.max(this.children[i].width(ctx), w);
    }

    this.makeSameSize(ctx);

    return this._width = w;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    var h = 0;
    for (var i = 0; i < this.children.length; ++i) {
      h += this.children[i].height(ctx);
    }

    return this._height = h;
  }
}

function parse(codeBlock) {
  let stack = [];
  let currentBlock = null;
  function push(block) {
    console.log(`PUSH: ${currentBlock.className} entra ${block}`);
    if (currentBlock) {
      stack.push(currentBlock);
    }
    currentBlock = block;
  }

  function pop() {
    currentBlock = stack.pop();
  }

  function add(instruction) {
    if (!currentBlock) {
      // Instructions without a main block
      currentBlock = new Distructure.Block();
    }

    currentBlock.children.push(instruction);
  }

  let emptySwitch = true;
  codeBlock
    .replace(/\t/g, '  ')
    .split(/\r?\n/g).forEach(line => {
      line = line
        .replace(/\/\/.*/g, '') // remove comments
        .trim();

      if (line.length === 0) {
        // empty line
        return;
      }

      let m;
      if (line.match(/^BEGIN$/i)) {
        // main block
        const newBlock = new Distructure.Block();
        add(new Distructure.Main(newBlock));
        push(newBlock);
      } else if (line.match(/^IF /i)) {
        const newBlock = new Distructure.Block();
        const condition = line.slice(3);
        add(new Distructure.If(condition, newBlock));
        push(newBlock);
      } else if (line.match(/^END$/i)) {
        // end
        pop();
      } else if (line.match(/^ELSE$/i)) {
        // end IF block
        pop();
        const ifIns = currentBlock.children[currentBlock.children.length - 1];
        const newBlock = new Distructure.Block();
        ifIns.right = newBlock;
        push(newBlock);
      } else if (line.match(/^FOR /i)) {
        const newBlock = new Distructure.Block();
        const condition = line.slice(4);
        add(new Distructure.For(condition, newBlock));
        push(newBlock);
      } else if (line.match(/^UNTIL /i)) {
        const newBlock = new Distructure.Block();
        const condition = line.slice(6);
        add(new Distructure.Until(condition, newBlock));
        push(newBlock);
      } else if (line.match(/^SWITCH /i)) {
        const condition = line.slice(7);
        add(new Distructure.Switch(condition));
        emptySwitch = true;
      } else if (m = line.match(/(^CASE )|(^DEFAULT$)/i)) {
        if (!emptySwitch) {
          pop();
        }
        emptySwitch = false;
        const switchIns = currentBlock.children[currentBlock.children.length - 1];
        const newBlock = new Distructure.Block();
        if (m[0].toUpperCase() === 'DEFAULT') {
          switchIns.defaultBlock = newBlock;
        } else {
          const condition = line.slice(5);
          switchIns.cases.push(new Distructure.Case(condition, newBlock));
        }
        push(newBlock);
      } else if (line.match(/^BOX /i)) {
        add(new Distructure.Instruction(line.slice(4)));
      } else if (line.match(/^CIN /i)) {
        add(new Distructure.Cin(line.slice(4)));
      } else if (line.match(/^COUT /i)) {
        add(new Distructure.Cout(line.slice(5)));
      } else if (line.match(/^FUNCTION /i)) {
        add(new Distructure.Function(line.slice(8)));
      } else if (line.match(/^TAG /i)) {
        add(new Distructure.Tag(line.slice(4)));
      } else {
        // default use Instruction
        add(new Distructure.Instruction(line));
      }
    });
  return currentBlock;
}


function render(code) {
  var elem = parse(code);

  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  var cw = rect.width;
  // var ch = elem.height(ctx);
  var ch = rect.height;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${ch}px`;
  canvas.width = rect.width * dpr;
  canvas.height = ch * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr * 0.5, dpr * 0.5);

  //clear canvas
  // ctx.fillStyle = "white";
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, cw, ch);

  //if
  // ctx.strokeStyle = "1px black";
  // ctx.fillStyle = "black";
  ctx.lineWidht = 1;
  ctx.strokeStyle = "#d4d4d4";
  ctx.fillStyle = "#d4d4d4";
  ctx.textAlign = "center";
  ctx.font = "30px Courier New";

  fontHeight = getTextHeight(ctx);

  elem.render(ctx);
}


var getTextHeight = function (ctx) {
  var font = ctx.font;
  var text = '<span style="font-family:' + font + '">Hg</span>';

  var content = document.createElement('div');
  content.innerHTML = text;

  document.body.appendChild(content);
  var height = content.clientHeight;
  document.body.removeChild(content);

  return height;
};

//})()

