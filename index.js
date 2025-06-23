const BASE_URL = "http://localhost:3000/posts";


//add new post
function addNewPostListener(){
    const form = document.getElementById("new-post-form");
    form.addEventListener("submit", function (event){
        event.preventDefault(); 

        const title = document.getElementById("title").value;
        const author =document.getElementById("author").value;
        const image = document.getElementById("image").value;
        const content = document.getElementById("content").value;

        const newPost = {title, author, image, content};
        fetch (BASE_URL,{
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(newPost)
        })
        .then(() => {
          form.reset();  
          displayPosts();
        });
    });
    document.getElementById("cancel-button").addEventListener("click", () => form.reset()); 
}

//display all posts
function displayPosts(){
    fetch(BASE_URL)
    .then(response => response.json())
    .then(posts => {
        const list = document.getElementById("post-list");
        list.innerHTML =""; 
        posts.forEach(post => {
            const div = document.createElement("div");
            div.textContent = `${post.title} by ${post.author}`;
            div.addEventListener("click", () => handlePostClick (post.id));
            list.appendChild(div);
        });
    });
}
//handle post click to show a single
function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then((response) => response.json())
    .then((post) => {
      const detail = document.getElementById("post-details");
      detail.innerHTML = "";

      const title = document.createElement("h2");
      title.textContent = post.title;

      const author = document.createElement("h3");
      author.textContent = `by ${post.author}`;

      const image = document.createElement("img");
      image.src = post.image;
      image.alt = post.title;
      image.style.maxWidth = "100%";
      image.style.height = "auto";

      const content = document.createElement("p");
      content.textContent = post.content;
//edit button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editPost(post.id));
//delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deletePost(post.id));
//append all elements to the detail section
      detail.append(title, author, image, content, editButton, deleteButton);
    });
}

// Delete a post
function deletePost(id) {
  if (confirm("Are you sure you want to delete this post?")) {
    fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    }).then(() => {
      displayPosts();
      document.getElementById("post-details").innerHTML = "";
    });
  }
}

// Edit a post
function editPost(id) {
    //prompt user for new details
  const title = prompt("Enter new title:");
  const image = prompt("Enter new image URL:");
  const content = prompt("Enter new content:");

  const updatedPost = { title, image, content };
//PATCH request to edit the post
  fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPost),
  }).then(() => {
    displayPosts();
    handlePostClick(id);
  });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    addNewPostListener();
    displayPosts();
});

        