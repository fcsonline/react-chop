import React, { Component } from 'react';
import './App.css';
import ChopList from './ChopList';

const size = 30;
const list = [...Array(size).keys()];
const images = [
  'https://upload.wikimedia.org/wikipedia/commons/9/9f/Arcade_machine_icon.png',
  'http://vignette2.wikia.nocookie.net/mariokart/images/9/91/MK8_Yoshi_Icon.png',
  'http://4.bp.blogspot.com/-QCsT_UnLHFM/VidICHb1MdI/AAAAAAAAAMo/RNog69J7kzM/s1600/gnome-games.png',
  'http://png-5.findicons.com/files/icons/2297/super_mario/256/mushroom_1up.png'
]

function rowRendererTextAreas({ key, index, style}) {
  return (
      <div key={key} className='Item'>
        <textarea defaultValue={list[index]}/>
      </div>
  )
}

function rowRendererImages ({ key, index, style}) {
  const icon = index % 7 === 3;

  return (
      <div key={key} className='Item'>
        {list[index]}

        {icon && (
          <img src={images[index % images.length]} role='presentation' style={ {maxWidth: 150} } />
        )}
      </div>
  )
}

function rowRendererDifferent ({ key, index, style}) {
  const className = index % 10 === 9 ? 'BigItem' : 'Item';

  return (
      <div key={key} className={className}>
        {list[index]}
      </div>
  )
}

function rowRenderer ({ key, index, style}) {
  return (
      <div key={key} className='Item'>
        {list[index]}
      </div>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Same heights</h1>
        <ChopList
          rowCount={list.length}
          rowRenderer={rowRenderer}
        />

        {
        /*
        <h1>Different heights</h1>
        <ChopList
          rowCount={list.length}
          rowRenderer={rowRendererDifferent}
        />

        <h1>Dynamic content</h1>
        <ChopList
          rowCount={list.length}
          rowRenderer={rowRendererImages}
        />

        <h1>Dynamic heights</h1>
        <ChopList
          rowCount={list.length}
          rowRenderer={rowRendererTextAreas}
        />
        */
        }

      </div>
    );
  }
}

export default App;
