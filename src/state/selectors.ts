import { featureKey, State } from "./reducer";
import { createSelector } from "@reduxjs/toolkit";

const getAppState = (state: any) => state[featureKey];

export const selectIsReadOnly = createSelector(
  getAppState,
  (appState: State) => appState.isReadOnly
);
