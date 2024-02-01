class ImageSearch {
    constructor() {
        this.pgCount = 0;
        this.accessKey = "KL7bSNfzkmWueulyi4QXA8byTN-CaIHMLIIxoENZLw0";
        this.inputText = document.getElementById('search-input');
        this.searchBtn = document.getElementById("search-btn");
        this.nextBtn = document.getElementById("next");
        this.imgContainer = document.getElementById('container');
        this.spinner = document.createElement('div');
        this.emptyMsg = document.getElementById("end");
        this.initialize();
    }

    initialize() {
        this.searchBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            this.pgCount = 1;
            await this.getData();
        });

        this.nextBtn.addEventListener("click", async (event) => {
            event.preventDefault();
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
        console.log(this.pgCount);
        const inputdata = this.inputText.value.toLowerCase();

        if (inputdata.length === 0) {
            return alert("Please Enter Text");
        }

        const unsplashurl = `https://api.unsplash.com/search/photos?page=${this.pgCount}&query=${inputdata}&client_id=${this.accessKey}`;
        
        try {
            if (this.pgCount === 1) {
                this.imgContainer.innerHTML = "";
            }

            this.showSpinner();

            const response = await fetch(unsplashurl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            this.hideSpinner();

            const photos = data.results;
            this.displayImages(photos);
        } catch (e) {
            this.handleError(e);
        }
    }

    displayImages(images) {
        if (images.length === 0) {
            alert("No more images");
            return;
        }

        const matches = this.filterImages(images);
        matches.sort(this.sortByFreshness);
        matches.forEach((image) => this.imageMount(image));

        if (this.pgCount > 0) {
            this.nextBtn.style.display = 'block';
        }
    }

    filterImages(images) {
        const inputdata = this.inputText.value.toLowerCase();
        return images.filter(photo => {
            const regex = new RegExp(`${inputdata}`, 'gi');
            return photo.slug.match(regex) || photo.alt_description.match(regex);
        });
    }

    imageMount(value) {
        const imgElement = document.createElement('div');
        const img = document.createElement('img');
        const imgLink = document.createElement('a');
        const imgCaption = document.createElement('a');

        // Set attributes and content
        imgLink.href = value.links.html;
        imgLink.setAttribute('target', '_blank');
        img.src = value.urls.small;
        img.alt = value.alt_description;
        imgCaption.textContent = value.alt_description;

        // Append elements
        imgLink.appendChild(img);
        imgElement.appendChild(imgLink);
        imgElement.appendChild(imgCaption);
        imgCaption.href = value.links.html;
        imgCaption.setAttribute('target', '_blank');
        this.imgContainer.appendChild(imgElement);

        // Add CSS classes
        imgElement.classList.add('img-element', 'm-2');
        img.classList.add('img-fluid');
        imgLink.classList.add('image');

        // Set loading attribute for lazy loading
        img.setAttribute('loading', 'lazy');
    }
    parseISODate(isoDateString){
        return new Date(isoDateString);
    }
    sortByFreshness(a, b) {
        const dateA = this.parseISODate(a.created_at);
    const dateB = this.parseISODate(b.created_at);
    return dateB - dateA;
    }

    isBottomOfPage(){
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
    
        return scrollTop + windowHeight >= documentHeight; // Adjust 200 to your liking
    }

    showSpinner() {
        this.spinner.innerHTML = `<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>`;
        this.imgContainer.appendChild(this.spinner);
    }

    hideSpinner() {
        this.spinner.innerHTML = "";
    }

    handleError(error) {
        alert("Something went wrong. Please try again.");
        this.hideSpinner();
        console.error('Error:', error.message);
    }
}

// Create an instance of the ImageSearch class
const imageSearchApp = new ImageSearch();
