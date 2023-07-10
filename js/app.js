//(function(){
"use strict"

const canvas = document.getElementById('canvas');
let fontHeight = 0;

const Distructure = window.Distructure = {};

Distructure.If = function (condition, ifBlock, elseBlock) {
  this.left = ifBlock;
  this.right = elseBlock;
  this.text = condition;
  this.ROOF_HEIGHT = 50;
  this.SEP = 10;
  this.BASE_LINE = 2.5;
  this.NO_ELSE_WIDTH = 50;
}
Distructure.If.prototype = {
  className: "If",
  render: function (ctx) {

    const w = this.width(ctx);
    const h = this.height(ctx);
    const r = this.ROOF_HEIGHT;
    const w2 = w / 2;
    const sep = this.SEP;
    const l = this.left.width(ctx) + 2 * sep;

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

    const l = this.left.width(ctx) + 2 * this.SEP;
    const r = this.right ? this.right.width(ctx) + 2 * this.SEP : this.NO_ELSE_WIDTH;

    this._width = l + r;
    return this._width;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    const l = this.left.height(ctx);
    const r = this.right ? this.right.height(ctx) : 0;

    this._height = Math.max(l, r) + this.ROOF_HEIGHT + 2 * this.SEP;
    return this._height;
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
  this.BASE_LINE = 2.5;
  this.ROOF_HEIGHT = 35;
  this.CONDITION_SEP = 3;
  this.SEP = 10;
  this.NO_DEFAULT_WIDTH = 50;
}
Distructure.Switch.prototype = {
  className: "Switch",
  render: function (ctx) {

    const w = this.width(ctx);
    const h = this.height(ctx);
    const r = this.ROOF_HEIGHT;
    const ch = fontHeight + 2 * this.CONDITION_SEP;
    const w2 = w / 2;
    const sep = this.SEP;

    ctx.moveTo(0, r);
    ctx.lineTo(w2, 0);
    ctx.lineTo(w, r);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.lineTo(0, r);
    ctx.lineTo(w, r);

    ctx.textBaseline = 'bottom';
    ctx.fillText(this.text, w / 2, r - this.BASE_LINE);

    let x = 0;
    for (const c of this.cases) {
      const dx = c.block.width(ctx) + 2 * sep
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
    for (const c of this.cases) {
      const dx = c.block.width(ctx) + 2 * sep

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

    let w = 0;
    for (let i = this.cases.length - 1; i >= 0; i--) {
      w += this.cases[i].block.width(ctx) + 2 * this.SEP;
    };

    w += this.defaultBlock ? this.defaultBlock.width(ctx) + 2 * this.SEP : this.NO_DEFAULT_WIDTH;

    this._width = w;
    return this._width;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    let h = this.defaultBlock ? this.defaultBlock.height(ctx) : 0;

    for (let i = this.cases.length - 1; i >= 0; i--) {
      h = Math.max(this.cases[i].block.height(ctx), h);
    };

    if (this.cases.length) {
      h += fontHeight + 2 * this.CONDITION_SEP;
    }

    this._height = h + this.ROOF_HEIGHT + 2 * this.SEP;
    return this._height;
  }
}

Distructure.For = function (condition, block) {
  this.block = block;
  this.text = condition;
  this.ROOF_SEP = 3;
  this.SEP = 10;
}
Distructure.For.prototype = {
  className: "For",
  render: function (ctx) {

    const w = this.width(ctx);
    const h = this.height(ctx);
    const r = fontHeight + 2 * this.ROOF_SEP;
    const sep = this.SEP;

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

    this._width = this.block.width(ctx) + 2 * this.SEP;
    return this._width;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    const roofHeight = fontHeight + 2 * this.ROOF_SEP;
    this._height = this.block.height(ctx) + roofHeight + 2 * this.SEP;
    return this._height;
  }
}

Distructure.While = Distructure.For;
Distructure.While.prototype = Distructure.For.prototype;

Distructure.Until = function (condition, block) {
  this.block = block;
  this.text = condition;
  this.ROOF_SEP = 3;
  this.SEP = 10;
}
Distructure.Until.prototype = {
  className: "Until",
  render: function (ctx) {

    const w = this.width(ctx);
    const h = this.height(ctx);
    const r = fontHeight + 2 * this.ROOF_SEP;
    const sep = this.SEP;

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

    this._width = this.block.width(ctx) + 2 * this.SEP;
    return this._width;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    const r = fontHeight + 2 * this.ROOF_SEP;
    this._height = this.block.height(ctx) + r + 2 * this.SEP;
    return this._height;
  }
}

Distructure.Tag = function (text) {
  this.text = text;
  this.SEP = 7;
}

Distructure.Tag.prototype = {
  className: "Tag",
  render: function (ctx) {

    const w = this.width(ctx);
    const h = this.height(ctx);

    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, 2 * Math.PI);

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, h / 2);

    ctx.stroke();
  },
  width: function (ctx) {
    if (this._width) return this._width;
    this._width = Math.max(ctx.measureText(this.text).width, fontHeight) + 2 * this.SEP | 0;
    return this._width;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    this._height = this.width(ctx);
    return this._height;
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

    const w = this.width(ctx);
    const h = this.height(ctx);

    ctx.strokeRect(0, 0, w, h)

    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, w / 2, h / 2);

    ctx.stroke();
  },
  width: function (ctx) {
    if (this._width && this._ctx_width == ctx) return this._width;
    this._ctx_width = ctx;
    this._width = ctx.measureText(this.text).width + 2 * this.SEP;
    return this._width;
  },
  height: function (ctx) {
    if (this._height && this._ctx_height == ctx) return this._height;
    this._ctx_height = ctx;
    this._height = fontHeight + 2 * this.SEP;
    return this._height;
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

    const w = this.width(ctx);
    const h = this.height(ctx);
    const f = this.FSEP;

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
    this._width = ctx.measureText(this.text).width + 2 * this.SEP + 2 * this.FSEP;
    return this._width;
  },
  height: function (ctx) {
    if (this._height && this._ctx_height == ctx) return this._height;
    this._ctx_height = ctx;

    this._height = fontHeight + 2 * this.SEP;
    return this._height;
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

    const w = this.width(ctx);
    const h = this.height(ctx);
    const f = this.FSEP;

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
    this._width = ctx.measureText(this.text).width + 2 * this.SEP + 2 * this.FSEP;
    return this._width;
  },
  height: function (ctx) {
    if (this._height && this._ctx_height == ctx) return this._height;
    this._ctx_height = ctx;

    this._height = fontHeight + 2 * this.SEP;
    return this._height;
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

    const w = this.width(ctx);
    const h = this.height(ctx);
    const f = this.FSEP;

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
    this._width = ctx.measureText(this.text).width + 2 * this.SEP + 2 * this.FSEP;
    return this._width;
  },
  height: function (ctx) {
    if (this._height && this._ctx_height == ctx) return this._height;
    this._ctx_height = ctx;

    this._height = fontHeight + 2 * this.SEP;
    return this._height;
  }
}

Distructure.EmptyLine = function () {
  this.SEP = 5;
}
Distructure.EmptyLine.prototype = {
  className: "EmptyLine",
  render: function () { },
  width: function (ctx) {
    return this.height();
  },
  height: function (ctx) {
    this._height = fontHeight + 2 * this.SEP;
    return this._height;
  }
}

Distructure.Block = function (children) {
  this.children = children || [];
}
Distructure.Block.prototype = {
  className: "Block",
  render: function (ctx) {

    ctx.save()

    const w = this.width(ctx);

    let y = 0, dy = 0;
    let x = 0;

    for (const c of this.children) {
      const cw = c.width(ctx);
      const ch = c.height(ctx);
      const dx = (w - cw) / 2 - x;

      ctx.translate(dx, dy);

      c.render(ctx);

      dy = ch;
      x += dx;
      y += dy;
    }

    ctx.restore();

  },
  makeSameSize: function (ctx) {
    const sameSizeClass = { 'Instruction': true, 'Function': true, 'Cout': true, 'Cin': true };
    let w = 0;
    const last = this.children.length - 1;
    let j = -1;
    let j1 = -1;
    for (let i = 0; i <= last; ++i) {
      const c = this.children[i];
      const s = sameSizeClass[c.className];
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

    let w = 0;
    for (const child of this.children) {
      w = Math.max(child.width(ctx), w);
    }

    this.makeSameSize(ctx);

    this._width = w;
    return this._width;
  },
  height: function (ctx) {
    if (this._height) return this._height;

    let h = 0;
    for (const child of this.children) {
      h += child.height(ctx);
    }

    this._height = h;
    return this._height;
  }
}

function parse(codeBlock) {
  let stack = [];
  let currentBlock = new Distructure.Block();
  function push(block) {
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
      } else if (line.match(/^END$/i)) {
        // end
        pop();
      } else if (line.match(/^IF /i)) {
        const newBlock = new Distructure.Block();
        const condition = line.slice(3);
        add(new Distructure.If(condition, newBlock));
        push(newBlock);
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
      } else if (line.match(/^WHILE /i)) {
        const newBlock = new Distructure.Block();
        const condition = line.slice(6);
        add(new Distructure.While(condition, newBlock));
        push(newBlock);
      } else if (line.match(/^REPEAT$/i)) {
        const newBlock = new Distructure.Block();
        push(newBlock);
      } else if (line.match(/^UNTIL /i)) {
        const condition = line.slice(6);
        const repeatBlock = currentBlock;
        pop();
        add(new Distructure.Until(condition, repeatBlock));
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
        add(new Distructure.Function(line.slice(9)));
      } else if (line.match(/^TAG /i)) {
        add(new Distructure.Tag(line.slice(4)));
      } else if (line.match(/^RETURN$/i)) {
        add(new Distructure.Tag('R'));
      } else if (line.match(/^(BLANK|NEWLINE)$/i)) {
        add(new Distructure.EmptyLine());
      } else {
        // default use Instruction
        add(new Distructure.Instruction(line));
      }
    });
  return currentBlock;
}


function render(code) {
  const elem = parse(code);

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cw = Math.ceil(rect.width);
  const ch = Math.ceil(rect.height);
  canvas.style.width = `${cw}px`;
  canvas.style.height = `${ch}px`;
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  const ctx = canvas.getContext('2d');
  const margin = 10;
  const darkMode = true;

  //clear canvas
  if (darkMode) {
    ctx.fillStyle = "#1e1e1e";
  } else {
    ctx.fillStyle = "white";
  }
  ctx.fillRect(0, 0, cw * dpr, ch * dpr);

  ctx.scale(dpr, dpr);
  ctx.translate(margin, margin);

  if (darkMode) {
    ctx.strokeStyle = "#d4d4d4";
    ctx.fillStyle = "#d4d4d4";
  } else {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
  }

  ctx.lineWidth = 1;
  ctx.textAlign = "center";
  ctx.font = "14px Courier New";

  fontHeight = getTextHeight(ctx);

  const elemWidth = Math.ceil(elem.width(ctx) + 2 * margin);
  const elemHeight = Math.ceil(elem.height(ctx) + 2 * margin);

  if (Math.abs(elemWidth - cw) >= 2 || Math.abs(elemHeight - ch) >= 2 ) {
    // increase canvas size
    const newWidth = elemWidth;
    const newHeight = elemHeight;
    canvas.style['min-width'] = `${newWidth}px`;
    canvas.style['min-height'] = `${newHeight}px`;
    canvas.style['max-width'] = `${newWidth}px`;
    canvas.style['max-height'] = `${newHeight}px`;
    setTimeout(() => render(code));
    return;
  }

  elem.render(ctx);
}

const getTextHeight = function (ctx) {
  const font = ctx.font;
  const text = '<span style="font-family:' + font + '">Hg</span>';

  const content = document.createElement('div');
  content.innerHTML = text;

  document.body.appendChild(content);
  const height = content.clientHeight;
  document.body.removeChild(content);

  return height;
};

//})()

