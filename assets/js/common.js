// Appending Token to header for API call
let myHeaders = new Headers();
myHeaders.append("Authorization", sessionStorage.getItem("token"));

// Adding common Loader to all pages
var wrapper = document.getElementById('wrapper');
var loader = document.createElement('div');
loader.className = 'uk-icon uk-spinner';
loader.id = 'loader';
loader.setAttribute('uk-spinner', 'ratio: 3');
wrapper.prepend(loader);

// function to show loader
function showloader() {
    document.getElementById('loader').style.display = 'block';
}
// function to hide loader
function hideloader() {
    document.getElementById('loader').style.display = 'none';
}

// initalizing global variable to use current user id
var user_id = '';


// verifying user is authenticated
function verify() {
    var token = sessionStorage.getItem("token");
    if (token === null) {
        window.location.replace("./index.html");
    }
}

// function to logout which clears the token from session
function logout() {
    var x;
    a = confirm("You are about to Logout!")
    if (a) {
        sessionStorage.clear();
        window.location.href = 'index.html'
    }
}

// function to get detail of current user as well as user with id  
async function getProfileInfo() {
    showloader();
    var url = new URL(window.location.href);
    var id = url.searchParams.get('id');
    if (id == null) {
        let response = await fetch('https://spacebox-production.up.railway.app/getCurrentUser', {
            headers: myHeaders,
            method: 'Get'
        });
        let result = await response.json();

        document.getElementById('ProfilefullNameTag').innerHTML = result.first_name + ' ' + result.last_name;
        document.getElementById('ProfileBio').innerHTML = document.getElementById('bio').innerHTML;
        document.getElementById('ProfilePost').innerHTML = parseInt(document.getElementById('noOfPost').innerHTML);
        document.getElementById('ProfileFollowers').innerHTML = parseInt(document.getElementById('followers').innerHTML);
        document.getElementById('ProfileFollowing').innerHTML = parseInt(document.getElementById('following').innerHTML);

        let postProfile = document.querySelector('#all_post');
        let s = ''
        if (result.all_post.length == 0) {
            postProfile.innerHTML = 'No Post to Show';
            hideloader();
        }
        else {
            result.all_post.forEach((post, i) => {
                s += `<div>
            <div class="bg-white-500 max-w-full lg:h-64 h-40 rounded-md relative overflow-hidden uk-transition-toggle"
                tabindex="0">
                    ${(() => {
                        if (post.isImage == true) {
                            return `<img src="${post.thumbnail_url}" class="w-full h-full absolute object-cover inset-0">`
                        }
                        else {
                            if (post.thumbnail_url == ' ') {
                                return `<video src="${post.web_url}" class="w-full h-full absolute object-cover inset-0"></video>`
                            }
                            else {
                                return `<img src="${post.thumbnail_url}" class="w-full h-full absolute object-cover inset-0">`
                            }
                        }
                    })()
                    }
    
                <div
                    class="absolute bg-black bg-opacity-40 bottom-0 flex h-full items-center justify-center space-x-5 text-lg text-white uk-transition-scale-up w-full">
                    <a href="#story-modal" onclick=getStoryModalForProfile(this) class="flex items-center" data-userid='${post.user_id}' 
                    data-name='${post.first_name} ${post.last_name}' data-postLink='${post.web_url}' data-isImage=${post.isImage}
                    data-likes='${post.likes}' data-profilePic='${post.profile_pic}' data-caption='${post.caption}' data-mediaId='${post.id}'> <ion-icon name="heart"
                            class="mr-1"></ion-icon>${post.likes}</a>
                    <a href="#story-modal" uk-toggle class="flex items-center"> <ion-icon
                            name="chatbubble-ellipses" class="mr-1"></ion-icon> 30 </a>
                    </div>
        
                    </div>
                </div>`
            });
            postProfile.innerHTML = s;
            hideloader();
        }
    }
    else {
        showloader();
        let response = await fetch('https://spacebox-production.up.railway.app/getUserWithId/' + id, {
            headers: myHeaders,
            method: 'Get'
        });
        let result = await response.json();

        document.getElementById('userPicture').src = result.profile_pic;
        document.getElementById('ProfilefullNameTag').innerHTML = result.first_name + ' ' + result.last_name;
        document.getElementById('ProfileBio').innerHTML = result.bio;
        document.getElementById('ProfilePost').innerHTML = result.noOfPost;
        document.getElementById('ProfileFollowers').innerHTML = result.followers;
        document.getElementById('ProfileFollowing').innerHTML = result.following;
        document.getElementsByClassName('followButton').item(0).id = result.id;
        if (result.followed == true) {
            document.getElementsByClassName('followButton').item(0).innerHTML = 'Following';
        }
        else {
            document.getElementsByClassName('followButton').item(0).innerHTML = 'Follow';
        }

        let postProfile = document.querySelector('#all_post');
        let s = ''
        if (result.all_post.length == 0) {
            postProfile.innerHTML = 'No Post to Show';
            hideloader();
        }
        else {
            result.all_post.forEach((post, i) => {
                s += `<div>
        <div class="bg-white-500 max-w-full lg:h-64 h-40 rounded-md relative overflow-hidden uk-transition-toggle"
            tabindex="0">
                ${(() => {
                        if (post.isImage == true) {
                            return `<img src="${post.thumbnail_url}" class="w-full h-full absolute object-cover inset-0">`
                        }
                        else {
                            if (post.thumbnail_url == ' ') {
                                return `<video src="${post.web_url}" class="w-full h-full absolute object-cover inset-0"></video>`
                            }
                            else {
                                return `<img src="${post.thumbnail_url}" class="w-full h-full absolute object-cover inset-0">`
                            }
                        }
                    })()
                    }
                        <div
                            class="absolute bg-black bg-opacity-40 bottom-0 flex h-full items-center justify-center space-x-5 text-lg text-white uk-transition-scale-up w-full">
                            <a href="#story-modal" onclick=getStoryModal(this) class="flex items-center" data-userid='${post.user_id}' 
                            data-name='${post.first_name} ${post.last_name}' data-postLink='${post.web_url}' data-isImage=${post.isImage}
                            data-likes='${post.likes}' data-profilePic='${post.profile_pic}' data-caption='${post.caption}' data-mediaId='${post.id}'> <ion-icon name="heart"
                                    class="mr-1"></ion-icon>${post.likes}</a>
                            <a href="#story-modal" uk-toggle class="flex items-center"> <ion-icon
                                    name="chatbubble-ellipses" class="mr-1"></ion-icon> 30 </a>
                            </div>

                            </div>
                        </div>`
            });
            postProfile.innerHTML = s;
            hideloader();
        }
    }



}

// function to get current profile details
async function getAccountInfo() {
    showloader();
    let response = await fetch('https://spacebox-production.up.railway.app/getCurrentProfile', {
        headers: myHeaders,
        method: 'Get'
    });
    let result = await response.json();

    document.getElementById('about').value = result[0].bio
    document.getElementById('location').value = result[0].location
    $('#location').trigger('change');
    document.getElementById('dob').value = result[0].dob
    document.getElementById('gender').value = result[0].gender
    document.getElementById('first_name').value = result[1]
    document.getElementById('last_name').value = result[2]
    document.getElementById('email').value = result[3]
    if (window.location.href.indexOf('setting.html') > -1) {
        document.getElementById('frmUpdateProfile').dataset.id = result[0].user_id
        datasetID = new URL(result[0].profile_pic)
        document.getElementById('profileImgtag').dataset.imageId = datasetID.searchParams.get('id');
    }
    hideloader();
}

// common function for all pages where user detail like name profile picture and other gets populated
async function getDefaultValues() {
    showloader();
    let response = await fetch('https://spacebox-production.up.railway.app/getCurrentProfile', {
        headers: myHeaders,
        method: 'Get'
    });
    let result = await response.json();
    if (result.detail == 'Profile not found') {
        alert("Please create Profile First!!!");
        window.location.href = 'form-profileDetail.html'
    }
    user_id = result[0].user_id;

    for (let i = 0; i < document.getElementsByClassName('profilePicture').length; i++) {
        document.getElementsByClassName('profilePicture')[i].src = result[0].profile_pic;
    }
    document.getElementById('bio').innerHTML = result[0].bio
    document.getElementById('noOfPost').innerHTML = result[4]
    document.getElementById('followers').innerHTML = result[0].followers
    document.getElementById('following').innerHTML = result[0].following
    document.getElementById('fullNameTag').innerHTML = result[1] + ' ' + result[2]
    hideloader();
}


// function use to show post at feeds page
async function showPost(result, page_start) {
    showloader();
    if (page_start == 1) {
        latestPost(result.data)
        let PostCard = document.querySelector('#postCard');
        let s = ''
        result.data.forEach((post, i) => {
            res = result;
            s += `<div class="bg-white shadow rounded-md dark:bg-gray-900 -mx-2 lg:mx-0">

        <!-- post header-->
        <div class="flex justify-between items-center px-4 py-3">
            <div class="flex flex-1 items-center space-x-4">
                <a href=
                ${(() => {
                    if (post.user_id != user_id) {
                        return `"getUserDetail.html?id=${post.user_id}">`
                    }
                    else {
                        return `"#">`
                    }
                })()
                }
                    <div class="bg-gradient-to-tr from-yellow-600 to-pink-600 p-0.5 rounded-full">
                        <img src="${post.profile_pic}"
                            class="bg-gray-200 border border-white rounded-full w-8 h-8">
                    </div>
                </a>
                <span class="block capitalize font-semibold dark:text-gray-100"> ${post.first_name} ${post.last_name}
                </span>
            </div>
        </div>
        <div uk-lightbox>
        ${(() => {
                    if (post.isImage == true) {
                        return `<img src='${post.web_url}' alt=""></img>`
                    }
                    else {
                        return `<video src='${post.web_url}' controls style='margin: auto;'></video>`
                    }
                })()
                }
        </div>

        <div class="p-3 border-b dark:border-gray-700">
            <strong>${post.first_name} </strong> ${post.caption}
        </div>

        <div class="py-3 px-4 space-y-3">

            <div class="flex space-x-4 lg:font-bold">
                <div href="" class="flex items-center space-x-2" onclick="likethisPost(this)" id="${post.id}" style='cursor: pointer;'>
                    <div class="p-2 rounded-full text-${(() => {
                    if (post.liked == true) {
                        return `black`
                    }
                    else {
                        return `gray`
                    }
                })()
                }">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" width="22" height="22" class="dark:text-gray-100">
                            <path
                                d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                    </div>
                    <div>${post.likes} Like</div>
                </div>
                <a href="" class="flex items-center space-x-2 flex-1 justify-end" uk-toggle="target: #viewAllCommentsOf${i}">
                    <div class="p-2 rounded-full text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" width="22" height="22" class="dark:text-gray-100">
                            <path fill-rule="evenodd"
                                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div> Comment</div>
                </a>
            </div>
        </div>
        <div class="py-3 px-4 space-y-3" id="viewAllCommentsOf${i}" aria-hidden="true" hidden>
            <div class="border-t pt-4 space-y-4 dark:border-gray-600">
                <div class="flex">
                    <div class="w-10 h-10 rounded-full relative flex-shrink-0">
                        <img src="assets/images/avatars/avatar-1.jpg" alt=""
                            class="absolute h-full rounded-full w-full">
                    </div>
                    <div
                        class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 h-full relative lg:ml-5 ml-2 lg:mr-20  dark:bg-gray-800 dark:text-gray-100">
                        <p class="leading-6">In ut odio libero vulputate <urna class="i uil-heart">
                            </urna> <i class="uil-grin-tongue-wink"> </i> </p>
                        <div
                            class="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800">
                        </div>
                    </div>
                </div>
                <div class="flex">
                    <div class="w-10 h-10 rounded-full relative flex-shrink-0">
                        <img src="assets/images/avatars/avatar-1.jpg" alt=""
                            class="absolute h-full rounded-full w-full">
                    </div>
                    <div
                        class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 h-full relative lg:ml-5 ml-2 lg:mr-20  dark:bg-gray-800 dark:text-gray-100">
                        <p class="leading-6">Nam liber tempor cum soluta nobis eleifend option <i
                                class="uil-grin-tongue-wink-alt"></i>
                        </p>
                        <div
                            class="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800">
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 bg-gray-100 rounded-full rounded-md relative dark:bg-gray-800">
                <input type="text" placeholder="Add your Comment.."
                    class="bg-transparent max-h-10 shadow-none">
                <div
                    class="absolute bottom-0 flex h-full items-center right-0 right-3 text-xl space-x-2">
                    <a href="#"> <i class="uil-image"></i></a>
                    <a href="#"> <i class="uil-video"></i></a>
                </div>
            </div>

        </div>

    </div>
        ${(() => {
                    if (i == 3) {
                        if (res.pagination.next != null) {
                            return `<!-- Load more-->
                            <div class="flex justify-center mt-6" id="toggle">
                                <a onclick="loadPost('${res.pagination.next}')"
                                    class="bg-white dark:bg-gray-900 font-semibold my-3 px-6 py-2 rounded-full shadow-md dark:bg-gray-800 dark:text-white">
                                    Load more ..</a>
                            </div>`;
                        }
                        else {
                            return ` `
                        }
                    }
                    else {
                        return ` `;
                    }
                })()
                }
        `
        });
        PostCard.innerHTML = s;
        hideloader();
    }
    else {
        showloader();
        let PostCard = document.querySelector('#postCard');
        let s = ''
        result.data.forEach((post, i) => {
            res = result;
            s += `<div class="bg-white shadow rounded-md dark:bg-gray-900 -mx-2 lg:mx-0">

        <!-- post header-->
        <div class="flex justify-between items-center px-4 py-3">
            <div class="flex flex-1 items-center space-x-4">
                <a href=
                ${(() => {
                    if (post.user_id != user_id) {
                        return `"getUserDetail.html?id=${post.user_id}">`
                    }
                    else {
                        return `"#">`
                    }
                })()
                }
                    <div class="bg-gradient-to-tr from-yellow-600 to-pink-600 p-0.5 rounded-full">
                        <img src="${post.profile_pic}"
                            class="bg-gray-200 border border-white rounded-full w-8 h-8">
                    </div>
                </a>
                <span class="block capitalize font-semibold dark:text-gray-100"> ${post.first_name} ${post.last_name}
                </span>
            </div>
        </div>
        <div uk-lightbox>
        ${(() => {
                    if (post.isImage == true) {
                        return `<img src='${post.web_url}' alt=""></img>`
                    }
                    else {
                        return `<video src='${post.web_url}' controls style='margin: auto;'></video>`
                    }
                })()
                }
        </div>

        <div class="p-3 border-b dark:border-gray-700">
            <strong>${post.first_name} </strong> ${post.caption}
        </div>

        <div class="py-3 px-4 space-y-3">

            <div class="flex space-x-4 lg:font-bold">
                <div href="" class="flex items-center space-x-2" onclick="likethisPost(this)" id="${post.id}" style='cursor: pointer;'>
                    <div class="p-2 rounded-full text-${(() => {
                    if (post.liked == true) {
                        return `black`
                    }
                    else {
                        return `gray`
                    }
                })()
                }">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" width="22" height="22" class="dark:text-gray-100">
                            <path
                                d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                    </div>
                    <div>${post.likes} Like</div>
                </div>
                <a href="" class="flex items-center space-x-2 flex-1 justify-end" uk-toggle="target: #viewAllCommentsOf${i}">
                    <div class="p-2 rounded-full text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" width="22" height="22" class="dark:text-gray-100">
                            <path fill-rule="evenodd"
                                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div> Comment</div>
                </a>
            </div>
        </div>
        <div class="py-3 px-4 space-y-3" id="viewAllCommentsOf${i}" aria-hidden="true" hidden>
            <div class="border-t pt-4 space-y-4 dark:border-gray-600">
                <div class="flex">
                    <div class="w-10 h-10 rounded-full relative flex-shrink-0">
                        <img src="assets/images/avatars/avatar-1.jpg" alt=""
                            class="absolute h-full rounded-full w-full">
                    </div>
                    <div
                        class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 h-full relative lg:ml-5 ml-2 lg:mr-20  dark:bg-gray-800 dark:text-gray-100">
                        <p class="leading-6">In ut odio libero vulputate <urna class="i uil-heart">
                            </urna> <i class="uil-grin-tongue-wink"> </i> </p>
                        <div
                            class="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800">
                        </div>
                    </div>
                </div>
                <div class="flex">
                    <div class="w-10 h-10 rounded-full relative flex-shrink-0">
                        <img src="assets/images/avatars/avatar-1.jpg" alt=""
                            class="absolute h-full rounded-full w-full">
                    </div>
                    <div
                        class="text-gray-700 py-2 px-3 rounded-md bg-gray-100 h-full relative lg:ml-5 ml-2 lg:mr-20  dark:bg-gray-800 dark:text-gray-100">
                        <p class="leading-6">Nam liber tempor cum soluta nobis eleifend option <i
                                class="uil-grin-tongue-wink-alt"></i>
                        </p>
                        <div
                            class="absolute w-3 h-3 top-3 -left-1 bg-gray-100 transform rotate-45 dark:bg-gray-800">
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 bg-gray-100 rounded-full rounded-md relative dark:bg-gray-800">
                <input type="text" placeholder="Add your Comment.."
                    class="bg-transparent max-h-10 shadow-none">
                <div
                    class="absolute bottom-0 flex h-full items-center right-0 right-3 text-xl space-x-2">
                    <a href="#"> <i class="uil-image"></i></a>
                    <a href="#"> <i class="uil-video"></i></a>
                </div>
            </div>

        </div>

    </div>
    ${(() => {
                    if (i == 3) {
                        if (res.pagination.next != null) {
                            return `<!-- Load more-->
                                <div class="flex justify-center mt-6" id="toggle">
                                    <a onclick="loadPost('${res.pagination.next}')"
                                        class="bg-white dark:bg-gray-900 font-semibold my-3 px-6 py-2 rounded-full shadow-md dark:bg-gray-800 dark:text-white">
                                        Load more ..</a>
                                </div>`;
                        }
                        else {
                            return ` `
                        }
                    }
                    else {
                        return ` `
                    }
                })()
                }
    `
        });
        PostCard.innerHTML += s;
        hideloader();
    }
}

// function to like the posts
async function likethisPost(data) {
    id = data.id;
    let response = await fetch('https://spacebox-production.up.railway.app/likePost/' + id, {
        headers: myHeaders,
        method: 'Put'
    });
    let result = await response.json();
    if (result == 'liked') {
        data.children[0].className = 'p-2 rounded-full text-black'
        like = parseInt(data.children[1].innerHTML.split(' ')[0]) + 1
        data.children[1].innerHTML = like + ' Like'
    }
    else {
        data.children[0].className = 'p-2 rounded-full text-gray'
        like = parseInt(data.children[1].innerHTML.split(' ')[0]) - 1
        data.children[1].innerHTML = like + ' Like'
    }
}


// function to get suggested users
async function getSuggestionUser() {
    let response = await fetch('https://spacebox-production.up.railway.app/suggestionUser', {
        headers: myHeaders,
        method: 'Get'
    });
    let result = await response.json();
    let suggestion_box = document.querySelector('#suggestion_box');
    if (result.length == 0) {
        suggestion_box.innerHTML = `<div class="flex items-center justify-between py-3">
        <div class="flex flex-1 items-center space-x-4">
            <div class="flex flex-col">
                <span class="block capitalize font-semibold">No New User To Follow</span>
            </div>
        </div>
    </div>`
    }
    else {
        let s = ''
        result.forEach((user, i) => {
            s += `<div class="flex items-center justify-between py-3">
            <div class="flex flex-1 items-center space-x-4">
                <a href="getUserDetail.html?id=${user.user_id}">
                    <img src="${user.profile_pic}"
                        class="bg-gray-200 rounded-full w-10 h-10">
                </a>
                <div class="flex flex-col">
                    <span class="block capitalize font-semibold"> ${user.first_name} ${user.last_name} </span>
                    <span class="block capitalize text-sm"> ${user.location} </span>
                </div>
            </div>

            <a href="getUserDetail.html?id=${user.user_id}"
                class="border border-gray-200 font-semibold px-4 py-1 rounded-full hover:bg-pink-600 hover:text-white hover:border-pink-600 dark:border-gray-800">
                View </a>
        </div>`
        });
        suggestion_box.innerHTML = s;
    }
}


// function to get the latest post
function latestPost(data) {
    post = data.slice(0, 4)
    let latestPost = document.querySelector('#latestPost');

    let s = ''
    post.forEach((post, i) => {
        s += `<div class="bg-gray-500 max-w-full h-32 rounded-lg relative overflow-hidden uk-transition-toggle">
        <a>
        ${(() => {
                if (post.isImage == true) {
                    return `<img src='${post.web_url}' alt=""></img>`
                }
                else {
                    return `<video src='${post.web_url}' controls style='margin: auto;'></video>`
                }
            })()
            }
        </a>
        <div
            class="flex flex-1 justify-around items-center absolute bottom-0 w-full p-2 text-white custom-overly1 uk-transition-slide-bottom-medium">
            <a href="#story-modal" onclick=getStoryModal(this) class="flex items-center" data-userid='${post.user_id}' 
            data-name='${post.first_name} ${post.last_name}' data-postLink='${post.web_url}' data-isImage=${post.isImage}
            data-likes='${post.likes}' data-profilePic='${post.profile_pic}' data-caption='${post.caption}' data-mediaId='${post.id}'><i class="uil-heart"></i> ${post.likes} </a>
        </div>
    </div>`
    });
    latestPost.innerHTML = s;
}


// function to follow the users
function follow(data) {
    if (data.innerHTML == 'Following') {
        if (confirm('Are you sure you want to unfollow the user...?') == true) {
            followFunction(data);
        }
    }
    else {
        followFunction(data);
    }

}
async function followFunction(data) {
    id = data.id;
    let response = await fetch('https://spacebox-production.up.railway.app/follow/' + id, {
        headers: myHeaders,
        method: 'Put'
    });
    let result = await response.json();
    if (result == 'follow') {
        console.log(result)
        data.innerHTML = 'Following'
        document.getElementById('ProfileFollowers').innerHTML = parseInt(document.getElementById('ProfileFollowers').innerHTML) + 1;
        document.getElementById('following').innerHTML = parseInt(document.getElementById('following').innerHTML) + 1;
    }
    else {
        console.log(result)
        data.innerHTML = 'Follow'
        document.getElementById('ProfileFollowers').innerHTML = parseInt(document.getElementById('ProfileFollowers').innerHTML) - 1;
        document.getElementById('following').innerHTML = parseInt(document.getElementById('following').innerHTML) - 1;
    }
}

// validating the files which is uploaded should be Image or video not others
function fileValidationForPost() {
    var fileInput =
        document.getElementById('postImg');

    var filePath = fileInput.value;

    // Allowing file type
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.mp4|\.WebM|\.OGG|\.mkv)$/i;

    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type for Post Please Upload Image Or Else A Video');
        fileInput.value = '';
        return false;
    }
}

// posting image in image tag once file is selected
function onFileSelected(event) {
    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgtag = document.getElementById("profileImgtag");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}

// function to show the modal with appropriate data
function getStoryModal(data) {
    UIkit.modal(document.getElementById('story-modal')).show();
    document.getElementById('profilePic').src = data.dataset.profilepic
    document.getElementById('name').innerHTML = data.dataset.name
    document.getElementById('modalCaption').innerHTML = data.dataset.caption
    isImage = data.dataset.isimage
    if (isImage == "true") {
        nodeImage = '<img src="' + data.dataset.postlink + '" alt="" class="inset-0 h-full w-full object-cover" style="width: 660px;">'
        document.getElementById('postlink').innerHTML = nodeImage;
    }
    else {
        nodeVideo = '<video id="postVideo" src="' + data.dataset.postlink + '" class="inset-0 h-full w-full object-cover" controls  style="width: 660px; max-height: 880px;"></video>'
        document.getElementById('postlink').innerHTML = nodeVideo;
        setInterval(function () { document.getElementById('postVideo').style.inlineSize = 'auto' }, 5000);
    }
}

// function to load cities of india
function locationLoad() {
    (async () => {
        const where = encodeURIComponent(JSON.stringify({
            "ascii_name": {
                "$exists": true
            }
        }));
        const response = await fetch(
            `https://parseapi.back4app.com/classes/india_cities_database?limit=4000&order=ascii_name&keys=ascii_name&where=${where}`,
            {
                headers: {
                    'X-Parse-Application-Id': 'k9wzhXDJckHtuuKmMEm8hceXoCZMvxN4CTijZOjn', // This is the fake app's application id
                    'X-Parse-Master-Key': 'EpjKI6bUlgkIbOAAUaDKDFj6x2C3AnsZZJqoa4ak', // This is the fake app's readonly master key
                }
            }
        );
        const data = await response.json(); // Here you have the data that you need
        for (let i = 0; i < data.results.length; i++) {
            slt = document.getElementById("location");
            opt = document.createElement("option");
            opt.text = data.results[i].ascii_name;
            opt.value = data.results[i].ascii_name;
            slt.appendChild(opt);
        }
    })();
}