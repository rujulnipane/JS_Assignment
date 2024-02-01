class ImageSearch {
    constructor() {
        this.accessKey = "KL7bSNfzkmWueulyi4QXA8byTN-CaIHMLIIxoENZLw0";
        this.inputText = document.getElementById('search-input');
        this.searchBtn = document.getElementById("search-btn");
        this.prevBtn = document.getElementById("prev");
        this.nextBtn = document.getElementById("next");
        this.imgContainer = document.getElementById('container');
        this.spinner = document.createElement('div');
        this.spinner.classList.add('text-center');
        this.emptyMsg = document.getElementById("end");
        this.inputData = '';
        this.count = 0;
        this.pgCount = 0;

        this.initialize();
    }

    initialize() {
        this.searchBtn.addEventListener("click", async () => {
            this.pgCount = 1;
            await this.getData();
        });

        this.nextBtn.addEventListener("click", async () => {
            this.pgCount++;
            await this.getData();
        });

        window.addEventListener('scroll', async () => {
            if (this.isBottomOfPage()) {
                this.pgCount++;
                await this.getData();
            }
        });
    }

    async getData() {
        this.inputData = this.inputText.value.toLowerCase();

        if (this.inputData.length === 0) {
            return alert("Please Enter Text");
        }

        if (!/^[a-zA-Z]+$/.test(this.inputData)) {
            return alert("Please enter valid keyword");
        }

        try {
            if (this.pgCount === 1) {
                this.imgContainer.innerHTML = "";
            }

            this.showSpinner();

            // Get Images from Different APIs
            await this.getUnsplashImages();
            // await this.getPinterestImages();
            // await this.getPexelImages();
            // await this.getFlickrImages();
            // await this.getInstagramImages();

            this.hideSpinner();

            if (this.count === 0) {
                alert("No results Found");
            }
        } catch (e) {
            alert("Something went wrong");
            this.hideSpinner();
            console.error(e);
        }
    }

    async getUnsplashImages() {
        const unsplashurl = `https://api.unsplash.com/search/photos?page=${this.pgCount}&query=${this.inputdata}&client_id=${this.accessKey}`;
    // this.inputdata = this.inputText.value.toLowerCase();
    const response = await fetch(unsplashurl);
    const data = await response.json();
    let photos = data.results;
    count+=photos.length;
    console.log(photos);
    let matches = photos.filter(photo => {
        const regex = new RegExp(`${this.inputdata}`, 'gi');
        return photo.slug.match(regex) || photo.alt_description.match(regex);
    });
    //    console.log(matches)
    matches.sort(this.sortByFreshness);
    // console.log(photos);
    matches.forEach(value=>this.addUnsplashImages(value));
    }

    async getPinterestImages() {
        const pinteresturl = `https://pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com/api/basesearch?query=${this.inputdata}`;
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
    count+=photos.length;
    console.log(photos);
    photos.forEach(this.addPintrestImages);
    }

    async getPexelImages() {
        const pexelurl = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${this.inputdata}&locale=en-US&per_page=30&page=${this.pgCount}`;
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
    count+=photos.length;
    photos.forEach(this.addPexelImages);
    }

    async getFlickrImages() {
        const flickrurl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3701d6bf2e4d3c9789beaa053a5ab400&tags=${this.inputdata}&format=json&nojsoncallback=1`
    const response = await fetch(flickrurl);
    const data = await response.json();
    // console.log(data);
    let photos = data.photos.photo;
    console.log(photos);
    count+=photos.length;
    photos = photos.slice(0,50);
    // let matches = photos.filter(photo => {
    //     const regex = new RegExp(`${inputdata}`, 'gi');
    //     return photo.title.match(regex);
    // });
    // console.log(matches);
    // matches.forEach(addFlickrImages);
    photos.forEach(this.addFlickrImages);
    }

    async getInstagramImages() {
        const instagramurl = `https://instagram-looter2.p.rapidapi.com/tag-feeds?query=${this.inputdata}`;
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
            count+=photos.length;
            photos.forEach(this.addInstagramImages);
        } catch (error) {
            console.error(error);
        }
    }

    isBottomOfPage() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    return scrollTop + windowHeight >= documentHeight; 
    }

    showSpinner() {
        this.spinner.innerHTML = `<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>`;
        document.body.appendChild(this.spinner);
    }

    hideSpinner() {
        this.spinner.innerHTML = "";
    }

    parseISODate(isoDateString) {
        return new Date(isoDateString);
    }
    
    sortByFreshness(a, b){
        const dateA = this.parseISODate(a.created_at);
        const dateB = this.parseISODate(b.created_at);
        return dateB - dateA;
    }

    addUnsplashImages(value) {
        let img_element = document.createElement('div');
        let img = document.createElement('img');
        let img_link = document.createElement('a');
        let img_caption = document.createElement('a');
        let icon = document.createElement('img');
        icon.classList.add('icon');
        icon.src = "./unsplash_icon.png";
        img_link.href = value.links.html;
        img_link.setAttribute('target', '_blank');
        img.src = value.urls.small;
        img.alt = value.alt_description;
        img_caption.innerHTML = "unsplash "+value.alt_description;
        img_link.appendChild(img);
        img_element.appendChild(img_link);
        img_element.appendChild(img_caption);
        img_caption.href = value.links.html;
        img_caption.setAttribute('target', '_blank');
        this.imgContainer.appendChild(img_element);
        img_element.classList.add('img-element');
        img.classList.add('img-fluid');
        img_element.classList.add('m-2');
        img.setAttribute('loading', 'lazy');
        img_link.classList.add('image');
        img_caption.appendChild(icon);
    }
    
    addFlickrImages(value) {
        let url = `https://farm${value.farm}.staticflickr.com/${value.server}/${value.id}_${value.secret}.jpg`;
        // console.log(url)
        let img_element = document.createElement('div');
        let img = document.createElement('img');
        let img_link = document.createElement('a');
        let img_caption = document.createElement('a');
        let icon = document.createElement('img');
        icon.classList.add('icon');
        icon.src = "./flickr.png";
        img_link.href = url;
        img_link.setAttribute('target', '_blank');
        img.src = url;
        // img.alt = value.alt_description;
        img_caption.textContent = "Flickr";
        img_link.appendChild(img);
        img_element.appendChild(img_link);
        img_element.appendChild(img_caption);
        // img_caption.href = value.links.html;
        img_caption.setAttribute('target', '_blank');
        this.imgContainer.appendChild(img_element);
        img_element.classList.add('img-element');
        img.classList.add('img-fluid');
        img_element.classList.add('m-2');
        img.setAttribute('loading', 'lazy');
        img_link.classList.add('image');
        img_caption.appendChild(icon);
    }
    
    addPintrestImages(value) {
        console.log(value.images)
        let img_element = document.createElement('div');
        let img = document.createElement('img');
        let icon = document.createElement('img');
        icon.classList.add('icon');
        icon.src = "./Pinterest-logo.png";
        let img_link = document.createElement('a');
        let img_caption = document.createElement('a');
        // img_link.href = value.links.html;
        img_link.setAttribute('target', '_blank');
        img.src = value.images["170x"].url;
        // img.alt = value.alt_description;
        img_caption.appendChild(icon);
        img_link.appendChild(img);
        img_element.appendChild(img_link);
        img_element.appendChild(img_caption);
        // img_caption.href = value.links.html;
        img_caption.setAttribute('target', '_blank');
        this.imgContainer.appendChild(img_element);
        img_element.classList.add('img-element');
        img.classList.add('img-fluid');
        img_element.classList.add('m-2');
        img.setAttribute('loading', 'lazy');
        img_link.classList.add('image');
    }
    
    addPexelImages(value) {
        console.log(value.images)
        let img_element = document.createElement('div');
        let img = document.createElement('img');
        let img_link = document.createElement('a');
        let img_caption = document.createElement('a');
        let icon = document.createElement('img');
        icon.classList.add('icon');
        icon.src = "./pexels_icon.png";
        // img_link.href = value.links.html;
        img_link.setAttribute('target', '_blank');
        img.src = value.src.original;
        // img.alt = value.alt_description;
        img_caption.textContent = "pexel";
        img_link.appendChild(img);
        img_element.appendChild(img_link);
        img_element.appendChild(img_caption);
        // img_caption.href = value.links.html;
        img_caption.setAttribute('target', '_blank');
        this.imgContainer.appendChild(img_element);
        img_element.classList.add('img-element');
        img.classList.add('img-fluid');
        img_element.classList.add('m-2');
        // img.setAttribute('loading', 'lazy');
        img_link.classList.add('image');
        img_caption.appendChild(icon);
    }
    
    
    
    addInstagramImages(value){
        console.log(value.images)
        let img_element = document.createElement('div');
        let img = document.createElement('img');
        let img_link = document.createElement('a');
        let img_caption = document.createElement('a');
        let icon = document.createElement('img');
        icon.classList.add('icon');
        icon.src = "./instagram.png";
        // img_link.href = value.links.html;
        img_link.setAttribute('target', '_blank');
        img.src = value.node.display_url;
        img.alt = value.node.display_url;
        img_caption.textContent = "Instagram";
        img_link.appendChild(img);
        img_element.appendChild(img_link);
        img_element.appendChild(img_caption);
        img_caption.href = value.node.display_url;
        img_caption.setAttribute('target', '_blank');
        this.imgContainer.appendChild(img_element);
        img_element.classList.add('img-element');
        img.classList.add('img-fluid');
        img_element.classList.add('m-2');
        // img.setAttribute('loading', 'lazy');
        img_link.classList.add('image');
        img_caption.appendChild(icon);
    }
    
    
}

// Create an instance of the ImageSearch class
const imageSearchApp = new ImageSearch();
