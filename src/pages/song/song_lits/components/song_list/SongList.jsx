import React, {useEffect, useState} from 'react';
import songAction from '../../actions/song';
import {useDispatch} from 'react-redux';
import Typography from '../../../../../components/Typography';
import List from '../../../../../components/List';
import Pagination from '../../../../../components/Pagination';
import Button from "../../../../../components/Button";
import useLocationSearch from "../../../../../misc/hooks/useLocationSearch";
import useChangePage from "../../../../../misc/hooks/useChangePage";
import {toast} from "react-toastify";
import SortByParams from "../../../song_lits/components/sort_by_param/SortByParams"
import "react-toastify/dist/ReactToastify.css";
import Toast from "../../../../../components/Toast";
import SongListItem from "../song_list_item/SongListItem";
import {useNavigate} from "react-router-dom";

const SongList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const locationParams = useLocationSearch();

    const currentPage = parseInt(locationParams.page) || 1;
    const changePage = useChangePage();

    const [songs, setSongs] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState({
        genre: locationParams.genre || '',
        album: locationParams.album || '',
    });

    const fetchSongs = (params) => {
        dispatch(songAction.fetchSongList(params))
            .then(response => {
                setTotalPages(response.counter);
                setSongs(response.data);
            })
            .catch((err) => {
                console.error('Error fetching songs:', err);
                toast.error('Failed to fetch songs.');
            });
    };

    useEffect(() => {
        const params = {
            startPage: currentPage - 1,
            genre: filter.genre,
            album: filter.album
        };
        fetchSongs(params);
    }, [dispatch, currentPage, filter]);

    const handlePageChange = (page) => {
        changePage({
            locationSearch: { ...locationParams, page }
        });
    };

    const handleSortChange = (params) => {
        const newFilter = { ...params };
        setFilter(newFilter);
        changePage({
            locationSearch: { ...params, page: 1 }
        });
    };

    const handleResetFilters = () => {
        setFilter({ genre: '', album: '' });
        changePage({
            locationSearch: { page: 1 }
        });
    };

    const handleDeleteSong = (id) => {
        if (window.confirm("Delete song?")) {
            dispatch(songAction.fetchDeleteSong(id))
                .then(() => {
                    const params = {
                        ...filter,
                        startPage: currentPage - 1,
                        size: 5
                    };
                    fetchSongs(params);
                    toast.success('Song removed successfully.');
                })
                .catch((err) => {
                    console.error('Error deleting song:', err);
                    toast.error('Failed to delete song.');
                });
        }
    };

    const handleAddSong = () => {
        const newSong = {
            title: "New Song",
            duration: 3.5,
            album: "New Album",
            genre: "Rock",
            artist_id: 1
        };

        dispatch(songAction.fetchAddSong(newSong))
            .then((response) => {
                const newSongId = response.id;
                navigate(`/song_details/${newSongId}`);
            })
            .catch((err) => {
                console.error('Error adding new song:', err);
                toast.error('Failed to add new song.');
            });
    };

    return (
        <>
            <Toast />
            <SortByParams handleSortChange={handleSortChange} />
            <Button onClick={handleResetFilters}>
                Reset filters
            </Button>
            <Button onClick={handleAddSong}>
                Add song
            </Button>

            {songs.length > 0 ? (
                <>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                    <List>
                        {songs.map((song) => (
                            <SongListItem key={song.id} song={song} onDelete={handleDeleteSong} />
                        ))}
                    </List>
                </>
            ) : (
                <Typography>No data</Typography>
            )}
        </>
    );
};

export default SongList;
