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

        <div class="pagination-wrapper slider-wrapper hidden">
            <button id="left-button" title="10 pages back">
                <i class="fa fa-fast-backward" aria-hidden="true"></i>
            </button>
            <div class="pagination-panel slider-wrapper">
                <ul class="slider">

                </ul>
            </div>
            <button id="right-button" title="10 pages forward">
                <i class="fa fa-fast-forward" aria-hidden="true"></i>
            </button>
        </div>
    `;


}

function appendArticles(data, isRedraw) {
    let videoList = document.querySelector('.video-list');

    if (isRedraw) {
        document.querySelector('.video-list').innerHTML = "";
    }

    let publishedDate;
    data.items.forEach((item) => {
        publishedDate = new Date(item.snippet.publishedAt);

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
                    <p>Published on ${publishedDate.toDateString()}</p>
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

    if (pageNumber === 0 || pageNumber === 1) {
        document.querySelector('.pagination-panel ul').style.marginLeft = '-80px';
    } else {
        document.querySelector('.pagination-panel ul').style.marginLeft = -40 * pageNumber + 'px';
    }

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
