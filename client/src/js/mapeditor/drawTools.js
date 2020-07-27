function drawConstructParts(ctx, camera, object) {
  object.constructParts.forEach((part) => {
    drawObject(ctx, {...part, tags: object.tags }, camera)
  })

  // this punches out outlines inside of object
  if(object.tags.outline) {
    ctx.globalCompositeOperation='destination-out';
    object.constructParts.forEach((part) => {
      drawObject(ctx, part, camera)
    })
    ctx.globalCompositeOperation='source-over';
  }
}

function drawGrid(ctx, {startX, startY, gridWidth, gridHeight, nodeSize, normalLineWidth = .25, specialLineWidth = .6, color = 'white'}, camera) {
  let height = nodeSize * gridHeight
  let width = nodeSize * gridWidth

  ctx.strokeStyle = "#999";
  if(color) {
    ctx.strokeStyle = color;
  }
  for(var x = 0; x <= gridWidth; x++) {
    ctx.lineWidth = normalLineWidth
    if(x % 10 === 0) {
      ctx.lineWidth = specialLineWidth
    }
    drawVertice(ctx, {a: {
      x: startX + (x * nodeSize),
      y: startY,
      color
    },
    b: {
      x: startX + (x * nodeSize),
      y: startY + height,
      color
    }}, camera)
  }
  for(var y = 0; y <= gridHeight; y++) {
    ctx.lineWidth = normalLineWidth
    if(y % 10 === 0) {
      ctx.lineWidth = specialLineWidth
    }
    drawVertice(ctx, {a: {
      x: startX,
      y: startY + (y * nodeSize),
      color
    },
    b: {
      x: startX + width,
      y: startY + (y * nodeSize),
      color
    }}, camera)
  }

  ctx.lineWidth = 1
}

function getObjectVertices(ctx, object, camera, options = {}) {
  let prev = []
  if(object.removed) return prev

  const extraProps = {}

  if(object.tags && object.tags && object.tags && object.tags.glowing) {
    extraProps.glow = 3
    extraProps.thickness = 2
    extraProps.color = 'white'
  }

  if(options.thickness) {
    extraProps.thickness = options.thickness
  }

  if(object.color) extraProps.color = object.color
  prev.push({a:{x:object.x,y:object.y}, b:{x:object.x + object.width,y:object.y}, ...extraProps})
  prev.push({a:{x:object.x + object.width,y:object.y}, b:{x:object.x + object.width,y:object.y + object.height}, ...extraProps})
  prev.push({a:{x:object.x + object.width,y:object.y + object.height}, b:{x:object.x,y:object.y + object.height}, ...extraProps})
  prev.push({a:{x:object.x,y:object.y + object.height}, b:{x:object.x,y:object.y}, ...extraProps})
  return prev
}

function drawFilledObject(ctx, object, camera, options = {}) {
  if(options.strokeRect) {
    if(object.color) ctx.strokeStyle = object.color
    else if(GAME.world.defaultObjectColor) {
      ctx.strokeStyle = GAME.world.defaultObjectColor
    }
    else ctx.strokeStyle = window.defaultObjectColor

    ctx.strokeRect((object.x * camera.multiplier) - camera.x, (object.y * camera.multiplier) - camera.y, (object.width * camera.multiplier), (object.height * camera.multiplier));
  } else {
    if(object.color) ctx.fillStyle = object.color
    else if(GAME.world.defaultObjectColor) {
      ctx.fillStyle = GAME.world.defaultObjectColor
    }
    else ctx.fillStyle = window.defaultObjectColor

    ctx.fillRect((object.x * camera.multiplier) - camera.x, (object.y * camera.multiplier) - camera.y, (object.width * camera.multiplier), (object.height * camera.multiplier));
  }
}


function drawVertice(ctx, vertice, camera) {
  if(vertice.glow) {
    ctx.filter = "drop-shadow(4px 4px 8px #fff)";
  }

  if(vertice.color) ctx.strokeStyle = vertice.color
  else if(GAME.world.defaultObjectColor) ctx.strokeStyle = GAME.world.defaultObjectColor
  else ctx.strokeStyle = window.defaultObjectColor

  if(vertice.thickness) {
    ctx.lineWidth = vertice.thickness
  }

  ctx.beginPath();
  ctx.moveTo( (vertice.a.x * camera.multiplier - camera.x), (vertice.a.y * camera.multiplier - camera.y));
  ctx.lineTo( (vertice.b.x * camera.multiplier - camera.x), (vertice.b.y * camera.multiplier - camera.y));
  ctx.stroke();

  if(vertice.glow) {
    ctx.filter = "none";
    drawVertice(ctx, {...vertice, glow: false}, camera)
  }
  if(vertice.color) {
    ctx.strokeStyle = window.defaultObjectColor;
  }
  if(vertice.thickness) {
    ctx.lineWidth = 1
  }
}

function drawBorder(ctx, object, camera, options = { thickness: 1 }) {
  getObjectVertices(ctx, object, camera, options).forEach((vertice) => {
    drawVertice(ctx, vertice, camera)
  })
}

function drawObject(ctx, object, camera, options = {showInvisible: false, strokeRect: false }) {
  ctx.save()
  if(object.tags && object.tags.rotateable) {
    ctx.beginPath();
    ctx.translate((object.x * camera.multiplier) - camera.x + ((object.width/2) * camera.multiplier), (object.y * camera.multiplier) - camera.y + ((object.height/2) * camera.multiplier));
    ctx.rotate(object.angle);
    object = {...object, x: -(object.width/2), y: -(object.height/2)}
    camera = {...camera, x: 0, y: 0}
  }


  if(object.tags && object.tags.invisible) {
   if(options.showInvisible) {
     ctx.globalAlpha = 0.2;
     drawFilledObject(ctx, object, camera, options);
   }
 } else if(!object.tags || (object.tags && !object.tags.outline)) {
    drawFilledObject(ctx, object, camera, options);
  } else {
    drawFilledObject(ctx, object, camera, {...options, strokeRect: true});
  }

  ctx.restore()
}

function drawLine(ctx, pointA, pointB, options, camera) {
  if(options.color) ctx.strokeStyle = options.color

  if(options.thickness) {
    ctx.lineWidth = options.thickness
  }

  ctx.beginPath();
  ctx.moveTo( (pointA.x * camera.multiplier - camera.x), (pointA.y * camera.multiplier - camera.y));
  ctx.lineTo( (pointB.x * camera.multiplier - camera.x), (pointB.y * camera.multiplier - camera.y));
  ctx.stroke();

  if(options.color) {
    ctx.strokeStyle = window.defaultObject.color;
  }
  if(options.thickness) {
    ctx.lineWidth = 1
  }
}

export default {
  drawConstructParts,
  getObjectVertices,
  drawObject,
  drawLine,
  drawVertice,
  drawBorder,
  drawFilledObject,
  drawGrid,
}
