import {useState} from "react";

const SortByParams = ({ handleSortChange }) => {
    const [genre, setGenre] = useState('');
    const [album, setAlbum] = useState('');

    const handleSubmit = () => {
        const params = {};
        if (genre) {
            params.genre = genre;
        }
        if (album) {
            params.album = album;
        }

        if (Object.keys(params).length > 0) {
            handleSortChange(params);
            setGenre('');
            setAlbum('');
        } else {
            console.log('Введіть хоча б одне значення');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Введіть жанр"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />
            <input
                type="text"
                placeholder="Введіть альбом"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
            />
            <button onClick={handleSubmit}>Надіслати</button>
        </div>
    );
};

export default SortByParams;