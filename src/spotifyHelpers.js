import axios from 'axios';

// Helper to fetch all playlists (internal use)
async function fetchUserPlaylists(accessToken) {
    let playlists = [];
    let url = 'https://api.spotify.com/v1/me/playlists?limit=50';
    while (url) {
        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            playlists = playlists.concat(response.data.items);
            url = response.data.next;
        } catch (error) {
            console.error('Error fetching playlists:', error.message);
            break; // Stop on error, return what we have
        }
    }
    return playlists;
}

export function selectTopPlaylists(playlists) {
    // Sort by tracks.total descending
    const sorted = [...playlists].sort((a, b) => {
        const aCount = a.tracks ? a.tracks.total : 0;
        const bCount = b.tracks ? b.tracks.total : 0;
        return bCount - aCount;
    });
    // Return top 10
    return sorted.slice(0, 10);
}

export async function fetchAllTracksForPlaylist(playlistId, accessToken) {
    let tracks = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

    while (url) {
        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            const items = response.data.items || [];
            const trackNames = items
                .map(item => item.track ? item.track.name : null)
                .filter(name => name); // Filter nulls

            tracks = tracks.concat(trackNames);
            url = response.data.next;
        } catch (error) {
            console.error(`Error fetching tracks for playlist ${playlistId}:`, error.message);
            // If error, stop fetching for this playlist but return what we have
            break;
        }
    }
    return tracks;
}

export function sampleTracks(allTrackNames) {
    // Unique names
    const uniqueNames = [...new Set(allTrackNames)];

    if (uniqueNames.length <= 50) {
        return uniqueNames;
    }

    // Random sample
    const sampled = [];
    const temp = [...uniqueNames];
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * temp.length);
        sampled.push(temp[randomIndex]);
        temp.splice(randomIndex, 1);
    }
    return sampled;
}

export function prepareSummaryForGroq(totalPlaylistsCount, analyzedPlaylists) {
    return {
        totalPlaylists: totalPlaylistsCount,
        analyzedPlaylists: analyzedPlaylists.length,
        playlists: analyzedPlaylists
    };
}

export async function processPlaylistsForAI(accessToken, providedPlaylists = null) {
    let playlists = providedPlaylists;

    if (!playlists) {
        playlists = await fetchUserPlaylists(accessToken);
    }

    const totalPlaylistsCount = playlists.length;
    const topPlaylists = selectTopPlaylists(playlists);

    const analyzedPlaylists = [];

    for (const playlist of topPlaylists) {
        try {
            const trackNames = await fetchAllTracksForPlaylist(playlist.id, accessToken);
            const sampled = sampleTracks(trackNames);

            analyzedPlaylists.push({
                name: playlist.name,
                description: playlist.description || "",
                owner: playlist.owner ? playlist.owner.display_name : "Unknown",
                totalTracks: playlist.tracks ? playlist.tracks.total : 0,
                sampleTracks: sampled
            });
        } catch (error) {
            console.error(`Error processing playlist ${playlist.name}:`, error.message);
            // Skip this playlist on error
        }
    }

    return prepareSummaryForGroq(totalPlaylistsCount, analyzedPlaylists);
}
