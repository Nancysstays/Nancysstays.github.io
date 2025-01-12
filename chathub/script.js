// class to fetch data from the rss feed at https://www.pornhub.com/video/webmasterss the data comes with a title, description, image, and iframe.
// link - https://www.pornhub.com/view_video.php?viewkey=67245411a81ed
// image - https://ei.phncdn.com/videos/202411/01/459910691/original/(m=e0YHGgaaaa)(mh=ulVEVSBZ38x_d7hj)9.jpg 
// image - https://ei.phncdn.com/videos/202411/01/459910691/original/(m=eaf8Ggaaaa)(mh=eJ0VUwRkgfG0HhuM)9.jpg  
// iframe - <iframe src=""></iframe>
class Hub {
    constructor() {
        this.url = 'https://www.pornhub.com/video/webmasterss';
        this.data = [];
    }

    async fetch() {
        const response = await fetch(this.url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const items = doc.querySelectorAll('item');
        items.forEach(item => {
            const title = item.querySelector('title').textContent;
            const description = item.querySelector('description').textContent;
            const image = item.querySelector('image').textContent;
            const iframe = item.querySelector('embed').getAttribute('src');
            this.data.push({ title, description, image, iframe });
        });
    }

    get() {
        return this.data;
    }

    async init() {
        await this.fetch();
    }

    async render() {
        await this.init();
        const container = document.querySelector('.container');
        this.data.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <img src="${item.image}" alt="${item.title}">
                <iframe src="${item.iframe}"></iframe>
            `;
            container.appendChild(div);
        });
    }

}

class App {
    constructor() {
        this.hub = new Hub();
    }

    async init() {
        await this.hub.render();
    }
}

