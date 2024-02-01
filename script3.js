let pg_count = 0;
const access_key = "KL7bSNfzkmWueulyi4QXA8byTN-CaIHMLIIxoENZLw0";
const inputText = document.getElementById('search-input');
const search = document.getElementById("search-btn");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const img_container = document.getElementById('container');
const spinner = document.createElement('div');
spinner.classList.add('text-center');
const empty = document.getElementById("end");

let inputdata;


const unsplashurl = `https://api.unsplash.com/search/photos?page=${pg_count}&query=${inputdata}&client_id=${access_key}`;
const flickrurl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3701d6bf2e4d3c9789beaa053a5ab400&tags=${inputdata}&format=json&nojsoncallback=1`
const pinteresturl = `https://pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com/api/basesearch?query=${inputdata}`;
const pexelurl = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=dog&locale=en-US&per_page=30&page=1`;
const pexeloptions = {
    method: 'GET',
    headers: {
        Authorization: 'StETECaNFCtc7ohSE7o6AxkEiyrM5tnKxdzrNoWGB00NQzOVaRGjb88o',
        'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
        'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com'
    }
};

const pinterestoptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '89b55ce14bmsh7160029a8fa0bc8p128d3ajsn9fa7187ae5ec',
        'X-RapidAPI-Host': 'pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com'
    }
};

async function getData() {
    console.log(pg_count)
    inputdata = inputText.value.toLowerCase();
    if (inputdata.length == 0) {
        return alert("Please Enter Text");
    }

    if (!/^[a-zA-Z]+$/.test(inputdata)) {
        return alert("Please enter valid keyword");
    }

    try {
        if (pg_count === 1) {
            img_container.innerHTML = "";
        }

        spinner.innerHTML = `<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>`;
        document.body.appendChild(spinner);

        // await getUnsplashImages();
        // await getFlickrImages();
        // await getPintrestImages();
        await getPexelImages();

        spinner.innerHTML = "";
    }
    catch (e) {
        alert("something error happend");
        spinner.innerHTML = "";
        // window.removeEventListener('scroll', 'getdata')
        console.log(e);
    }

}

async function getUnsplashImages() {
    const unsplashurl = `https://api.unsplash.com/search/photos?page=${pg_count}&query=${inputdata}&client_id=${access_key}`;
    inputdata = inputText.value.toLowerCase();
    const response = await fetch(unsplashurl);
    const data = await response.json();
    let photos = data.results;
    console.log(photos);
    let matches = photos.filter(photo => {
        const regex = new RegExp(`${inputdata}`, 'gi');
        return photo.slug.match(regex) || photo.alt_description.match(regex);
    });
    //    console.log(matches)
    matches.sort(sortByFreshness);
    // console.log(photos);
    matches.forEach(addUnsplashImages);
}

async function getFlickrImages() {
    const flickrurl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3701d6bf2e4d3c9789beaa053a5ab400&tags=${inputdata}&format=json&nojsoncallback=1`
    const response = await fetch(flickrurl);
    const data = await response.json();
    // console.log(data);
    let photos = data.photos.photo;
    console.log(photos);
    photos.forEach(addFlickrImages);
}

async function getPintrestImages() {
    const pinteresturl = `https://pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com/api/basesearch?query=${inputdata}`;
    const pinterestoptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '89b55ce14bmsh7160029a8fa0bc8p128d3ajsn9fa7187ae5ec',
            'X-RapidAPI-Host': 'pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com'
        }
    };
    const response = await fetch(pinteresturl, pinterestoptions);
    const data = await response.json();
    console.log(data);
    const photos = data.resource_response.results;
    console.log(photos);
    photos.forEach(addPintrestImages);
}

async function getPexelImages() {
    const pexelurl = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${inputdata}&locale=en-US&per_page=30&page=${pg_count}`;
    const pexeloptions = {
        method: 'GET',
        headers: {
            Authorization: 'StETECaNFCtc7ohSE7o6AxkEiyrM5tnKxdzrNoWGB00NQzOVaRGjb88o',
            'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
            'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com'
        }
    };
    const response = await fetch(pexelurl, pexeloptions);
    const data = await response.json();
    console.log(data);
    let photos = data.photos;
    photos.forEach(addPexelImages);
}

function addUnsplashImages(value) {
    let img_element = document.createElement('div');
    let img = document.createElement('img');
    let img_link = document.createElement('a');
    let img_caption = document.createElement('a');
    img_link.href = value.links.html;
    img_link.setAttribute('target', '_blank');
    img.src = value.urls.small;
    img.alt = value.alt_description;
    img_caption.textContent = value.alt_description;
    img_link.appendChild(img);
    img_element.appendChild(img_link);
    img_element.appendChild(img_caption);
    img_caption.href = value.links.html;
    img_caption.setAttribute('target', '_blank');
    img_container.appendChild(img_element);
    img_element.classList.add('img-element');
    img.classList.add('img-fluid');
    img_element.classList.add('m-2');
    img.setAttribute('loading', 'lazy');
    img_link.classList.add('image');
}

function addFlickrImages(value) {
    let url = `https://farm${value.farm}.staticflickr.com/${value.server}/${value.id}_${value.secret}.jpg`;
    console.log(url)
    let img_element = document.createElement('div');
    let img = document.createElement('img');
    let img_link = document.createElement('a');
    let img_caption = document.createElement('a');
    // img_link.href = value.links.html;
    img_link.setAttribute('target', '_blank');
    img.src = url;
    // img.alt = value.alt_description;
    // img_caption.textContent = value.alt_description;
    img_link.appendChild(img);
    img_element.appendChild(img_link);
    img_element.appendChild(img_caption);
    // img_caption.href = value.links.html;
    img_caption.setAttribute('target', '_blank');
    img_container.appendChild(img_element);
    img_element.classList.add('img-element');
    img.classList.add('img-fluid');
    img_element.classList.add('m-2');
    img.setAttribute('loading', 'lazy');
    img_link.classList.add('image');
}

function addPintrestImages(value) {
    console.log(value.images)
    let img_element = document.createElement('div');
    let img = document.createElement('img');
    let img_link = document.createElement('a');
    let img_caption = document.createElement('a');
    // img_link.href = value.links.html;
    img_link.setAttribute('target', '_blank');
    img.src = value.images["170x"].url;
    // img.alt = value.alt_description;
    // img_caption.textContent = value.alt_description;
    img_link.appendChild(img);
    img_element.appendChild(img_link);
    img_element.appendChild(img_caption);
    // img_caption.href = value.links.html;
    img_caption.setAttribute('target', '_blank');
    img_container.appendChild(img_element);
    img_element.classList.add('img-element');
    img.classList.add('img-fluid');
    img_element.classList.add('m-2');
    img.setAttribute('loading', 'lazy');
    img_link.classList.add('image');
}

function addPexelImages(value) {
    console.log(value.images)
    let img_element = document.createElement('div');
    let img = document.createElement('img');
    let img_link = document.createElement('a');
    let img_caption = document.createElement('a');
    // img_link.href = value.links.html;
    img_link.setAttribute('target', '_blank');
    img.src = value.src.original;
    // img.alt = value.alt_description;
    // img_caption.textContent = value.alt_description;
    img_link.appendChild(img);
    img_element.appendChild(img_link);
    img_element.appendChild(img_caption);
    // img_caption.href = value.links.html;
    img_caption.setAttribute('target', '_blank');
    img_container.appendChild(img_element);
    img_element.classList.add('img-element');
    img.classList.add('img-fluid');
    img_element.classList.add('m-2');
    // img.setAttribute('loading', 'lazy');
    img_link.classList.add('image');
}

const parseISODate = (isoDateString) => {
    return new Date(isoDateString);
};

const sortByFreshness = (a, b) => {
    const dateA = parseISODate(a.created_at);
    const dateB = parseISODate(b.created_at);
    return dateB - dateA;
};


search.addEventListener("click", (event) => {
    pg_count = 1;
    event.preventDefault();
    getData();

})

const isBottomOfPage = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    return scrollTop + windowHeight >= documentHeight; // Adjust 200 to your liking
};

// Event listener for scroll events
// window.addEventListener('scroll', () => {
//     if (isBottomOfPage()) {
//         pg_count++;
//         getData();
//     }
// });



function myFunction(value) {
    // let url = `https://farm${value.farm}.staticflicker.com/${value.server}/${value.id}_${value.secret}.jpg`;

}
// getFlickrImages();


function imageMount(value) {

}



// getPintrestImages();

function pintrestImg(value) {

}


