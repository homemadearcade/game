const audioFolder = './client/public/audio/retro';
const fs = require('fs');


const audioJSON = {
  id: 'retro'
}

const folders = fs.readdirSync(audioFolder, { withFileTypes: true }).filter(dirent => dirent.isDirectory())
folders.forEach(folder => {

  audioJSON[folder.name] = {
    name: folder.name,
    diskLocation: audioFolder + '/'+folder.name,
    files: [],
    tags: [],
  }
  const fileDirectory = audioFolder + '/'+folder.name
  const files = fs.readdirSync(fileDirectory, { withFileTypes: true })

  files.forEach(file => {
    if(file.name === '.DS_Store') return

    audioJSON[folder.name].files.push({
      folder: folder.name,
      name: file.name,
      id: 'assets/audio/retro/'+folder.name+'/'+file.name,
      assetURL: 'assets/audio/retro/'+folder.name+'/'+file.name,
      tags: []
    })
  })
});

fs.writeFile('data/audio/retro.json', JSON.stringify(audioJSON), 'utf8', (e) => {
  if(e) return console.log(e)
  else console.log('audio JSON - data/audio/retro.json - saved')
});
