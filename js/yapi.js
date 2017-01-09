const APIKEY = 'AIzaSyDn5GdAzwnuCW3k5UYWcOnSmIhF8O9coW8';
const SNIPPET_LENGTH = 15;
let nextPageToken = '';
let inputValue;

function getVideos() {
    inputValue = document.querySelector('#search').value;

    return fetch(`https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&type=video&part=snippet&maxResults=${SNIPPET_LENGTH}&q=${inputValue}`)
        .then(res => res.json())
        .then(jsonRes => {
            data = jsonRes;
            nextPageToken = data.nextPageToken;
            return data;
        });
}

function getNextVideos() {
    return fetch(`https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&type=video&part=snippet&maxResults=${SNIPPET_LENGTH}&q=${inputValue}&pageToken=${nextPageToken}`)
        .then(res => res.json())
        .then(jsonRes => {
            data = jsonRes;
            nextPageToken = data.nextPageToken;
            return data;
        });
}

module.exports = {getVideos, getNextVideos};
