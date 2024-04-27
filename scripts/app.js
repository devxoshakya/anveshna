let left_btn = document.getElementsByClassName('bi-chevron-left')[0];
let right_btn = document.getElementsByClassName('bi-chevron-right')[0];
let cards = document.getElementsByClassName('cards')[0];
let search = document.getElementsByClassName('search')[0];
let search_input = document.getElementById('search_input');

left_btn.addEventListener('click', () => {
})
right_btn.addEventListener('click', () => {
    cards.scrollLeft += 140;
})

let json_url = "db/movie.json";

fetch(json_url).then(Response => Response.json())
    .then((data) => {
        data.forEach((ele, i) => {
            let { name, imdb, date, sposter, bposter, genre, url } = ele;
            let card = document.createElement('a');
            card.classList.add('card');
            card.href = `landing-page.html?id=${ele.id}`;
            card.innerHTML = `
            <img src="${sposter}" alt="${name}" class="poster">
            <div class="rest_card">
            </div>
            `
            cards.appendChild(card);
        });

        document.getElementById('title').innerText = data[0].name;
        document.getElementById('gen').innerText = data[0].genre;
        document.getElementById('date').innerText = data[0].date;
        document.getElementById('rate').innerHTML = `<span>IMDB</span><i class="bi bi-star-fill"></i> ${data[0].imdb}`;

        // search data  load 
        data.forEach(element => {
            let { name, imdb, date, sposter, genre, id } = element;
            let card = document.createElement('a');
            card.classList.add('card');
            card.href = `landing-page.html?id=${element.id}`;
            card.innerHTML = `
            <img src="${sposter}" alt="">
                        <div class="cont">
                            <h3>${name} </h3>
                            <p>${genre} ${date}  <span>IMDB</span><i class="bi bi-star-fill"></i> ${imdb}</p>
                        </div>
            `
            search.appendChild(card);
        });

        // search filter  

        search_input.addEventListener('keyup', () => {
            let filter = search_input.value.toUpperCase();
            let a = search.getElementsByTagName('a');

            for (let index = 0; index < a.length; index++) {
                let b = a[index].getElementsByClassName('cont')[0];
                // console.log(a.textContent)
                let TextValue = b.textContent || b.innerText;
                if (TextValue.toUpperCase().indexOf(filter) > -1) {
                    a[index].style.display = "flex";
                    search.style.visibility = "visible";
                    search.style.opacity = 1;
                } else {
                    a[index].style.display = "none";
                }
                if (search_input.value == 0) {
                    search.style.visibility = "hidden";
                    search.style.opacity = 0;
                }
            }
        })

    
        let series = document.getElementById('series');
        let movies = document.getElementById('movies');

        series.addEventListener('click', () => {
            cards.innerHTML = '';

            let series_array = data.filter(ele => {
                return ele.type === "series";
            });

            series_array.forEach((ele, i) => {
                let { id, name, imdb, date, sposter, bposter, genre, url } = ele;
                let card = document.createElement('a');
                card.classList.add('card');
                card.href = `landing-page.html?id=${ele.id}`;
                card.innerHTML = `
                <img src="${sposter}" alt="${name}" class="poster">
                <div class="rest_card">
                    <img src="${bposter}" alt="">
                    <div class="cont">
                        <h4>${name}</h4>
                        <div class="sub">
                            <p>${genre}, ${date}</p>
                            <h3><span>IMDB</span><i class="bi bi-star-fill"></i> ${imdb}</h3>
                        </div>
                    </div>
                </div>
                `
                cards.appendChild(card);
            });
        })
        movies.addEventListener('click', () => {
            cards.innerHTML = '';
            let movie_array = data.filter(ele => {
                return ele.type === "movie";
            });
            movie_array.forEach((ele, i) => {
                let { name, sposter, url } = ele;
                let card = document.createElement('a');
                card.classList.add('card');
                card.href = url;
                card.innerHTML = `
                <img src="${sposter}" alt="${name}" class="poster">
                `
                cards.appendChild(card);
            });
        })
        // Check if the user agent indicates a desktop or laptop device
        const isDesktopOrLaptop = () => {
            const userAgent = navigator.userAgent;
            return /Mac|Windows|Linux/i.test(userAgent);
        };
        // Redirect based on the device type
        if (isDesktopOrLaptop()) {
            // Device is a desktop or laptop, load your website
             // Replace 'your-website.html' with your actual website page
        } else {
            // Device is not a desktop or laptop, redirect to a 404 page
            window.location.href = '../src/main/404.html';
        }
        if( navigator.userAgent.match(/(android|blackberry|ipad|iphone|ipod|iemobile|opera mobile|palmos|webos|googlebot-mobile)/i) )
            {
            document.location.replace("/src/main/404.html");
            }
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('keydown', function (event) {
            // Check if the pressed key is the "/"
            if (event.key === '/') {
                // Prevent the "/" character from being entered in the search bar
                event.preventDefault();
    
                // Focus on the search input
                document.getElementById('search_input').focus();
            }

            if (event.ctrlKey && event.altKey && event.key === 'x') {
                // Redirect to the search.html page
                window.location.href = '/testing-features/search.html';
            }
        });
    });
// scripts/app.js

// Function to show the loader
function showLoader() {
    document.querySelector('.loader-wrapper').style.display = 'flex';
}

// Function to hide the loader
function hideLoader() {
    document.querySelector('.loader-wrapper').style.display = 'none';
}

// Show the loader when the page starts loading
showLoader();

// Wait for 2.5 seconds and then hide the loader
setTimeout(function () {
    hideLoader();
}, 2500);


