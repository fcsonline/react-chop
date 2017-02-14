import React, { Component } from 'react';
import './App.css';
import ChopList from './ChopList';

const size = 100;
const list = [...Array(size).keys()];
const images = [
  'https://upload.wikimedia.org/wikipedia/commons/9/9f/Arcade_machine_icon.png',
  'http://vignette2.wikia.nocookie.net/mariokart/images/9/91/MK8_Yoshi_Icon.png',
  'http://4.bp.blogspot.com/-QCsT_UnLHFM/VidICHb1MdI/AAAAAAAAAMo/RNog69J7kzM/s1600/gnome-games.png',
  'http://icons.iconarchive.com/icons/ph03nyx/super-mario/256/Retro-Mushroom-Super-icon.png'
]

function rowRendererImages ({ key, index, style}) {
  const className = index % 10 === 9 ? 'BigItem' : 'Item';
  const icon = index % 7 === 3;

  return (
      <div
        key={key}
        className={className}
      >
        {list[index]}

        {icon && (
          <img src={images[index % images.length]} role='presentation' style={ {maxWidth: 150} } />
        )}
      </div>
  )
}

function rowRenderer ({ key, index, style}) {
  return (
      <div
        key={key}
        className='Item'
      >
        {list[index]}
      </div>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Dynamic height</h1>
        <ChopList
          rowCount={list.length}
          rowRenderer={rowRendererImages}
        />

        <h1>Static height</h1>
        <ChopList
          rowCount={list.length}
          rowRenderer={rowRenderer}
        />
      </div>
    );
  }
}

export default App;
