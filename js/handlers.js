const {
    getVideos,
    getNextVideos
} = require("./yapi");

const {
    appendArticles,
    paginationDraw,
    flipTo
} = require('./draw.js');

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

    buttonsHandler();
}

function searchHandler() {
    document.querySelector('#search').addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {

            getVideos()
                .then(data => {
                    appendArticles(data, true);
                    document.querySelector('.pagination-wrapper').classList.remove('hidden');
                })
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

function buttonsHandler() {
    document.querySelector('#left-button').addEventListener('click', function(e) {
        let pageNumber = Number(document.querySelector('.pagination-panel input:checked + label').innerHTML) - 11;

        flipTo(pageNumber >= 0 ? pageNumber : 0);
    });

    document.querySelector('#right-button').addEventListener('click', function(e) {
        let pageNumber = Number(document.querySelector('.pagination-panel input:checked + label').innerHTML) + 9;
        let maxNumber = document.querySelector('.pagination-panel ul').children.length - 1;

        flipTo(pageNumber < maxNumber ? pageNumber : maxNumber);

        let event = new Event('swipeEnd', {
            "bubbles": true
        });
        document.querySelector('.pagination-panel ul').dispatchEvent(event);
    });
}

module.exports = listen;
