import React from 'react';

export enum EDemoAction {
  SHOW_MODAL = 'SHOW_MODAL',
  HIDE_MODAL = 'HIDE_MODAL',
  SET_DEMO_VERIFY_EMAIL = 'SET_DEMO_VERIFY_EMAIL',
}
type State = {isShowModal?: boolean; isShowDemoVerifyEmail?: boolean};
type Action = {type: EDemoAction; payload?: State};
type Dispatch = (action: Action) => void;

const DemoContext = React.createContext<
  {state: State; dispatch: Dispatch} | undefined
>(undefined);

function demoReducer(state: State, action: Action) {
  switch (action.type) {
    case EDemoAction.SHOW_MODAL: {
      return {...state, isShowModal: true};
    }
    case EDemoAction.HIDE_MODAL: {
      return {...state, isShowModal: false};
    }
    case EDemoAction.SET_DEMO_VERIFY_EMAIL: {
      return {
        ...state,
        isShowDemoVerifyEmail: action.payload?.isShowDemoVerifyEmail,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function DemoProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = React.useReducer(demoReducer, {
    isShowModal: false,
    isShowDemoVerifyEmail: false,
  });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch};
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

function useDemo() {
  const context = React.useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }

  return {
    ...context,
    ...context.state,
    showModal: () => context.dispatch({type: EDemoAction.SHOW_MODAL}),
    hideModal: () => context.dispatch({type: EDemoAction.HIDE_MODAL}),
    setDemoVerifyEmail: (val: boolean) =>
      context.dispatch({
        type: EDemoAction.SET_DEMO_VERIFY_EMAIL,
        payload: {
          isShowDemoVerifyEmail: val,
        },
      }),
  };
}

export {DemoProvider, useDemo};
