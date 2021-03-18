import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { EventContext, Styled } from 'direflow-component';
import { requestEntities }  from './utils';
import styles from './App.css';

const EntitiesContext = React.createContext();

const App = (props) => {
  const [entities, setEntities] = useState();
  useEffect(() => {
    requestEntities(props.url).then(entities => {
      if (entities) {
        setEntities(entities);
      }
    });
  }, [props.url]);

  const dispatch = useContext(EventContext);

  const handleClick = () => {
    const event = new Event('my-event');
    dispatch(event);
  };

  const renderSampleList = props.sampleList.map((sample) => (
    <div key={sample} className='sample-text'>
      → {sample}
    </div>
  ));

  return (
    <EntitiesContext.Provider value={entities}>
      <Styled styles={styles}>
        <div className='app'>
          <div className='top'>
            <div className='header-image' />
          </div>
          <div className='bottom'>
            <div className='header-title'>{props.componentTitle}</div>
            <div>{renderSampleList}</div>
            <button className='button' onClick={handleClick}>
              Click me!
            </button>
          </div>
        </div>
      </Styled>
    </EntitiesContext.Provider>
  );
};

App.defaultProps = {
  url: '',
  componentTitle: 'Simfinity Web',
  sampleList: [
    'Create with React',
    'Build as Web Component',
    'Use it anywhere!',
  ],
}

App.propTypes = {
  url: PropTypes.string,
  componentTitle: PropTypes.string,
  sampleList: PropTypes.array,
};

export default App;
