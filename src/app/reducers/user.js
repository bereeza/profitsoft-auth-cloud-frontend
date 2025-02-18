import {
  ERROR_RECEIVE_USER,
  ERROR_SIGN_IN,
  RECEIVE_USER,
  REQUEST_SIGN_OUT,
  REQUEST_SIGN_IN,
  REQUEST_USER,
  SUCCESS_SIGN_IN,
} from '../constants/userActionTypes';

const initialState = {
  authorities: [],
  firstName: '',
  email: '',
  errors: [],
  id: '',
  isAuthorized: false,
  isFailedSignIn: false,
  isFailedSignUp: false,
  isFetchingSignIn: false,
  isFetchingSignUp: false,
  isFetchingUser: false,
  lastName: '',
  login: '',
};

const convertErrors = errors => errors.map(error => ({
  code: error.code,
  description: error.description,
}));

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case ERROR_SIGN_IN: {
      return {
        ...state,
        errors: convertErrors(action.payload),
        isFailedSignIn: true,
        isFetchingSignIn: false,
      };
    }

    case RECEIVE_USER:
    case SUCCESS_SIGN_IN: {
      const user = action.payload;

      return {
        ...state,
        authorities: user.authorities || initialState.authorities,
        email: user.email || initialState.email,
        firstName: user.firstName || initialState.firstName,
        id: user.id || initialState.id,
        isAuthorized: true,
        isFetchingSignIn: false,
        isFetchingUser: false,
        lastName: user.lastName || initialState.lastName,
        login: user.login || initialState.login,
      };
    }

    case ERROR_RECEIVE_USER:
    case REQUEST_SIGN_OUT: {
      return initialState;
    }

    case REQUEST_SIGN_IN: {
      return {
        ...state,
        errors: initialState.errors,
        isFailedSignIn: false,
        isFetchingSignIn: true,
      }
    }

    case REQUEST_USER: {
      return {
        ...state,
        isFetchingUser: true,
      };
    }

    default: {
      return state;
    }
  }
}
