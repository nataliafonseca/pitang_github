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
    return [user, repos];
  }
}

async function searchUser(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
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
}
