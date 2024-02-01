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

async function getData(){
    
    console.log(pg_count)
    inputdata = inputText.value.toLowerCase();
    if(inputdata.length == 0){
        return alert("Please Enter Text");
    }
   
    if (!/^[a-zA-Z]+$/.test(inputdata)) {
        return alert("Please enter valid keyword");
    }

    let unsplashurl = `https://api.unsplash.com/search/photos?page=${pg_count}&query=${inputdata}&client_id=${access_key}`;
    const flickrurl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3701d6bf2e4d3c9789beaa053a5ab400&tags=cats&format=json&nojsoncallback=1`
    try{
        if(pg_count === 1){
            img_container.innerHTML = "";
        }

    spinner.innerHTML = `<div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`;
    document.body.appendChild(spinner);
        
        const response = await fetch(unsplashurl);
        const data = await response.json();
        spinner.innerHTML = "";
        let photos = data.results;
        let images = data.data;
        // data.forEach(myFunction);
        console.log(photos);
        if(photos.length == 0) {
            alert("no results found");
        }
        else{
            console.log(photos);
            let matches = photos.filter(photo => {
                const regex = new RegExp(`${inputdata}`, 'gi');
                return photo.slug.match(regex) || photo.alt_description.match(regex);
               });
            //    console.log(matches)
            matches.sort(sortByFreshness);
            // console.log(photos);
            matches.forEach(imageMount);
        if(pg_count > 0){
            next.style.display = 'block';
        }
        }
    }
    catch(e){
        alert("something error happend");
        spinner.innerHTML = "";
        window.removeEventListener('scroll','getdata')
        console.log(e);
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


search.addEventListener("click",(event)=>{
    pg_count = 1;
    event.preventDefault();
    getData();
   
})


next.addEventListener("click",(event)=>{
    event.preventDefault();
    pg_count++;
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


async function getFlickrImages(){
    const flickrurl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3701d6bf2e4d3c9789beaa053a5ab400&tags=cats&format=json&nojsoncallback=1`
    const response = await fetch(flickrurl);
    const data = await response.json();

    console.log(data);
    let photos = data.photos.photo;
    console.log(photos);
    photos.forEach(myFunction);
}

function myFunction(value){
    // let url = `https://farm${value.farm}.staticflicker.com/${value.server}/${value.id}_${value.secret}.jpg`;
    let url = `https://farm${value.farm}.staticflickr.com/${value.server}/${value.id}_${value.secret}.jpg`;
    let img_element = document.createElement('div');
    let img = document.createElement('img');
    let img_link = document.createElement('a');
    let img_caption = document.createElement('a');
    // img_link.href = value.links.html;
    img_link.setAttribute('target','_blank');
    img.src = url;
    // img.alt = value.alt_description;
    // img_caption.textContent = value.alt_description;
    img_link.appendChild(img);
    img_element.appendChild(img_link);
    img_element.appendChild(img_caption);
    // img_caption.href = value.links.html;
    img_caption.setAttribute('target','_blank');
    img_container.appendChild(img_element);
    img_element.classList.add('img-element');
    img.classList.add('img-fluid');
    img_element.classList.add('m-2');
    img.setAttribute('loading','lazy');
    img_link.classList.add('image');
}
// getFlickrImages();


function imageMount(value) {
    let img_element = document.createElement('div');
    let img = document.createElement('img');
    let img_link = document.createElement('a');
    let img_caption = document.createElement('a');
    img_link.href = value.links.html;
    img_link.setAttribute('target','_blank');
    img.src = value.urls.small;
    img.alt = value.alt_description;
    img_caption.textContent = value.alt_description;
    img_link.appendChild(img);
    img_element.appendChild(img_link);
    img_element.appendChild(img_caption);
    img_caption.href = value.links.html;
    img_caption.setAttribute('target','_blank');
    img_container.appendChild(img_element);
    img_element.classList.add('img-element');
    img.classList.add('img-fluid');
    img_element.classList.add('m-2');
    img.setAttribute('loading','lazy');
    img_link.classList.add('image');
}


async function getPintrestImages(){

    const url = 'https://pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com/api/basesearch?query=messi';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '89b55ce14bmsh7160029a8fa0bc8p128d3ajsn9fa7187ae5ec',
		'X-RapidAPI-Host': 'pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com'
	}
};

try {
            const response = await fetch(url, options);
            const result = await response.json();
            // console.log(result.resource_response);
            const photos = result.resource_response.results;
            // console.log(photos);
            photos.forEach(pintrestImg);
        } catch (error) {
            console.error(error);
        }
    }

    // getPintrestImages();

    function pintrestImg(value){
        console.log(value.images)
        let img_element = document.createElement('div');
        let img = document.createElement('img');
        let img_link = document.createElement('a');
        let img_caption = document.createElement('a');
        // img_link.href = value.links.html;
        img_link.setAttribute('target','_blank');
        img.src = value.images["170x"].url;
        // img.alt = value.alt_description;
        // img_caption.textContent = value.alt_description;
        img_link.appendChild(img);
        img_element.appendChild(img_link);
        img_element.appendChild(img_caption);
        // img_caption.href = value.links.html;
        img_caption.setAttribute('target','_blank');
        img_container.appendChild(img_element);
        img_element.classList.add('img-element');
        img.classList.add('img-fluid');
        img_element.classList.add('m-2');
        img.setAttribute('loading','lazy');
        img_link.classList.add('image');
    }


