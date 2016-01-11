//(function(){
  "use strict"

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var cw = canvas.width;
  var ch = canvas.height;
  var fontHeight = 0;

  var Distructure = window.Distructure = {};

  Distructure.If= function(condition, ifBlock, elseBlock) {
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
    render: function(){

      var w = this.width();
      var h = this.height();
      var r = this.ROOF_HEIGHT;
      var w2 = w/2;
      var sep = this.SEP;
      var l = this.left.width() + 2*sep;


      ctx.moveTo(0, r);
      ctx.lineTo(w2, 0);
      ctx.lineTo(w, r);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.lineTo(0, r);
      ctx.lineTo(w, r);

      ctx.moveTo(l, h);
      ctx.lineTo(l, r);

      if(!this.right) {
        //empty else
        ctx.lineTo(w, h);
      }

      ctx.textBaseline = 'bottom';
      ctx.fillText(this.text, w2, r - this.BASE_LINE);

      ctx.stroke();

      ctx.save();
      ctx.translate(sep, r+sep);
      this.left.render();
      ctx.restore();

      if(this.right) {
        ctx.save();
        ctx.translate(l+sep, r+sep);
        this.right.render();
        ctx.restore();
      }

    },
    width: function() {
      if(this._width) return this._width;

      var l = this.left.width() + 2*this.SEP;
      var r = this.right ? this.right.width() + 2*this.SEP : this.NO_ELSE_WIDTH;

      return this._width = l + r;
    },
    height: function() {
      if(this._height) return this._height;

      var l = this.left.height();
      var r = this.right ? this.right.height() : 0;

      return this._height = Math.max(l, r) + this.ROOF_HEIGHT + 2*this.SEP;
    }
  }

  Distructure.Case = function(condition, block) {
    this.text = condition;
    this.block = block;
  }

  Distructure.Switch= function(condition, cases, defaultBlock) {
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
    render: function(){

      var w = this.width();
      var h = this.height();
      var r = this.ROOF_HEIGHT;
      var ch = this.CONDITION_HEIGHT;
      var w2 = w/2;
      var sep = this.SEP;

      ctx.moveTo(0, r);
      ctx.lineTo(w2, 0);
      ctx.lineTo(w, r);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.lineTo(0, r);
      ctx.lineTo(w, r);

      ctx.textBaseline = 'bottom';
      ctx.fillText(this.text, w/2, r - this.BASE_LINE);
      
      var x = 0;
      for (var i = 0; i < this.cases.length; i++) {
        var c = this.cases[i];
        var dx = c.block.width() + 2*sep
        ctx.moveTo(x, r + ch);
        ctx.lineTo(x + dx, r + ch);
        ctx.lineTo(x + dx, r);
        ctx.lineTo(x + dx, h);

        ctx.textBaseline = 'middle';
        ctx.fillText(c.text, x + dx/2, r + ch/2);

        x += dx;
      };


      if(!this.defaultBlock) {
        //empty default
        ctx.moveTo(x, r);
        ctx.lineTo(w, h);
      }

      ctx.stroke();

      x = 0;
      for (var i = 0; i < this.cases.length; i++) {
        var c = this.cases[i];
        var dx = c.block.width() + 2*sep

        ctx.save();
        ctx.translate(x + sep, r + ch + sep);
        c.block.render();
        ctx.restore();

        x += dx;
      };

      if(this.defaultBlock) {
        ctx.save();
        ctx.translate(x + sep, r + sep);
        this.defaultBlock.render();
        ctx.restore();
      }

    },
    width: function() {
      if(this._width) return this._width;

      var w = 0;
      for (var i = this.cases.length - 1; i >= 0; i--) {
        w+=this.cases[i].block.width() + 2*this.SEP;
      };
      
      w += this.defaultBlock ? this.defaultBlock.width() + 2*this.SEP : this.NO_DEFAULT_WIDTH;

      return this._width = w;
    },
    height: function() {
      if(this._height) return this._height;

      var h = this.defaultBlock ? this.defaultBlock.height() : 0;
      
      for (var i = this.cases.length - 1; i >= 0; i--) {
        h = Math.max(this.cases[i].block.height(), h);
      };

      if(this.cases.length) {
        h += this.CONDITION_HEIGHT;
      }

      return this._height = h + this.ROOF_HEIGHT + 2*this.SEP;
    }
  }

  Distructure.For= function(condition, block) {
    this.block = block;
    this.text = condition;
    this.ROOF_HEIGHT = 30;
    this.SEP = 20;
  }

  Distructure.For.prototype = {
    className: "For",
    render: function(){

      var w = this.width();
      var h = this.height();
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
      ctx.fillText(this.text, w/2, r/2);

      ctx.stroke();

      ctx.save();
      ctx.translate(sep, r+sep);
      this.block.render();
      ctx.restore();
    },
    width: function() {
      if(this._width) return this._width;

      return this._width = this.block.width() + 2*this.SEP;
    },
    height: function() {
      if(this._height) return this._height;

      return this._height = this.block.height() + this.ROOF_HEIGHT + 2*this.SEP;
    }
  }

  Distructure.While = Distructure.For;
  Distructure.While.prototype = Distructure.For.prototype;

  Distructure.Until= function(condition, block) {
    this.block = block;
    this.text = condition;
    this.ROOF_HEIGHT = 30;
    this.SEP = 20;
  }

  Distructure.Until.prototype = {
    className: "Until",
    render: function(){

      var w = this.width();
      var h = this.height();
      var r = this.ROOF_HEIGHT;
      var sep = this.SEP;

      ctx.moveTo(w, h-r);
      ctx.lineTo(0, h-r);
      ctx.lineTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.lineTo(0, h-r);

      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, w/2, h - r/2);

      ctx.stroke();

      ctx.save();
      ctx.translate(sep, sep);
      this.block.render();
      ctx.restore();
    },
    width: function() {
      if(this._width) return this._width;

      return this._width = this.block.width() + 2*this.SEP;
    },
    height: function() {
      if(this._height) return this._height;

      return this._height = this.block.height() + this.ROOF_HEIGHT + 2*this.SEP;
    }
  }

  Distructure.Tag = function(text) {
    this.text = text;
    this.SEP = 14;
  }

  Distructure.Tag.prototype = {
    className: "Tag",
    render: function() {

      var w = this.width();
      var h = this.height();

      ctx.beginPath();
      ctx.arc(w/2, h/2, w/2 - 2, 0, 2*Math.PI);

      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, w/2, h/2); 

      ctx.stroke();
    },
    width: function() {
      if(this._width) return this._width;
      return this._width = Math.max(ctx.measureText(this.text).width, fontHeight) + 2*this.SEP | 0;
    },
    height: function() {
      if(this._height) return this._height;

      return this._height = this.width();
    }
  }

  Distructure.Main = function(block) {
    this.block = new Distructure.Block([
      new Distructure.Tag('B'),
      block,
      new Distructure.Tag('E')
    ]);
  }

  Distructure.Main.prototype = {
    className: "Main",
    render: function() {
      this.block.render();
    },
    width: function() {
      return this.block.width();
    },
    height: function() {
      return this.block.height();
    }
  }

  Distructure.Instruction = function(instruction) {
    this.text = instruction;
    this.SEP = 5;
  }

  Distructure.Instruction.prototype = {
    className: "Instruction",
    render: function() {

      var w = this.width();
      var h = this.height();

      ctx.strokeRect(0, 0, w, h)

      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, w/2, h/2); 

      ctx.stroke();
    },
    width: function() {
      if(this._width) return this._width;
      return this._width = ctx.measureText(this.text).width + 2*this.SEP;
    },
    height: function() {
      if(this._height) return this._height;

      return this._height = fontHeight + 2*this.SEP;
    }
  }

  Distructure.Function = function(instruction) {
    this.text = instruction;
    this.SEP = 5;
    this.FSEP = 5;
  }

  Distructure.Function.prototype = {
    className: "Function",
    render: function() {

      var w = this.width();
      var h = this.height();
      var f = this.FSEP;

      ctx.strokeRect(0, 0, w, h)
      ctx.moveTo(f,0);
      ctx.lineTo(f,h);
      ctx.moveTo(w-f,0);
      ctx.lineTo(w-f,h);

      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, w/2, h/2); 

      ctx.stroke();
    },
    width: function() {
      if(this._width) return this._width;
      return this._width = ctx.measureText(this.text).width + 2*this.SEP + 2*this.FSEP;
    },
    height: function() {
      if(this._height) return this._height;

      return this._height = fontHeight + 2*this.SEP;
    }
  }

  Distructure.Cin = function(instruction) {
    this.text = instruction;
    this.SEP = 5;
    this.FSEP = 5;
  }

  Distructure.Cin.prototype = {
    className: "Cin",
    render: function() {

      var w = this.width();
      var h = this.height();
      var f = this.FSEP;

      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w-f, h);
      ctx.lineTo(f, h);
      ctx.lineTo(0, 0);

      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, w/2, h/2); 

      ctx.stroke();
    },
    width: function() {
      if(this._width) return this._width;
      return this._width = ctx.measureText(this.text).width + 2*this.SEP + 2*this.FSEP;
    },
    height: function() {
      if(this._height) return this._height;

      return this._height = fontHeight + 2*this.SEP;
    }
  }

  Distructure.Cout = function(instruction) {
    this.text = instruction;
    this.SEP = 5;
    this.FSEP = 5;
  }

  Distructure.Cout.prototype = {
    className: "Cout",
    render: function() {

      var w = this.width();
      var h = this.height();
      var f = this.FSEP;

      ctx.moveTo(f, 0);
      ctx.lineTo(w-f, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.lineTo(f, 0);

      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, w/2, h/2); 

      ctx.stroke();
    },
    width: function() {
      if(this._width) return this._width;
      return this._width = ctx.measureText(this.text).width + 2*this.SEP + 2*this.FSEP;
    },
    height: function() {
      if(this._height) return this._height;

      return this._height = fontHeight + 2*this.SEP;
    }
  }

  Distructure.Block = function(children) {
    this.children = children || [];
  }

  Distructure.Block.prototype = {
    className: "Block",
    render: function() {

      var w = this.width();
      var h = this.height();

      var y = 0, dy = 0;
      var x = 0;

      for(var i = 0; i < this.children.length; i++) {
        var c = this.children[i];
        var cw = c.width();
        var ch = c.height();
        var dx = (w - cw)/2 - x;

        ctx.translate(dx, dy);

        c.render();

        dy = ch;
        x += dx;
        y += dy;

      }

    },
    makeSameSize: function(){
      var sameSizeClass= {'Instruction': true, 'Function': true, 'Cout': true, 'Cin': true};
      var w = 0;
      var last = this.children.length - 1;
      var j = -1;
      var j1 = -1;
      for(var i = 0; i <= last; ++i) {
        var c = this.children[i];
        var s = sameSizeClass[c.className];
        if(s) {
          w = Math.max(c.width(), w);
          j1=i;
          if(j==-1) j = i;
        }

        if(j!=-1 && (!s || i == last)) {

          for(; j<=j1; j++) {
            this.children[j]._width = w;
          }
          j=-1;
          w=0;
        }
      }
    },
    width: function() {
      if(this._width) return this._width;

      var w = 0;
      for(var i = 0; i < this.children.length; ++i) {
        w = Math.max(this.children[i].width(), w);
      }

      this.makeSameSize();

      return this._width = w; 
    },
    height: function() {
      if(this._height) return this._height;

      var h = 0;
      for(var i = 0; i < this.children.length; ++i) {
        h += this.children[i].height();
      }

      return this._height = h;
    }
  }


  function render() {
    //clear canvas
    ctx.fillStyle="white";
    ctx.fillRect(0,0,cw,ch);

    var b = new Distructure.Block([
      new Distructure.Instruction("console.log('sarasa')"),
      new Distructure.Tag("B"),
      new Distructure.Instruction("x=2"),
      new Distructure.Instruction("y=1"),
    ]);
    var b2 = new Distructure.Block([
      new Distructure.Instruction("alalall"),
      new Distructure.Function("jajwioqioqoiq"),
      new Distructure.Cin("x2"),
      new Distructure.Cout("y"),
      new Distructure.For('i <-- 1 to 10', new Distructure.Block([
        new Distructure.Function('aajja(a, x)')
      ])),
      new Distructure.Until('i <-- 1 to 10', new Distructure.Block([
        new Distructure.Function('aajja(a, x)')
      ])),
      new Distructure.Switch('type',[
        new Distructure.Case('Integer', new Distructure.Block([
          new Distructure.Function('parseInt(x)')
        ])),
        new Distructure.Case('Float', new Distructure.Block([
          new Distructure.Function('parseFloat(x)')
        ])),
        new Distructure.Case('String', new Distructure.Block([
          new Distructure.Instruction('console.log(x)')
        ]))
      ])      
    ]);
    var elem = new Distructure.Main( new Distructure.Block([
      new Distructure.If('x < 10', b, b2)
    ]));

    //if
    ctx.strokeStyle="1px black";
    ctx.fillStyle="black";
    ctx.textAlign="center";
    ctx.font = "30px arial";

    fontHeight = getTextHeight();

    elem.render();

  }


  var getTextHeight = function() {
    var font = ctx.font;
    var text = '<span style="font-family:'+font+'">Hg</span>';

    var content = document.createElement('div');
    content.innerHTML = text;

    document.body.appendChild(content);
    var height = content.clientHeight; 
    document.body.removeChild(content);

    return height;
  };

  render();
  

//})()

