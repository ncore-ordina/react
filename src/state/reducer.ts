import { toggleReadOnly } from "./actions";

export interface State {
  isReadOnly: boolean;
}

const initialState: State = {
  isReadOnly: true,
};

export const featureKey = "app";

export function appReducer(state = initialState, action: any) {
  switch (action.type) {
    case toggleReadOnly.type:
      return { ...state, isReadOnly: !state.isReadOnly };
    default:
      return state;
  }
}
