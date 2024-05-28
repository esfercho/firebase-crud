import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface DataState {
  items: Array<{ id: string; name: string; description: string }>;
  loading: boolean;
}

const initialState: DataState = {
  items: [],
  loading: false,
};

// Apunta a la colección específica
const collectionPath = '/items';

export const fetchData = createAsyncThunk('data/fetchData', async () => {
  const querySnapshot = await getDocs(collection(db, collectionPath));
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Array<{ id: string; name: string; description: string }>;
});

export const addItem = createAsyncThunk('data/addItem', async (item: { name: string; description: string }) => {
  const docRef = await addDoc(collection(db, collectionPath), item);
  return { ...item, id: docRef.id };
});

export const updateItem = createAsyncThunk('data/updateItem', async (item: { id: string; name: string; description: string }) => {
  const docRef = doc(db, `${collectionPath}/${item.id}`);
  await updateDoc(docRef, { name: item.name, description: item.description });
  return item;
});

export const deleteItem = createAsyncThunk('data/deleteItem', async (id: string) => {
  const docRef = doc(db, `${collectionPath}/${id}`);
  await deleteDoc(docRef);
  return id;
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<Array<{ id: string; name: string; description: string }>>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addItem.fulfilled, (state, action: PayloadAction<{ id: string; name: string; description: string }>) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<{ id: string; name: string; description: string }>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default dataSlice.reducer;

