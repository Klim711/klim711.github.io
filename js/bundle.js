/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const draw = __webpack_require__(1);
	const listen = __webpack_require__(2);

	draw.init();
	listen();


/***/ },
/* 1 */
/***/ function(module, exports) {

	let pageLength = 0;
	let pagesCount = 0;

	function init() {
	    let body = document.querySelector('body');

	    body.innerHTML = `
	        <form action="#">
	            <input id="search" type="text" placeholder="Search">
	        </form>

	        <div class="slider-wrapper video-panel noselect">
	            <ul class="video-list slider">
	            </ul>
	        </div>

	        <div class="slider-wrapper pagination-panel noselect">
	            <ul class="slider">

	            </ul>
	        </div>
	    `;
	}

	function appendArticles(data, isRedraw) {
	    let videoList = document.querySelector('.video-list');

	    if (isRedraw) {
	        document.querySelector('.video-list').innerHTML = "";
	    }

	    data.items.forEach((item) => {
	        //<iframe width="300" height="170" src="https://www.youtube.com/embed/${item.id.videoId}" frameboarder="0" allowfullscreen></iframe>
	        videoList.innerHTML += `
	            <li class="video">
	                <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">
	                    <img src="${item.snippet.thumbnails.medium.url}">
	                </a>
	                <div class="video-description">
	                    <h3>
	                        <a class="video-name" href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">${item.snippet.title}</a>
	                    </h3>
	                    <a class="video-channel" href="https://www.youtube.com/channel/${item.snippet.channelId}" target="_blank">${item.snippet.channelTitle}</a>
	                    <p>${item.snippet.description}</p>
	                </div>
	            </li>
	        `;
	    });
	}

	function paginationDraw(currentPage) {
	    pageLength = document.querySelector('.video-panel').offsetWidth / 350;
	    pagesCount = Math.floor(document.querySelector('.video-list').children.length / pageLength);

	    let paginationList = document.querySelector('.pagination-panel ul');

	    paginationList.innerHTML = '';

	    for (let i = 0; i < pagesCount; ++i) {
	        paginationList.innerHTML += `
	            <li>
	                <input id="page${i}" type="radio" name="page">
	                <label for="page${i}"  title="${i + 1}">${i + 1}</label>
	            </li>
	        `;
	    }
	    if (currentPage === undefined) {
	        currentPage = Math.floor(-parseInt(document.querySelector('.video-list').style.marginLeft || 0, 10) / document.querySelector('.video-panel').offsetWidth);
	        flipTo(currentPage);
	    }
	    if (currentPage < pagesCount) {
	        document.querySelector(`#page${currentPage}`).checked = true;
	    }
	}

	function flipTo(pageNumber) {
	    if (pageNumber >= pagesCount) {
	        return;
	    }

	    let width = document.querySelector('.video-panel').offsetWidth;

	    document.querySelector('.video-list').style.marginLeft = -width * pageNumber + 'px';
	    document.querySelector('.pagination-panel ul').style.marginLeft = -40 * pageNumber + 'px';
	    document.querySelector(`#page${pageNumber}`).checked = true;
	}

	module.exports = {init, appendArticles, paginationDraw, flipTo};

	// function swipe(toRight) {
	//     let videoList = document.querySelector('.video-list');
	//
	//     let marginLeft = parseInt(videoList.style.marginLeft, 10) || 0;
	//     let width = document.querySelector('.video-panel').offsetWidth;
	//
	//     if (toRight) {
	//         videoList.style.marginLeft = marginLeft - width + 'px';
	//     } else {
	//         if (marginLeft < 0) {
	//             videoList.style.marginLeft = marginLeft + width + 'px';
	//         }
	//     }
	// }


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const {
	    getVideos,
	    getNextVideos
	} = __webpack_require__(3);

	const {
	    appendArticles,
	    paginationDraw,
	    flipTo
	} = __webpack_require__(1);

	let startSwipePosition;
	let endSwipePosition;
	let isSwipeStart = false;

	function listen() {

	    searchHandler();

	    swipeMouseHandler();
	    swipeTouchHandler();

	    paginationHandler();
	    uploadHandler();
	    resizeHandler();
	}

	function searchHandler() {
	    document.querySelector('#search').addEventListener('keyup', function(e) {
	        if (e.keyCode === 13) {

	            getVideos()
	                .then(data => appendArticles(data, true))
	                .then(() => paginationDraw(0))
	                .then(() => flipTo(0));
	        }
	    });
	}

	function swipeMouseHandler() {
	    document.querySelector('body').addEventListener('mousedown', swipeBegin);
	    document.querySelector('body').addEventListener('mouseup', swipeEnd);
	}

	function swipeTouchHandler() {
	    document.querySelector('body').addEventListener('touchstart', swipeBegin);
	    document.querySelector('body').addEventListener('touchend', swipeEnd);
	}

	function swipeBegin(e) {
	    if (e.target.nodeName === 'INPUT' || document.querySelector('.video-list').children.length === 0) {
	        return;
	    }
	    isSwipeStart = true;

	    startSwipePosition = e.clientX || e.targetTouches[0].clientX;
	}

	function swipeEnd(e) {
	    if (!isSwipeStart) {
	        return;
	    }

	    let pageNumber = Number(document.querySelector('.pagination-panel input:checked + label').innerHTML) - 1;

	    endSwipePosition = e.clientX || e.changedTouches[0].clientX;

	    let event = new Event('swipeEnd', {
	        "bubbles": true
	    });

	    if (startSwipePosition - endSwipePosition > 10) {
	        flipTo(pageNumber + 1);
	        document.querySelector(`#page${pageNumber + 1}`).dispatchEvent(event);
	    } else {
	        if (endSwipePosition - startSwipePosition > 10 && pageNumber > 0) {
	            flipTo(pageNumber - 1);
	            document.querySelector(`#page${pageNumber - 1}`).dispatchEvent(event);
	        }
	    }

	    isSwipeStart = false;
	}

	function paginationHandler() {
	    document.querySelector('.pagination-panel ul').addEventListener('change', function(e) {
	        let pageNumber = Number(document.querySelector('.pagination-panel input:checked + label').innerHTML) - 1;

	        flipTo(pageNumber);
	        let event = new Event('swipeEnd', {
	            "bubbles": true
	        });
	        e.target.dispatchEvent(event);
	    });
	}

	function uploadHandler() {
	    document.querySelector('.pagination-panel ul').addEventListener('swipeEnd', function(e) {
	        let pageNumber = Number(document.querySelector('.pagination-panel input:checked + label').innerHTML) - 1;

	        if (pageNumber >= Math.floor(e.currentTarget.children.length * 0.6)) {
	            getNextVideos()
	                .then(data => appendArticles(data, false))
	                .then(() => paginationDraw(pageNumber));
	        }
	    });
	}

	function resizeHandler() {
	    if (matchMedia) {
	        let mediaQuery1 = window.matchMedia("(max-width: 730px)");
	        mediaQuery1.addListener(widthChange);

	        let mediaQuery2 = window.matchMedia("(max-width: 1100px)");
	        mediaQuery2.addListener(widthChange);

	        let mediaQuery3 = window.matchMedia("(max-width: 1460px)");
	        mediaQuery3.addListener(widthChange);
	    }

	    function widthChange(mediaQuery) {
	        if (document.querySelector('.pagination-panel ul').children.length > 0) {
	            paginationDraw();
	        }
	    }
	}

	module.exports = listen;


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);