import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from 'react';
import { listSongs } from './graphql/queries';
import { updateSong } from './graphql/mutations';
import { Paper, IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteIcon from '@material-ui/icons/Favorite';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      console.log('song list', songList);
      setSongs(songList);
    } catch (error) {
      console.log('error on fetching songs', error);
    }
  };

  const addLike = async (idx) => {
    try {
      const song = songs[idx];
      song.like = song.like + 1;
      delete song.createdAt;
      delete song.updatedAt;

      const songData = await API.graphql(
        graphqlOperation(updateSong, { input: song })
      );
      const songList = [...songs];
      songList[idx] = songData.data.updateSong;
      setSongs(songList);
    } catch (error) {
      console.log('error on adding Like to song', error);
    }
  };

  return (
    <div className="App">
      {/* Add Todo JSX here  */}
      <header className="App-header">
        <Heading level={1}>Hello {user.username}</Heading>
        <Button onClick={signOut}>Sign out</Button>
      </header>
      <div className="songList">
        {songs.map((song, idx) => {
          return (
            <Paper variant="outlined" elevation={2} key={`song${idx}`}>
              <div className="songCard">
                <IconButton aria-label="play">
                  <PlayArrowIcon />
                </IconButton>
                <div>
                  <div className="songTitle">{song.title}</div>
                  <div className="songOwner">{song.owner}</div>
                </div>
                <div>
                  <IconButton aria-label="like" onClick={() => addLike(idx)}>
                    <FavoriteIcon />
                  </IconButton>
                  {song.like}
                </div>
                <div className="songDescription">{song.description}</div>
              </div>
            </Paper>
          );
        })}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
