import {
    ADD_SONG, ERROR_ADD_SONG,
    ERROR_DELETE_SONG,
    ERROR_RECEIVE_SONG_LIST,
    RECEIVE_SONG_LIST, REQUEST_DELETE_SONG,
    REQUEST_SONG_LIST, SUCCESS_DELETE_SONG,
} from "pages/song/song_lits/constants/songsActionTypes";
import axios from "axios";
import config from "../../../../config";

const errorReceiveSongList = (err) => ({
    payload: err,
    type: ERROR_RECEIVE_SONG_LIST
})

const requestSongList = () => ({
    type: REQUEST_SONG_LIST
})

const receiveSongList = (data) => ({
    payload: data,
    type: RECEIVE_SONG_LIST
})

const requestDeleteSong = () => ({
    type: REQUEST_DELETE_SONG,
});

const successDeleteSong = (id) => ({
    type: SUCCESS_DELETE_SONG,
    payload: id,
});

const errorDeleteSong = (error) => ({
    type: ERROR_DELETE_SONG,
    payload: error,
});

const addSong = () => ({
    type: ADD_SONG
})

const errorAddSong = (error) => ({
    type: ERROR_ADD_SONG,
    payload: error
})

const { SONG_SERVICE } = config;

export const fetchSongList = ({ startPage, genre, album }) => {
    const requestData = {
        startPage: startPage,
        size: 5,
        genre: genre,
        album: album
    };

    return dispatch => {
        dispatch(requestSongList());

        return axios.post(`${SONG_SERVICE}/api/song/_list`, requestData)
            .then(response => {
                dispatch(receiveSongList(response.data));
                return response;
            })
            .catch(error => {
                dispatch(errorReceiveSongList(error.message));
                console.error('Error fetching song list:', error);
                throw error;
            });
    };
};

const fetchDeleteSong = (id) => {
    return (dispatch) => {
        dispatch(requestDeleteSong());
        return axios.delete(`${SONG_SERVICE}/api/song/${id}`)
            .then(response => {
                dispatch(successDeleteSong(id));
                return response;
            })
            .catch(error => {
                dispatch(errorDeleteSong(error.message));
            });
    };
};

const fetchAddSong = (song) => {
    return (dispatch) => {
        return axios.post(`${SONG_SERVICE}/api/song`, song)
            .then(response => {
                dispatch(addSong())
                return response;
            })
            .catch(error => {
                dispatch(errorAddSong(error.message))
            })
    }
}

const songAction = {
    fetchSongList,
    fetchDeleteSong,
    fetchAddSong
}

export default songAction;