const accessKey = '7ql83tQLftOOvA1jNM3k0JF6CKpJ1_WSZW_qeH6g-AM';
let currentQuery = '';
let currentPage = 1;

document.getElementById('search-button').addEventListener('click', function() {
    searchImages();
});

// Add event listener for "Enter" key press
document.getElementById('search-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchImages();
    }
});

document.getElementById('show-more-button').addEventListener('click', function() {
    currentPage++; // Increase page number
    fetchImages(currentQuery, currentPage); // Fetch next set of images
});

function searchImages() {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        currentQuery = query; // Save the current query
        currentPage = 1; // Reset the page number for a new search
        fetchImages(query, currentPage);
    } else {
        alert("Please enter a search term.");
    }
}

function fetchImages(query, page) {
    fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page}&client_id=${accessKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const imageGrid = document.getElementById('image-grid');

            if (page === 1) {
                imageGrid.innerHTML = ''; // Clear images if it's a new search
            }

            if (data.results.length === 0 && page === 1) {
                imageGrid.innerHTML = '<p>No images found. Try a different search.</p>';
                document.getElementById('show-more-button').style.display = 'none';
                return;
            }

            data.results.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.urls.small;
                imageGrid.appendChild(imgElement);
            });

            // Show "Show More" button only if there are more results
            if (data.total_pages > currentPage) {
                document.getElementById('show-more-button').style.display = 'inline-block';
            } else {
                document.getElementById('show-more-button').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching the images:', error);
        });
}
