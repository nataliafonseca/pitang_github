const RECENT_SEARCHES_KEY = "recent_searches";

async function saveToStorage({ username, name, avatar_url }) {
  const storage = await JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY));
  if (!storage) {
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify([{ username, name, img: avatar_url }])
    );
  } else {
    user_exists = storage.find((user) => user.username === username);

    if (!user_exists) {
      storage.push({ username, name, img: avatar_url });
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(storage));
    }
  }
}

async function addRecentSearchHTML() {
  const storage = await JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY));

  if (storage) {
    const recentSearches = document.getElementById("recent_searches");

    let list = "";
    storage.forEach((user) => {
      list += `<button onclick="searchUser('${
        user.username
      }')" class="btn btn-outline-secondary me-3"><img class="rounded-circle" width="30" height="30" src="${
        user.img
      }" alt="${
        user.name || user.username
      }'s profile picture"><span class="ms-2">${
        user.name || user.username
      }</span></button>`;
    });

    recentSearches.innerHTML = list;
  }
}

async function fetchGithub(username) {
  const userResponse = await fetch(`https://api.github.com/users/${username}`);
  const user = await userResponse.json();

  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos`
  );
  const repos = await reposResponse.json();

  if (user.message === "Not Found") {
    alert("User not found. Insert a valid github username!");
  } else {
    saveToStorage({ username, name: user.name, avatar_url: user.avatar_url });
    return [user, repos];
  }
}

async function search(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  searchUser(username);
}

async function searchUser(username) {
  const [user, repos] = await fetchGithub(username.trim());

  const githubFullname = document.getElementById("github_fullname");
  const githubUsername = document.getElementById("github_username");
  const githubBio = document.getElementById("github_bio");
  const githubPhoto = document.getElementById("github_photo");
  const githubRepos = document.getElementById("github_repos");

  githubFullname.textContent = user.name;
  githubUsername.textContent = user.login;
  githubBio.textContent = user.bio;
  githubPhoto.src = user.avatar_url;
  githubPhoto.alt = `${user.name}'s profile picture`;

  let reposLi = "";
  repos.forEach((repo) => {
    if (repo.description) {
      reposLi += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a> - ${repo.description}</li>`;
    } else {
      reposLi += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`;
    }
  });
  githubRepos.innerHTML = reposLi;
  addRecentSearchHTML();
}

addRecentSearchHTML();
