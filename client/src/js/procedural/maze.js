import generateMaze from 'generate-maze-by-clustering'

global.mazeWidthMultiplier = 1;

function genMaze (width = 10, height = 10, xOff, yOff, mazeWidthMultiplier = 1) {
  let maze = generateMaze([(height/(2 * mazeWidthMultiplier)), width/(2 * mazeWidthMultiplier)])

  return maze.cells.reduce((acc, row, y) => {
    acc.push(...row.map((cell, x) => {
      if(cell.isBroken) {
        return null
      } else if(cell.position) {
        return {id: global.uniqueID() + '-maze-' + y + ',' + x, x: xOff + cell.position[0] * (GAME.grid.nodeSize * mazeWidthMultiplier), y: yOff + cell.position[1] * (GAME.grid.nodeSize * mazeWidthMultiplier), width: (GAME.grid.nodeSize * mazeWidthMultiplier), height: (GAME.grid.nodeSize * mazeWidthMultiplier)}
      }
    }).filter((cell) => !!cell))
    return acc
  }, [])
}

export {
  genMaze,
}
