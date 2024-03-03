 // JavaScript to mark the currently playing episode
        const episodeItems = document.querySelectorAll('.episode-list li');
           // JavaScript to fetch and populate episode data
        const episodeList = document.getElementById('episode-list-ul');
        const videoIframe = document.getElementById('video-iframe');

        const params = new URLSearchParams(window.location.search);
        const movieId = parseInt(params.get("id"));

        // Construct the URL for the JSON file based on the movie ID
        const jsonFileUrl = `../db/movie_7.json`;

        fetch('../db/movie_9.json')
            .then(response => response.json())
            .then(data => {
                data.forEach((episode, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = ` ${episode.name}`;
                    listItem.addEventListener('click', () => {
                        // Remove the 'playing' class from all items
                        const episodeItems = document.querySelectorAll('.episode-list li');
                        episodeItems.forEach(item => {
                            item.classList.remove('playing');
                        });

                        // Add the 'playing' class to the clicked item
                        listItem.classList.add('playing');

                        // Set the iframe source to the selected episode's link
                        videoIframe.src = episode.link;
                    });

                    episodeList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching episode data:', error);
            });

        episodeItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Remove the 'playing' class from all items
                episodeItems.forEach((item) => {
                    item.classList.remove('playing');
                });

                // Add the 'playing' class to the clicked item
                item.classList.add('playing');
            });
        });
