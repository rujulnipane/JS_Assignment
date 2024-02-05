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
let count = 0;
let pg_count = 0;

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

        // Get Images from Different APIs
        try {
            await getUnsplashImages();
        }
        catch (e) {
            console.log(e);
        }
        try {
            await getPintrestImages();
        }
        catch (e) {
            console.log(e);
        }
        try {
            await getFlickrImages();
        }
        catch (e) {
            console.log(e);
        }
        try {
            await getPexelImages();
        }
        catch (e) {
            console.log(e);
        }
        try {
            await getInstagramImages();
        }
        catch (e) {
            console.log(e);
        }
        spinner.innerHTML = "";
        if (count == 0) {
            alert("No results Found");
        }
    }
    catch (e) {
        spinner.innerHTML = "";
        // window.removeEventListener('scroll', 'getdata');
        console.log(e);
    }

}

async function getUnsplashImages() {
    const unsplashurl = `https://api.unsplash.com/search/photos?page=${pg_count}&query=${inputdata}&client_id=${access_key}`;
    inputdata = inputText.value.toLowerCase();
    const response = await fetch(unsplashurl);
    const data = await response.json();
    let photos = data.results;
    count += photos.length;
    console.log(photos);
    let matches = photos.filter(photo => {
        const regex = new RegExp(`${inputdata}`, 'gi');
        return photo.slug.match(regex) || photo.alt_description.match(regex);
    });
    //    console.log(matches)
    matches.sort(sortByFreshness);
    // console.log(photos);
    // matches.forEach(createImage);
    matches.forEach(photo => createAndAppendImage(photo, "Unsplash"));
}

async function getFlickrImages() {
    const flickrurl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3701d6bf2e4d3c9789beaa053a5ab400&tags=${inputdata}&format=json&nojsoncallback=1`
    const response = await fetch(flickrurl);
    const data = await response.json();
    // console.log(data);
    let photos = data.photos.photo;
    console.log(photos);
    count += photos.length;
    photos = photos.slice(0, 50);
    // let matches = photos.filter(photo => {
    //     const regex = new RegExp(`${inputdata}`, 'gi');
    //     return photo.title.match(regex);
    // });
    // console.log(matches);
    // matches.forEach(addFlickrImages);
    photos.forEach(photo => createAndAppendImage(photo, "Flickr"));
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
    count += photos.length;
    console.log(photos);
    photos.forEach(photo => createAndAppendImage(photo, "Pinterest"));
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
    count += photos.length;
    photos.forEach(photo => createAndAppendImage(photo, "Pexels"));
}


async function getInstagramImages() {
    const instagramurl = `https://instagram-looter2.p.rapidapi.com/tag-feeds?query=${inputdata}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '89b55ce14bmsh7160029a8fa0bc8p128d3ajsn9fa7187ae5ec',
            'X-RapidAPI-Host': 'instagram-looter2.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(instagramurl, options);
        const result = await response.json();
        let photos = result.data.hashtag.edge_hashtag_to_media.edges;
        console.log(photos);
        count += photos.length;
        // let matches = photos.filter(photo => {
        //     console.log(photo.node.accessibility_caption);
        //     const regex = new RegExp(`${inputdata}`, 'gi');
        //     // return photo.node.accessibility_caption.match(regex);
        // });
        // console.log(matches);
        photos.forEach(photo => createAndAppendImage(photo, "Instagram"));
    } catch (error) {
        console.error(error);
    }
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
window.addEventListener('scroll', () => {
    if (isBottomOfPage()) {
        pg_count++;
        getData();
    }
});


async function createAndAppendImage(value, source) {
    try {
        const colDiv = document.createElement("div");
        colDiv.className = "col-xl-3 col-lg-4 col-md-auto mb-4";

        const cardDiv = document.createElement("div");
        cardDiv.className = "bg-white rounded shadow-sm";

        const img = document.createElement("img");
        img.alt = "";
        img.className = "img-fluid card-img-top mx-auto";

        const contentDiv = document.createElement("div");
        contentDiv.className = "p-4";

        const title = document.createElement("h5");
        const titleLink = document.createElement("a");
        titleLink.className = "text-dark";
        titleLink.textContent = source;
        titleLink.setAttribute("target", "_blank");
        title.appendChild(titleLink);

        const description = document.createElement("p");
        description.className = "small text-muted mb-0";

        contentDiv.appendChild(title);
        contentDiv.appendChild(description);

        cardDiv.appendChild(img);
        cardDiv.appendChild(contentDiv);

        colDiv.appendChild(cardDiv);
        img_container.appendChild(colDiv);

        let imageUrl;
        let des;
        let link;

        switch (source) {
            case "Pinterest":
                imageUrl = value.images["170x"].url;
                link = value.images["170x"].url;
                break;
            case "Flickr":
                imageUrl = `https://farm${value.farm}.staticflickr.com/${value.server}/${value.id}_${value.secret}.jpg`;
                link = `https://farm${value.farm}.staticflickr.com/${value.server}/${value.id}_${value.secret}.jpg`;
                des = value.title;
                break;
            case "Pexels":
                imageUrl = value.src.original;
                break;
            case "Instagram":
                imageUrl = value.node.display_url;
                break;
            default:
                imageUrl = value.urls.small;
                link = value.links.html;
                des = value.alt_description;
        }
        img.src = imageUrl;
        titleLink.href = link;
        description.textContent = des;

    } catch (error) {
        console.error("Error:", error.message);
    }
}


