import { useState } from "react";
import CreatePlaylistForm from "../../components/CreatePlaylistForm";
import SearchBar from "../../components/Playlist/SearchBar";
import SelectTrack from "../../components/Playlist/SelectTrack";
import getSearchTracks from "../../data/spotify/get-search-tracks";
import getUserData from "../../data/spotify/get-user-data";
import postAddItemsToPlaylist from "../../data/spotify/post-add-items-to-playlist";
import postCreatePlaylist from "../../data/spotify/post-create-playlist";
import { useSelector } from "react-redux";

const CreatePlaylist = () => {
  const [tracks, setTracks] = useState([]);
  const [selectedTracksUri, setSelectedTracksUri] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const [createPlaylistForm, setCreatePlaylistForm] = useState({
    name: "",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const token = useSelector((state) => state.token.token);

  // User
  const fetchUserData = async () => {
    try {
      let response = await getUserData(token);
      return response;
    } catch (error) {
      alert(error);
    }
  };

  // Search
  const handleSearchClick = () => {
    fetchSearchTracks();
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const fetchSearchTracks = async () => {
    try {
      let response = await getSearchTracks(searchInput, token);
      fetchSearchTracksWithSelected(response);
    } catch (error) {
      alert(error);
    }
  };

  const fetchSearchTracksWithSelected = (searchTracks) => {
    const filteredTracks = filterTracks();
    const distincTracks = searchTracks.filter(
      (track) => !selectedTracksUri.includes(track.uri)
    );
    setTracks([...filteredTracks, ...distincTracks]);
  };

  const filterTracks = () => {
    return tracks.filter((track) => selectedTracksUri.includes(track.uri));
  };

  // Select track
  const handleSelectTrack = (trackSelect) => {
    let uri = trackSelect.uri;
    if (selectedTracksUri.includes(uri)) {
      setSelectedTracksUri(selectedTracksUri.filter((item) => item !== uri));
    } else {
      setSelectedTracksUri([...selectedTracksUri, uri]);
    }
  };

  // Create playlist form
  const handleFormInputs = (e) => {
    const { name, value } = e.target;
    setCreatePlaylistForm({ ...createPlaylistForm, [name]: value });
    if (createPlaylistForm.name.length < 10) {
      setErrorMessage("Enter 10 or more characters");
    } else {
      setErrorMessage("");
    }
  };

  const checkInputs = () => {
    return createPlaylistForm.name.length >= 10;
  };

  const handleCreatePlaylistForm = async (e) => {
    e.preventDefault();
    setCreatePlaylistForm({ name: "", description: "" });
    setSelectedTracksUri([]);
    setTracks([]);
    if (checkInputs() && selectedTracksUri.length > 0) {
      try {
        let fetchData = await fetchUserData();
        let userid = fetchData.id;
        let createPlaylist = await postCreatePlaylist(
          userid,
          createPlaylistForm,
          token
        );
        let playlistID = createPlaylist.playlistID;
        handleAddItemsToPlaylist(playlistID);
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Please select at least 1 track or fill the form");
    }
  };

  // Add tracks to playlist
  const handleAddItemsToPlaylist = async (playlist_id) => {
    try {
      let response = await postAddItemsToPlaylist(
        playlist_id,
        token,
        selectedTracksUri
      );
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };

  // Show track data
  const fetchTrackData = () => {
    return (
      tracks.length !== 0 &&
      tracks.map((track) => {
        return (
          <SelectTrack
            key={track.uri}
            track={track}
            handleSelectTrack={() => handleSelectTrack(track)}
            select={false}
          />
        );
      })
    );
  };

  return (
    <>
      <div className="px-8 py-8">
        <div>
          <h2 className="font-bold  text-xl mb-4">Create Playlist</h2>
          <CreatePlaylistForm
            handleSubmit={handleCreatePlaylistForm}
            handleOnChange={handleFormInputs}
            value={createPlaylistForm}
            errorMessage={errorMessage}
          />
          <SearchBar
            handleOnClick={handleSearchClick}
            handleOnChange={handleSearchInput}
          />
          <div className="space-y-2 mt-4">{fetchTrackData()}</div>
        </div>
      </div>
    </>
  );
};
export default CreatePlaylist;