const audioFolder = './client/public/audio/moving';
const fs = require('fs');


const audioJSON = {
  id: 'moving'
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
      id: 'assets/audio/moving/'+folder.name+'/'+file.name,
      assetURL: 'assets/audio/moving/'+folder.name+'/'+file.name,
      tags: []
    })
  })
});

fs.writeFile('data/audio/moving.json', JSON.stringify(audioJSON), 'utf8', (e) => {
  if(e) return console.log(e)
  else console.log('audio JSON - data/audio/moving.json - saved')
});
