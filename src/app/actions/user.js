import axios from 'misc/requests';
import config from 'config';
import storage from 'misc/storage';
import {
    ERROR_SIGN_IN,
    RECEIVE_USER,
    REQUEST_SIGN_IN,
    REQUEST_SIGN_OUT,
    REQUEST_USER,
    SUCCESS_SIGN_IN,
} from '../constants/userActionTypes';

const receiveUser = (user) => ({
    payload: user,
    type: RECEIVE_USER,
});

const requestUser = () => ({
    type: REQUEST_USER,
});

const errorSignIn = (errors) => ({
    payload: errors,
    type: ERROR_SIGN_IN,
});

const requestSignIn = () => ({
    type: REQUEST_SIGN_IN,
});

const successSignIn = (user) => ({
    payload: user,
    type: SUCCESS_SIGN_IN,
});

const requestSignOut = () => ({
    type: REQUEST_SIGN_OUT,
});

const { AUTH_SERVICE, USERS_SERVICE } = config;

const getUser = () => {
    return axios.get(`${AUTH_SERVICE}/api/profile`, {
        withCredentials: true
    }).then(response => {
        const { email, firstName, lastName } = response;
        const userData = {
            authorities: ['ENABLE_SEE_SECRET_PAGE'],
            email: email,
            firstName: firstName,
            lastName: lastName,
        };
        storage.setItem('USER', JSON.stringify(userData));
        return userData;
    }).catch(error => {
        if (error.response && error.response.status === 401) {
            storage.removeItem('USER');
            window.location.href = `${USERS_SERVICE}/login`;
        } else {
            console.error('Error fetching user profile:', error);
        }
        throw error;
    });
};

const fetchSignIn = () => {
    return (dispatch) => {
        dispatch(requestSignIn());
        window.location.href = `${AUTH_SERVICE}/oauth/authenticate`;
    };
};

const fetchGoogleSignInCallback = () => (dispatch) => {
    dispatch(requestUser());
    return getUser().then(user => {
        dispatch(receiveUser(user));
        dispatch(successSignIn(user));
    }).catch((errors) => {
        console.error('Error fetching user profile:', errors);
        dispatch(errorSignIn(errors));
    });
};

const fetchSignOut = () => (dispatch) => {
    storage.removeItem('USER');
    dispatch(requestSignOut());
};

const fetchUser = () => (dispatch) => {
    dispatch(requestUser());
    return getUser()
        .then(user => {
            dispatch(receiveUser(user));
        })
        .catch((err) => {
            const user = storage.getItem('USER');
            if (user) {
                const parsedUser = JSON.parse(user);
                dispatch(receiveUser(parsedUser));
                return parsedUser;
            } else {
                dispatch(fetchSignOut());
                return Promise.reject(err);
            }
        });
};

const exportFunctions = {
    fetchSignIn,
    fetchSignOut,
    fetchUser,
    fetchGoogleSignInCallback,
};

export default exportFunctions;
