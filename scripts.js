const apiKey = process.env.NEWS_API_KEY;
let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
let category = null;
const newsDiv = document.querySelector('#news');
const h2 = document.querySelector('#h2');
let language = 'ENGLISH';
const sidelineDetailsHolder = document.querySelector('#sidelineDetailsHolder');
const todaysDate = new Date();
const formattedDate = todaysDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});



async function fetchNews() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('There was an error!', error);
    }
}

function displayNews(articles) {
    getMainContent(articles);
    getSidebar(articles);
}

function getMainContent(articles) {
    const date = document.createElement('p');
    date.id = "date";
    date.textContent = formattedDate;
    const lang = document.createElement('p');
    lang.id = "lang";
    lang.textContent = language;
    h2.appendChild(date);
    h2.appendChild(lang);

    for (const article of articles) {
        const imgdetails = document.createElement('div');
        const details = document.createElement('div');
        const detailsUL = document.createElement('ul');
        const line = document.createElement('div');
        imgdetails.id = "imgdetails";
        details.id = "details";
        line.className = "lineFourth";

        const title = document.createElement('h2');
        title.className = "newsHeadline";
        title.textContent = article.title;
        newsDiv.appendChild(title);

        const newsImage = document.createElement('img');
        if (article.urlToImage === null) {
            newsImage.src = 'default.jpeg';

        } else {
            newsImage.src = article.urlToImage;
        }
        imgdetails.appendChild(newsImage);


        const content = document.createElement('li');

        if (article.content) {
            content.textContent = (article.content);
            detailsUL.appendChild(content);
        }

        const description = document.createElement('li');
        description.textContent = article.description;
        detailsUL.appendChild(description);

        const source = document.createElement('li');
        source.textContent = (`Source: ${article.source.name}`);
        detailsUL.appendChild(source);

        const author = document.createElement('li');

        if (article.author) {
            author.textContent = (`Author: ${article.author}`);
            detailsUL.appendChild(author);
        }

        const underline = document.createElement('hr');

        details.appendChild(detailsUL);
        imgdetails.appendChild(details);
        newsDiv.appendChild(imgdetails);
        line.appendChild(underline);
        newsDiv.appendChild(line);
    }
}

function clearMainContent() {
    while (newsDiv.firstChild) {
        newsDiv.removeChild(newsDiv.firstChild);
    }
    while (h2.firstChild) {
        h2.removeChild(h2.firstChild);
    }
    while (sideline.firstChild) {
        sideline.removeChild(sideline.firstChild);
    }
}

function getSidebar(articles) {
    const sideline = document.querySelector('#sideline');
    let i = 5;
    for (const article of articles) {
        if (i > 0) {
            const sumList = document.createElement('ul');
            sumList.id = 'sumList';
            const listItem = document.createElement('li');
            const lnTime = document.createElement('h4');
            lnTime.textContent = (time_ago(article.publishedAt));
            const lnTitle = document.createElement('p');
            lnTitle.textContent = (article.title);

            const underline2 = document.createElement('hr');
            const holdLine = document.createElement('div');
            holdLine.className = "lineThird";
            holdLine.appendChild(underline2);

            listItem.appendChild(lnTime);
            listItem.appendChild(lnTitle);
            sumList.appendChild(listItem);
            sumList.appendChild(holdLine);
            sideline.appendChild(sumList);


            sidelineDetailsHolder.appendChild(sideline);


            i--;
        }
    }
}

function time_ago(time) {

    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    var time_formats = [
        [60, 'seconds', 1],
        [120, '1 minute ago', '1 minute from now'],
        [3600, 'minutes', 60],
        [7200, '1 hour ago', '1 hour from now'],
        [86400, 'hours', 3600],
        [172800, 'Yesterday', 'Tomorrow'],
        [604800, 'days', 86400],
        [1209600, 'Last week', 'Next week'],
        [2419200, 'weeks', 604800],
        [4838400, 'Last month', 'Next month'],
        [29030400, 'months', 2419200],
        [58060800, 'Last year', 'Next year'],
        [2903040000, 'years', 29030400],
        [5806080000, 'Last century', 'Next century'],
        [58060800000, 'centuries', 2903040000]
    ];
    var seconds = (todaysDate - time) / 1000,
        token = 'ago',
        list_choice = 1;

    if (seconds == 0) {
        return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    var i = 0, format;
    while (format = time_formats[i++]) {
        if (seconds < format[0]) {
            if (typeof format[2] == 'string') {
                return format[list_choice];
            } else {
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        }
    }
    return time;

}

async function getNewsDisplay(category) {
    if ((category === null) || (category == 'us')) {
        try {
            clearMainContent();
            let dataJson = await fetchNews();
            displayNews(dataJson.articles);
        } catch (err) {
            console.log(err);
        }
    } else if (category === 'cn') {
        try {
            clearMainContent();
            url = `https://newsapi.org/v2/top-headlines?country=cn&apiKey=${apiKey}`;
            let dataJson = await fetchNews();
            console.log(dataJson);
            displayNews(dataJson.articles);
        } catch (err) {
            console.log(err);
        }
    } else if (category === 'ru') {
        try {
            clearMainContent();
            url = `https://newsapi.org/v2/top-headlines?country=ru&apiKey=${apiKey}`;
            let dataJson = await fetchNews();
            console.log(dataJson);
            displayNews(dataJson.articles);
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log('error');
    }
}

function changeCategory(cat, lang) {
    category = cat;
    language = lang,
        getNewsDisplay(category);
}
document.querySelector('#us').addEventListener('click', () => { changeCategory('us', 'ENGLISH') });
document.querySelector('#cn').addEventListener('click', () => { changeCategory('cn', '中文') });
document.querySelector('#ru').addEventListener('click', () => { changeCategory('ru', 'русский') });

document.querySelector('#body').addEventListener("load", getNewsDisplay(category));