class ImageSearchApp {
    constructor() {
        this.accessKey = "KL7bSNfzkmWueulyi4QXA8byTN-CaIHMLIIxoENZLw0";
        this.inputText = document.getElementById('search-input');
        this.searchBtn = document.getElementById("search-btn");
        this.prevBtn = document.getElementById("prev");
        this.nextBtn = document.getElementById("next");
        this.imgContainer = document.getElementById('container');
        this.spinner = document.createElement('div');
        this.spinner.classList.add('text-center');
        this.empty = document.getElementById("end");

        this.inputData = "";
        this.count = 0;
        this.pageCount = 0;

        this.searchBtn.addEventListener("click", (event) => {
            this.pageCount = 1;
            event.preventDefault();
            this.getData();
        });

        window.addEventListener('scroll', () => {
            if (this.isBottomOfPage()) {
                this.pageCount++;
                this.getData();
            }
        });
    }

    async getData() {
        console.log(this.pageCount);
        this.inputData = this.inputText.value.toLowerCase();
        if (this.inputData.length === 0) {
            return alert("Please Enter Text");
        }

        if (!/^[a-zA-Z]+$/.test(this.inputData)) {
            return alert("Please enter a valid keyword");
        }

        try {
            if (this.pageCount === 1) {
                this.imgContainer.innerHTML = "";
            }

            this.spinner.innerHTML = `<div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>`;
            document.body.appendChild(this.spinner);

            // Get Images from Different APIs
            try {
                // await this.getUnsplashImages();
            } catch (e) {
                console.log(e);
            }
            try {
                // await this.getPintrestImages();
            } catch (e) {
                console.log(e);
            }
            try {
                // await this.getFlickrImages();
            } catch (e) {
                console.log(e);
            }
            try {
                // await this.getPexelImages();
            } catch (e) {
                console.log(e);
            }
            try {
                await this.getInstagramImages();
            } catch (e) {
                console.log(e);
            }

            this.spinner.innerHTML = "";
            if (this.count === 0) {
                alert("No results Found");
            }
        } catch (e) {
            this.spinner.innerHTML = "";
            console.error(e);
        }
    }

    async getUnsplashImages() {
        const unsplashUrl = `https://api.unsplash.com/search/photos?page=${this.pageCount}&query=${this.inputData}&client_id=${this.accessKey}`;
        const response = await fetch(unsplashUrl);
        const data = await response.json();
        let photos = data.results;
        this.count += photos.length;
        let matches = photos.filter(photo => {
            const regex = new RegExp(`${this.inputData}`, 'gi');
            return photo.slug.match(regex) || photo.alt_description.match(regex);
        });
        // matches.sort(this.sortByFreshness);
        matches.forEach(photo => this.createAndAppendImage(photo, "Unsplash"));
    }

    async getPintrestImages() {
        const url = `https://pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com/api/basesearch=$${this.inputData}?`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'f16ae3577emsh144fb768e88cb9cp1641b1jsnfe14f5bb7af4',
                'X-RapidAPI-Host': 'pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com'
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();
        const photos = data.resource_response.results;
        this.count += photos.length;
        photos.forEach(photo => this.createAndAppendImage(photo, "Pinterest"));
    }


    async getFlickrImages() {
        const flickrUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3701d6bf2e4d3c9789beaa053a5ab400&tags=${this.inputData}&format=json&nojsoncallback=1`;
        const response = await fetch(flickrUrl);
        const data = await response.json();
        let photos = data.photos.photo;
        this.count += photos.length;
        photos = photos.slice(0, 50);
        photos.forEach(photo => this.createAndAppendImage(photo, "Flickr"));
    }

    async getPexelImages() {
        const pexelUrl = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${this.inputData}&locale=en-US&per_page=30&page=${this.pageCount}`;
        const pexelOptions = {
            method: 'GET',
            headers: {
                Authorization: 'StETECaNFCtc7ohSE7o6AxkEiyrM5tnKxdzrNoWGB00NQzOVaRGjb88o',
                'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
                'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com'
            }
        };
        const response = await fetch(pexelUrl, pexelOptions);
        const data = await response.json();
        let photos = data.photos;
        this.count += photos.length;
        console.log(photos);
        photos.forEach(photo => this.createAndAppendImage(photo, "Pexels"));
    }

    async getInstagramImages() {
        const url = 'https://instagram-premium-api-2023.p.rapidapi.com/v1/hashtag/medias/top/chunk?name=cat';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'f16ae3577emsh144fb768e88cb9cp1641b1jsnfe14f5bb7af4',
                'X-RapidAPI-Host': 'instagram-premium-api-2023.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            let photos = result[0];
            this.count += photos.length;
            // console.log(result[0]);
            photos.forEach(photo => this.createAndAppendImage(photo, "Instagram"));
        } catch (error) {
            console.error(error);
        }
    }
   

    createAndAppendImage(value, source) {
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
            this.imgContainer.appendChild(colDiv);

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
                    link=value.url;
                    des = value.alt;
                    break;
                case "Instagram":
                    imageUrl = value.image_versions[0].url;
                    // des = value.node.accessibility_caption;
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

    parseISODate(isoDateString) {
        return new Date(isoDateString);
    }

    sortByFreshness(a, b) {
        const dateA = this.parseISODate(a.created_at);
        const dateB = this.parseISODate(b.created_at);
        return dateB - dateA;
    }

    isBottomOfPage() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        return scrollTop + windowHeight >= documentHeight;
    }
}

// Initialize the app
const imageSearchApp = new ImageSearchApp();
