import React from 'react'
import Select from 'react-select'
import classnames from 'classnames'

function NextSelect({sequenceItem, nextOptions, nextValue, onChange, title, isTrigger}) {
  if(isTrigger) return null

  const selectedNext = nextOptions.filter((option) => {
    if(option.value === nextValue) return true
  })[0]

  return <div className="SequenceItem__next">{title || 'Next:'}<Select
    value={selectedNext}
    onChange={onChange}
    options={nextOptions}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/></div>
}

function SingleEventSelect({sequenceItem, valueProp, onChange, title}) {
  return <div className="SequenceItem__test">{title || 'Event: '}<Select
    value={{ value: sequenceItem[valueProp], label: sequenceItem[valueProp]}}
    onChange={onChange}
    options={Object.keys(global.triggerEvents).map(eventName => { return { value: eventName, label: eventName}})}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/>
  </div>
}

function MultiThemeEventSelect({currentValue, onChange, title}) {
  return <div className="ManagerInput__select">{title || 'Theme Event:'}<Select
    value={{ value: currentValue, label: currentValue}}
    onChange={onChange}
    options={Object.keys(global.triggerEvents).map(eventName => { return { value: eventName, label: eventName}})}
    styles={global.reactSelectStyle}
    isMulti
    theme={global.reactSelectTheme}/>
  </div>
}

function MultiTagSelect({sequenceItem, valueProp, onChange, title}) {
  return <div className="SequenceItem__test">{title || 'Test Tags:'}<Select
    value={sequenceItem[valueProp] && sequenceItem[valueProp].map((tags) => { return { value: tags, label: tags} })}
    onChange={onChange}
    options={Object.keys(global.allTags).map(tag => { return { value: tag, label: tag}})}
    styles={global.reactSelectStyle}
    isMulti
    theme={global.reactSelectTheme}/>
  </div>
}

function SpriteSheetTagsSelect({currentValue, onChange, title}) {
  return <div className="ManagerInput__select">{title || 'Tags:'}<Select
    value={currentValue && currentValue.map((tags) => { return { value: tags, label: tags} })}
    onChange={onChange}
    options={Object.keys(global.spriteSheetTags).map(tag => { return { value: tag, label: tag}})}
    styles={global.reactSelectStyle}
    isMulti
    theme={global.reactSelectTheme}/>
  </div>
}

function MultiIdSelect({sequenceItem, valueProp, onChange, title}) {
  return <div className="SequenceItem__test">{title || 'Test Ids:'}<Select
    value={sequenceItem[valueProp] && sequenceItem[valueProp].map((id) => { return {value: id, label: id} })}
    onChange={onChange}
    options={GAME.objects.map(({id}) => { return {value: id, label: id} }).concat(GAME.heroList.map(({id}) => { return { value: id, label: id} }))}
    styles={global.reactSelectStyle}
    isMulti
    theme={global.reactSelectTheme}/>
  </div>
}


function SpriteSheetAuthorSelect({currentValue, onChange, title}) {
  return <div className="ManagerInput__select">{title || 'Author:'}<Select
    value={{ value: currentValue, label: currentValue}}
    onChange={onChange}
    options={Object.keys(global.spriteSheetAuthors).map(author => { return { value: author, label: author}})}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/>
  </div>
}

function SingleIdSelect({sequenceItem, valueProp, onChange, title, isTrigger}) {
  const options = [{value: 'default', label: 'default'}, {value: 'mainObject', label: 'mainObject'}, {value: 'guestObject', label: 'guestObject'}, ...GAME.objects.map(({id}) => { return {value: id, label: id} }).concat(GAME.heroList.map(({id}) => { return { value: id, label: id} }))]
  if(isTrigger) {
    options.unshift({value: 'ownerObject', label: 'ownerObject'})
  }

  return <div className="SequenceItem__test">{title || 'Test Ids:'}<Select
    value={{value: sequenceItem[valueProp], label: sequenceItem[valueProp]}}
    onChange={onChange}
    options={options}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/>
  </div>
}

function SingleTagSelect({sequenceItem, valueProp, onChange, title}) {
  return <div className="SequenceItem__test">{title || 'Test Tags:'}<Select
    value={{ value: sequenceItem[valueProp], label: sequenceItem[valueProp]}}
    onChange={onChange}
    options={Object.keys(global.allTags).map(tag => { return { value: tag, label: tag}})}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/>
  </div>
}

function SingleLibraryObjectSelect({sequenceItem, valueProp, onChange, title}) {
  return <div className="SequenceItem__test">{title || 'Library Object Name:'}<Select
    value={{ value: sequenceItem[valueProp], label: sequenceItem[valueProp]}}
    onChange={onChange}
    options={Object.keys(global.objectLibrary.addGameLibrary()).map(objectName => { return { value: objectName, label: objectName }})}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/>
  </div>
}

function SingleLibraryModSelect({sequenceItem, valueProp, onChange, title}) {
  return <div className="SequenceItem__test">{title || 'Mod Object Name:'}<Select
    value={{ value: sequenceItem[valueProp], label: sequenceItem[valueProp]}}
    onChange={onChange}
    options={Object.keys(global.modLibrary).map(objectName => { return { value: objectName, label: objectName }})}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/>
  </div>
}

function SingleLibrarySubObjectSelect({sequenceItem, valueProp, onChange, title}) {
  return <div className="SequenceItem__test">{title || 'Sub Object Name:'}<Select
    value={{ value: sequenceItem[valueProp], label: sequenceItem[valueProp]}}
    onChange={onChange}
    options={Object.keys(global.subObjectLibrary.addGameLibrary()).map(objectName => { return { value: objectName, label: objectName }})}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/>
  </div>
}

function SingleLibraryBranchSelect({sequenceItem, valueProp, onChange, title}) {
  return <div className="SequenceItem__test">{title || 'Branch Name:'}<Select
    value={{ value: sequenceItem[valueProp], label: sequenceItem[valueProp]}}
    onChange={onChange}
    options={Object.keys(GAME.library.branches).map(objectName => { return { value: objectName, label: objectName }})}
    styles={global.reactSelectStyle}
    theme={global.reactSelectTheme}/>
  </div>
}

export {
  SingleEventSelect,
  MultiThemeEventSelect,
  SingleTagSelect,
  SingleIdSelect,
  SingleLibrarySubObjectSelect,
  SingleLibraryObjectSelect,
  SingleLibraryBranchSelect,
  SingleLibraryModSelect,
  MultiIdSelect,
  MultiTagSelect,
  SpriteSheetTagsSelect,
  SpriteSheetAuthorSelect,
  NextSelect,
}
