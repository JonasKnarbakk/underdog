import { RootState } from './../../store';
import { createSlice, EntityState } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { persistReducer } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import createElectronStorage from 'redux-persist-electron-storage';
import path from 'path';

const electronStore = createElectronStorage({
  electronStoreOpts: {
    name: 'config',
  },
});

export interface Config {
  path: string;
}

const initialState: Config = {
  path: '',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setPath: (state, action) => {
      const { path } = action.payload;
      state.path = path;
    },
  },
});

const persistedReducer = persistReducer<Config>(
  {
    key: 'config',
    storage: electronStore,
    stateReconciler: autoMergeLevel1,
  },
  configSlice.reducer
);

export default persistedReducer;
export const { setPath } = configSlice.actions;

export const selectPath = (state: RootState) => state.config.path;
export const selectAddonRootPath = (state: RootState) =>
  path.join(selectPath(state), 'Interface', 'AddOns');

export const selectAddonPath = (state: RootState) => (addonDir: string) =>
  path.join(selectAddonRootPath(state), addonDir);
