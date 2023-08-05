// Sample data for demonstration purposes
let posts = [
    { text: 'This is a sample post!', imageUrl: '' },
    // Add more sample posts here



    
];

function displayPosts() {
    const postContainer = document.querySelector('.post-container');
    postContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const textElement = document.createElement('p');
        textElement.textContent = post.text;
        postElement.appendChild(textElement);

        if (post.imageUrl) {
            const imageElement = document.createElement('img');
            imageElement.classList.add("imgShow");
            imageElement.src = post.imageUrl;
            postElement.appendChild(imageElement);
        }

        postContainer.appendChild(postElement);
    });
}

function createPost() {
    const text = document.querySelector('.post-form textarea').value;
    const fileInput = document.querySelector('.post-form input[type="file"]');
    let imageUrl = '';

    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        imageUrl = URL.createObjectURL(file);
    }

    posts.push({ text, imageUrl });
    displayPosts();
}

// Initial display of posts
displayPosts();
