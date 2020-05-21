/* eslint-disable */
/* Magic Mirror
 * Module: RBTV Sendeplan
 *
 * By Julian Kern https://juliankern.com
 * MIT Licensed.
 */

const formatDateToTime = (date) => {
    let hours = '' + new Date(date).getHours();
    let minutes = '' + new Date(date).getMinutes();

    if (hours.length === 1) hours = '0' + hours;
    if (minutes.length === 1) minutes = '0' + minutes;

    return `${hours}:${minutes}`;
}

const formatSecondsToDuration = (seconds) => {
    const allMinutes = seconds / 60;
    const hours = Math.floor(allMinutes / 60);
    const remainingMinutes = allMinutes - (hours * 60);

    if (!hours) return `${remainingMinutes} Min`;

    return `${hours} Std ${remainingMinutes} Min`;
}

const showTemplate = function (show, i) { return `
    <div 
        class="rbtv-sp--show${i === 0 ? ' rbtv-sp--show__current':''}${show.type === 'premiere' ? ' rbtv-sp--show__premiere':''}${show.type === 'live' ? ' rbtv-sp--show__live':''}"
        style="width:${this.config.showWidth}"
    >
        ${
            this.config.showImages && show.episodeImages.length > 1 ? `
                <div 
                    class="rbtv-sp--show--image${this.config.imageGrayscale ? ' rbtv-sp--show--image__grayscale' : ''}" 
                    style="width:${this.config.imageWidth};background-image:url(${show.episodeImages[1].url})"
                ></div>
            `: ''
        }
        <div class="rbtv-sp--show--content">
            <div class="rbtv-sp--show--time">
                ${i === 0 ? `<strong>JETZT</strong> (seit ${formatDateToTime(show.timeStart)})` : formatDateToTime(show.timeStart)}
                <div class="rbtv-sp--show--duration">${formatSecondsToDuration(show.duration)}</div>
            </div>
            <div class="rbtv-sp--show--title">${show.title}</div>
            <div class="rbtv-sp--show--description">${show.topic}</div>
        </div>
    </div>
`};

Module.register('MMM-rbtv-sendeplan', {

    // Default module config.
    defaults: {
        updateInterval: 30 * 1000,
        maxNewItems: 5,
        // maxOldItems: 1,
        initialLoadDelay: 0,
        showWidth: '400px',
        imageWidth: '100px',
        imageGrayscale: false,
        showImages: true,
        fontScale: 1
    },

    start: function () {
        Log.info('Starting module: ' + this.name);

        this.shows = [];

        this.scheduleUpdate(this.config.initialLoadDelay);
    },

    getDom: function () {
        const wrapper = document.createElement('div');
        if (!this.shows.length) return wrapper;

        wrapper.style.setProperty('--font-scale', this.config.fontScale);
        wrapper.classList.add('rbtv-sp');

        this.shows.forEach((show, i) => {
            wrapper.innerHTML += showTemplate.call(this, show, i);
        });

        return wrapper;
    },

    getStyles: function () {
        return ['MMM-rbtv-sendeplan.css'];
    },

    scheduleUpdate: function (delay) {
        let nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        Log.info(`Scheduling update for ${this.name} in ${nextLoad}ms`);

        setTimeout(() => {
            this.updateSendeplan();
        }, nextLoad);
    },

    updateSendeplan: async function () {
        let result;

        try {
            result = await this.request(`/schedule/normalized?startDay=${Math.round((Date.now() - (24 * 60 * 60 * 1000)) / 1000)}&endDay=${Math.round((Date.now() + (14 * 24 * 60 * 60 * 1000)) / 1000)}`);
        } catch (e) {
            Log.error('Encountered error loading shows, retrying...');

            return this.scheduleUpdate(); 
        }

        const allShows = result.data
            .map(day => day.elements)
            .flat()
            .filter(show => new Date(show.timeEnd).getTime() > Date.now())
            .slice(0, this.config.maxNewItems + 1);

        this.shows = allShows;
        Log.info(`updated shows for ${this.name}`);
        this.updateDom();

        this.scheduleUpdate();
    },

    request: function(path) {
        const baseUrl = 'https://api.rocketbeans.tv/v1';

        let rq = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
            rq.open('GET', baseUrl + path, true);
            rq.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        return resolve(JSON.parse(this.response));
                    }

                    reject();
                }
            };
            rq.send();
        })
    }
});