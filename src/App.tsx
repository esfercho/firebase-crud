import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState, AppDispatch } from './redux/store';
import { fetchData, addItem, updateItem, deleteItem } from './redux/dataSlice';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Firebase CRUD App</h1>
        <DataList />
        <DataForm />
      </div>
    </Provider>
  );
}

const DataList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.data.items);
  const loading = useSelector((state: RootState) => state.data.loading);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteItem(id));
  };

  const handleUpdate = (id: string, name: string, description: string) => {
    dispatch(updateItem({ id, name, description }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Data List</h2>
      <ul>
        {items.map(item => (
          <EditableItem
            key={item.id}
            item={item}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

interface EditableItemProps {
  item: { id: string; name: string; description: string };
  onUpdate: (id: string, name: string, description: string) => void;
  onDelete: (id: string) => void;
}

const EditableItem: React.FC<EditableItemProps> = ({ item, onUpdate, onDelete }) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);

  const handleSave = () => {
    onUpdate(item.id, name, description);
  };

  return (
    <li>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={handleSave}>Editar</button>
      <button onClick={() => onDelete(item.id)}>Eliminar</button>
    </li>
  );
};

const DataForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addItem({ name, description }));
    setName('');
    setDescription('');
  };

  return (
    <div>
      <h2>Add Data</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default App;
