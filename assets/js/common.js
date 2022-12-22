let myHeaders = new Headers();
myHeaders.append("Authorization", sessionStorage.getItem("token"));



function verify() {
    var token = sessionStorage.getItem("token");
    if (token === null) {
        window.location.replace("./form-login.html");
    }
}
function logout() {
    var x;
    a = confirm("You are about to Logout!")
    if (a) {
        sessionStorage.clear();
        window.location.href = 'form-login.html'
    }
}

async function getProfileInfo() {
    var url = new URL(window.location.href);
    var id = url.searchParams.get('id');
    if (id == null) {
        let response = await fetch('http://127.0.0.1:8000/getCurrentUser', {
            headers: myHeaders,
            method: 'Get'
        });
        let result = await response.json();
        console.log(result);

        document.getElementById('ProfilefullNameTag').innerHTML = result.first_name + ' ' + result.last_name;
        document.getElementById('ProfileBio').innerHTML = document.getElementById('bio').innerHTML;
        document.getElementById('ProfilePost').innerHTML = parseInt(document.getElementById('noOfPost').innerHTML);
        document.getElementById('ProfileFollowers').innerHTML = parseInt(document.getElementById('followers').innerHTML);
        document.getElementById('ProfileFollowing').innerHTML = parseInt(document.getElementById('following').innerHTML);

        let postProfile = document.querySelector('#all_post');
        let s = ''
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
                    <a href="#story-modal" uk-toggle class="flex items-center"> <ion-icon name="heart"
                            class="mr-1"></ion-icon> 150 </a>
                    <a href="#story-modal" uk-toggle class="flex items-center"> <ion-icon
                            name="chatbubble-ellipses" class="mr-1"></ion-icon> 30 </a>
                    <a href="#story-modal" uk-toggle class="flex items-center"> <ion-icon name="pricetags"
                            class="mr-1"></ion-icon> 12 </a>
                </div>
    
            </div>
        </div>`
        });
        postProfile.innerHTML = s;
    }
    else {
        console.log(id);
    }



}

async function getAccountInfo() {
    let response = await fetch('http://127.0.0.1:8000/getCurrentProfile', {
        headers: myHeaders,
        method: 'Get'
    });
    let result = await response.json();
    console.log(result);

    document.getElementById('about').value = result[0].bio
    document.getElementById('location').value = result[0].location
    document.getElementById('dob').value = result[0].dob
    document.getElementById('gender').value = result[0].gender
    document.getElementById('first_name').value = result[1]
    document.getElementById('last_name').value = result[2]
    document.getElementById('email').value = result[3]
}


async function getDefaultValues() {
    let response = await fetch('http://127.0.0.1:8000/getCurrentProfile', {
        headers: myHeaders,
        method: 'Get'
    });
    let result = await response.json();
    console.log(result);

    for (let i = 0; i < document.getElementsByClassName('profilePicture').length; i++) {
        document.getElementsByClassName('profilePicture')[i].src = result[0].profile_pic;
    }
    document.getElementById('bio').innerHTML = result[0].bio
    document.getElementById('noOfPost').innerHTML = result[4]
    document.getElementById('followers').innerHTML = result[0].followers
    document.getElementById('following').innerHTML = result[0].following
    document.getElementById('fullNameTag').innerHTML = result[1] + ' ' + result[2]
}


async function showPost(data) {
    let PostCard = document.querySelector('#postCard');
    let s = ''
    data.forEach((post, i) => {
        s += `<div class="bg-white shadow rounded-md dark:bg-gray-900 -mx-2 lg:mx-0">

        <!-- post header-->
        <div class="flex justify-between items-center px-4 py-3">
            <div class="flex flex-1 items-center space-x-4">
                <a href="#">
                    <div class="bg-gradient-to-tr from-yellow-600 to-pink-600 p-0.5 rounded-full">
                        <img src="${post.profile_pic}"
                            class="bg-gray-200 border border-white rounded-full w-8 h-8">
                    </div>
                </a>
                <span class="block capitalize font-semibold dark:text-gray-100"> ${post.first_name} ${post.last_name}
                </span>
            </div>
            <div>
                <a href="#"> <i
                        class="icon-feather-more-horizontal text-2xl hover:bg-gray-200 rounded-full p-2 transition -mr-1 dark:hover:bg-gray-700"></i>
                </a>
                <div class="bg-white w-56 shadow-md mx-auto p-2 mt-12 rounded-md text-gray-500 hidden text-base border border-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                    uk-drop="mode: hover;pos: bottom-right">

                    <ul class="space-y-1">
                        <li>
                            <a href="#"
                                class="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800">
                                <i class="uil-share-alt mr-1"></i> Share
                            </a>
                        </li>
                        <li>
                            <a href="#"
                                class="flex items-center px-3 py-2 hover:bg-gray-200 hover:text-gray-800 rounded-md dark:hover:bg-gray-800">
                                <i class="uil-edit-alt mr-1"></i> Edit Post
                            </a>
                        </li>
                        <li>
                            <hr class="-mx-2 my-2 dark:border-gray-800">
                        </li>
                        <li>
                            <a href="#"
                                class="flex items-center px-3 py-2 text-red-500 hover:bg-red-100 hover:text-red-500 rounded-md dark:hover:bg-red-600">
                                <i class="uil-trash-alt mr-1"></i> Delete
                            </a>
                        </li>
                    </ul>

                </div>
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
                <a href="#" class="flex items-center space-x-2 flex-1 justify-end">
                    <div class="p-2 rounded-full text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" width="22" height="22" class="dark:text-gray-100">
                            <path fill-rule="evenodd"
                                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div   uk-toggle="target: #viewAllCommentsOf${i}"> Comment</div>
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

    </div>`
    });
    PostCard.innerHTML = s;
}

async function likethisPost(data) {
    id = data.id;
    let response = await fetch('http://127.0.0.1:8000/likePost/' + id, {
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