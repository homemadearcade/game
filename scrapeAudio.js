const audioFolder = './client/public/audio/retro';
const fs = require('fs');


const audioJSON = {}

const folders = fs.readdirSync(audioFolder, { withFileTypes: true }).filter(dirent => dirent.isDirectory())
folders.forEach(folder => {

  audioJSON[folder.name] = {
    name: folder.name,
    diskLocation: audioFolder + '/'+folder.name,
    files: []
  }
  const fileDirectory = audioFolder + '/'+folder.name
  const files = fs.readdirSync(fileDirectory, { withFileTypes: true })

  files.forEach(file => {

    audioJSON[folder.name].files.push({
      folder: folder.name,
      name: file.name,
      id: folder.name+'/'+file.name,
      assetURL: 'assets/audio/retro/'+folder.name+'/'+file.name
    })
  })
});

fs.writeFile('data/audio/retro.json', JSON.stringify(audioJSON), 'utf8', (e) => {
  if(e) return console.log(e)
  else console.log('audio JSON - data/audio/retro.json - saved')
});
