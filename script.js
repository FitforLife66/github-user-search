const root = document.documentElement;
const body = document.querySelector('body');
const header = document.querySelector('#header');
const themeBtn = document.querySelector('#theme-btn');
const themeBtnLabel = document.querySelector('#theme-btn-label');
const search = document.querySelector('#search');
const searchInput = document.querySelector('#search__input');
const searchBtn = document.querySelector('#search__btn');
const userWrapper = document.querySelector('#user-wrapper');
const userLinksIcons = document.querySelectorAll('.user-links__icon');

const nameEl = document.getElementById('js-name');
const loginEl = document.getElementById('js-login');
const avatarEl = document.getElementById('js-avatar');
const createdEl = document.getElementById('js-created');
const bioEl = document.getElementById('js-bio');
const reposEl = document.getElementById('js-repos');
const followersEl = document.getElementById('js-followers');
const followingEl = document.getElementById('js-following');
const locationEl = document.getElementById('js-location');
const twitterEl = document.getElementById('js-twitter');
const blogEl = document.getElementById('js-blog');
const htmlUrlEl = document.getElementById('js-html-url');

const na = 'Not Available';

//  Functions
//  ============================================================ 

// Reset user data
function initData() {
    nameEl.textContent = 'No Name';
    loginEl.textContent = na;
    avatarEl.src = './assets/user-img.svg';
    createdEl.textContent = '';
    bioEl.textContent = '';
    reposEl.textContent = '0';
    followersEl.textContent = '0';
    followingEl.textContent = '0';
    locationEl.textContent = na;
    twitterEl.textContent = na;
    blogEl.textContent = na;
    htmlUrlEl.textContent = na;
}

//  Disalbe pointer-event on Not Available links
function disalbeNALinks() {
    const userLinkWrapper = document.querySelectorAll('.user-link-wrapper');
    userLinkWrapper.forEach(item => {
        if(item.querySelector('a').textContent === 'Not Available') {
            item.classList.add('na');          
        } else {
            item.classList.remove('na');
        }
    });
}

initData();
disalbeNALinks();

//  Rendering the user data
//  ============================================================

async function getUserData(user) {
    const url = `https://api.github.com/users/${user}` 
    const response = await fetch(url);
    if(response.ok) {
        return await response.json();
    } else {
        searchBtn.setAttribute('data-no-result', 'No result');
        return false;
    }
}

async function renderUserData(user) {

    const {login, avatar_url, bio, blog, created_at, followers, following, html_url, location, name, public_repos, twitter_username} 
        = await getUserData(user)
        .catch(error => console.log('Got an Error somewhere'));     

    initData();

    //  Rendering user data or default content if values is not available
    if(login) {    
        if(name) nameEl.textContent = name;
        loginEl.textContent = `@${login}`;
        avatarEl.src = avatar_url;
        const dateFormat = {year: 'numeric', month: 'short', day: 'numeric'};
        const date = new Date(created_at).toLocaleDateString('en-GB', dateFormat);
        createdEl.textContent = `Joined ${date}`;   
        bioEl.textContent = bio;     
        if(public_repos) reposEl.textContent = public_repos;
        if(followers) followersEl.textContent = followers;
        if(following) followingEl.textContent = following;
        if(location) locationEl.textContent = location;
        if(twitter_username) {
            twitterEl.textContent = twitter_username;
            twitterEl.href = `https://twitter.com/${twitter_username}`
        }    
        if(blog) {      
            if(window.innerWidth >= 600) 
                (blog.length > 15) ? blogString = `${blog.slice(0, 16)}...` : blogString = blog;
            else           
                (blog.length > 30) ? blogString = `${blog.slice(0, 31)}...`  : blogString = blog;
            blogEl.textContent = blogString;
            blogEl.href = blog;
        } 
        htmlUrlEl.textContent = `@${login}`;
        htmlUrlEl.href = html_url;
    }

    disalbeNALinks();
}    


//  Search functionality
//  ============================================================

//  Reset input field on click
searchInput.addEventListener('click', (event) => {
    searchBtn.setAttribute('data-no-result', '');
    event.target.value = '';
});

//  Search on click or keyboard "enter"     
function searchUser(event) {
    renderUserData(searchInput.value)
        .catch(error => console.log('got an error' + error));
}

searchBtn.addEventListener('click', searchUser);

search.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') searchUser();
})


//  Theme toggle 
//  ============================================================

const clrVeryDarkBlue = '#141d2f';
const clrDarkBlue = '#1e2a47';
const clrLightGray = '#979797';
const filterToggleHover = 'brightness(0) saturate(100%) invert(76%) sepia(7%) saturate(2565%) hue-rotate(191deg) brightness(86%) contrast(91%)';
const filterSVGWhite = 'brightness(0) saturate(100%) invert(94%) sepia(9%) saturate(7%) hue-rotate(52deg) brightness(107%) contrast(100%)';
let toggle = '';

function setTheme() {

    toggle = localStorage.getItem('Toggle');

    if(toggle === 'checked') {       
        root.style.setProperty('--clr-body-bg', clrVeryDarkBlue);
        root.style.setProperty('--clr-logo', 'white');
        root.style.setProperty('--cls-content-bg', clrDarkBlue);
        root.style.setProperty('--clr-card-bg', clrDarkBlue);
        root.style.setProperty('--clr-bold-txt', 'white');
        root.style.setProperty('--clr-txt', 'white');
        root.style.setProperty('--clr-txt2', 'white');
        root.style.setProperty('--filter-toogle-hover', filterToggleHover); 
        themeBtnLabel.children[0].textContent = 'Light';  
        themeBtnLabel.children[1].setAttribute('src', './assets/icon-sun.svg')
        search.style.boxShadow = "none";
        userWrapper.style.boxShadow = "none";     
        userLinksIcons.forEach(element => element.style.setProperty('filter', filterSVGWhite));

    } else {
        root.style.removeProperty('--clr-body-bg');
        root.style.removeProperty('--clr-logo');
        root.style.removeProperty('--cls-content-bg');
        root.style.removeProperty('--clr-card-bg');
        root.style.removeProperty('--clr-bold-txt');
        root.style.removeProperty('--clr-txt');
        root.style.removeProperty('--clr-txt2'); 
        root.style.removeProperty('--filter-toogle-hover'); 
        themeBtnLabel.children[0].textContent = 'Dark'; 
        themeBtnLabel.children[1].setAttribute('src', './assets/icon-moon.svg') 
        search.style.boxShadow = "";
        userWrapper.style.boxShadow = "";
        userLinksIcons.forEach(element => element.style.removeProperty('filter'));
    }
}

setTheme();

themeBtn.addEventListener('click', () => {
    if(toggle === 'checked') {
        localStorage.setItem('Toggle', '')  
    } else {
        localStorage.setItem('Toggle', 'checked');
    } 
    setTheme();
});