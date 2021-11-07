/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import FormStack from '../Form/FormStack';
import Table from '../Table/Table';

const MODE_LIST = 'LIST';
const MODE_CREATE = 'CREATE';
const MODE_UPDATE = 'UPDATE';

const CRUD = ({ entity, url, entities }) => {
  const [mode, setMode] = useState(MODE_LIST);
  const [idForUpdate, setIdForUpdate] = useState(null);

  const requestUpdate = (id) => {
    setIdForUpdate(id);
    setMode(MODE_UPDATE);
  };

  return (
    <>
      {mode === MODE_LIST && (
        <Table
          displayEntity={entity}
          key={entity.name}
          url={url}
          entities={entities}
          onCreateRequested={() => setMode(MODE_CREATE)}
          onUpdateRequested={(id) => requestUpdate(id)}
        />
      )}
      {mode === MODE_CREATE && (
        <FormStack
          displayEntity={entity}
          key={entity.name}
          url={url}
          onSuccess={() => setMode(MODE_LIST)}
        />
      )}
      {mode === MODE_UPDATE && (
        <FormStack
          displayEntity={entity}
          key={entity.name}
          url={url}
          mode={MODE_UPDATE}
          id={idForUpdate}
          onSuccess={() => setMode(MODE_LIST)}
        />
      )}
    </>
  );
};

export default CRUD;
