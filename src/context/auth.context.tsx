import React from 'react';
import {IMemberDetailResponse} from '../types/profile.type';

export enum EAuthUserAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SET_LOGIN_TYPE = 'SET_LOGIN_TYPE',
}
type State = {user?: IMemberDetailResponse; loginType?: 'Email' | 'KompasId'};
type Action = {type: EAuthUserAction; payload?: State};
type Dispatch = (action: Action) => void;

const AuthUserContext = React.createContext<
  {state: State; dispatch: Dispatch} | undefined
>(undefined);

function authUserReducer(state: State, action: Action) {
  switch (action.type) {
    case EAuthUserAction.LOGIN: {
      return {...state, user: action.payload?.user};
    }
    case EAuthUserAction.LOGOUT: {
      return {...state, user: undefined};
    }
    case EAuthUserAction.SET_LOGIN_TYPE: {
      return {...state, loginType: action.payload?.loginType};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AuthUserProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = React.useReducer(authUserReducer, {
    user: undefined,
  });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = {state, dispatch};
  return (
    <AuthUserContext.Provider value={value}>
      {children}
    </AuthUserContext.Provider>
  );
}

function useAuthUser() {
  const context = React.useContext(AuthUserContext);
  if (context === undefined) {
    throw new Error('useAuthUser must be used within a AuthUserProvider');
  }

  return {
    ...context,
    isLoggedIn: context.state.user ? true : false,
    user: context.state.user,
    setLoginType: (type: 'Email' | 'KompasId') =>
      context.dispatch({
        type: EAuthUserAction.SET_LOGIN_TYPE,
        payload: {
          loginType: type,
        },
      }),
    isVerified:
      Number(context.state.user?.linked?.mbsdZmemId?.[0]?.mbsdStatus) === 1,
  };
}

export {AuthUserProvider, useAuthUser};
