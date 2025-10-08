const addPostBtn = document.getElementById("addPostBtn");
const postModal = document.getElementById("postModal");
const closeModal = document.getElementById("closeModal");
const savePostBtn = document.getElementById("savePostBtn");
const postsContainer = document.getElementById("postsContainer");
const searchInput = document.getElementById("searchInput");
const heroPostSection = document.getElementById("heroPost");

const postTitle = document.getElementById("postTitle");
const postAuthor = document.getElementById("postAuthor");
const postContent = document.getElementById("postContent");
const postImage = document.getElementById("postImage");

let posts = JSON.parse(localStorage.getItem("miniBlogPosts")) || [];

// Display all posts + hero
function displayAll(postsToShow) {
  if (!heroPostSection || !postsContainer) return;

  if (postsToShow.length === 0) {
    heroPostSection.innerHTML = "";
    postsContainer.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  const [first, ...others] = postsToShow;
  heroPostSection.innerHTML = `
    ${first.image ? `<img src="${first.image}" alt="${first.title}">` : ""}
    <div class="hero-overlay">
      <h2>${first.title}</h2>
      <small>By ${first.author}</small>
    </div>
  `;

  postsContainer.innerHTML = "";
  others.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
      ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ""}
      <h3>${post.title}</h3>
      <small>By ${post.author}</small>
      <p>${post.content.substring(0, 100)}...</p>
      <div class="post-actions">
        <button class="read-more" onclick="location.href='post.html?id=${post.id}'">Read More</button>
        <button class="delete-btn" onclick="deletePost(${post.id})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    postsContainer.appendChild(div);
  });
}

// Delete Post
function deletePost(id) {
  if (confirm("Are you sure you want to delete this post?")) {
    posts = posts.filter((p) => p.id !== id);
    localStorage.setItem("miniBlogPosts", JSON.stringify(posts));
    displayAll(posts);
  }
}

// Save Post
if (savePostBtn) {
  savePostBtn.onclick = () => {
    const title = postTitle.value.trim();
    const author = postAuthor.value.trim();
    const content = postContent.value.trim();
    const image = postImage.value.trim();

    if (!title || !author || !content) {
      alert("Please fill in all fields!");
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      author,
      content,
      image,
    };

    posts.unshift(newPost);
    localStorage.setItem("miniBlogPosts", JSON.stringify(posts));

    postTitle.value = "";
    postAuthor.value = "";
    postContent.value = "";
    postImage.value = "";
    postModal.style.display = "none";
    displayAll(posts);
  };
}

// Search
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(value) ||
        p.author.toLowerCase().includes(value)
    );
    displayAll(filtered);
  });
}

// Modal controls
if (addPostBtn && postModal) {
  addPostBtn.onclick = () => (postModal.style.display = "flex");
  closeModal.onclick = () => (postModal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === postModal) postModal.style.display = "none";
  };
}

// Init
displayAll(posts);
// Preview selected image
const postImageFile = document.getElementById("postImageFile");
const previewImage = document.getElementById("previewImage");

if (postImageFile) {
  postImageFile.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

// Save Post with image file
savePostBtn.onclick = () => {
  const title = postTitle.value.trim();
  const author = postAuthor.value.trim();
  const content = postContent.value.trim();
  const imageSrc = previewImage.src || "";

  if (!title || !author || !content) {
    alert("Please fill in all fields!");
    return;
  }

  const newPost = {
    id: Date.now(),
    title,
    author,
    content,
    image: imageSrc,
  };

  posts.unshift(newPost);
  localStorage.setItem("miniBlogPosts", JSON.stringify(posts));

  // Clear form
  postTitle.value = "";
  postAuthor.value = "";
  postContent.value = "";
  previewImage.src = "";
  previewImage.style.display = "none";
  postImageFile.value = "";

  postModal.style.display = "none";
  displayAll(posts);
};
