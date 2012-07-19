/*
 * Copyright (c) 2012 Yamitzky, http://yamitzky.com/
 * The MIT License
 *
 * Derived From jquery.qrcode.js
 * Copyright (c) 2011 Jerome Etienne, http://jetienne.com
 * The MIT License
 */
HTMLElement.__proto__.qrcode = function(options) {
  // if options is string, 
  if( typeof options === 'string' ){
    options	= { text: options };
  }

  // set default values
  // typeNumber < 1 for automatic calculation
  options = options || {};
  var default_options = {
    render		: "canvas",
    width		: 256,
    height		: 256,
    typeNumber	: -1,
    correctLevel	: QRErrorCorrectLevel.H,
    background      : "#ffffff",
    foreground      : "#000000"
  };
  for (var key in default_options){
    if(!options[key]){
      options[key] = default_options[key]
    }
  }

  var createCanvas	= function(){
    // create the qrcode itself
    var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
    qrcode.addData(options.text);
    qrcode.make();

    // create canvas element
    var canvas	= document.createElement('canvas');
    canvas.width	= options.width;
    canvas.height	= options.height;
    var ctx		= canvas.getContext('2d');

    // compute tileW/tileH based on options.width/options.height
    var tileW	= options.width  / qrcode.getModuleCount();
    var tileH	= options.height / qrcode.getModuleCount();

    // draw in the canvas
    for( var row = 0; row < qrcode.getModuleCount(); row++ ){
      for( var col = 0; col < qrcode.getModuleCount(); col++ ){
        ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
        var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
        var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
        ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);  
      }	
    }
    // return just built canvas
    return canvas;
  }

  // from Jon-Carlos Rivera (https://github.com/imbcmdth)
  var createTable	= function(){
    // create the qrcode itself
    var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
    qrcode.addData(options.text);
    qrcode.make();
    
    // create table element
    var table = document.createElement('table');
    table.style.width = options.width+"px";
    table.style.height = options.height+"px";
    table.style.border = "0px";
    table.style.borderCollapse = "collapse";
    table.style.backgroundColor = options.background;
    
    // compute tileS percentage
    var tileW	= options.width / qrcode.getModuleCount();
    var tileH	= options.height / qrcode.getModuleCount();

    // draw in the table
    for(var row = 0; row < qrcode.getModuleCount(); row++ ){
      var _row = document.createElement('tr');
      _row.style.height = tileH + "px";
      table.appendChild(_row);
      
      for(var col = 0; col < qrcode.getModuleCount(); col++ ){
        var td = document.createElement('td');
        td.style.width = tileW+"px";
        td.style.backgroundColor = qrcode.isDark(row, col) ? options.foreground : options.background
        _row.appendChild(td);
      }	
    }
    // return just built canvas
    return table;
  }

  var element	= options.render == "canvas" ? createCanvas() : createTable();
  return this.appendChild(element);
};
