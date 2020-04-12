$(function () {
    $("aside").niceScroll();
})

const menuBut = document.querySelector('.menu-but');
const dropMenu = document.querySelector('.drop-down');
const mediaView = document.querySelector('.media-view');
const mediaClose = document.querySelector('.ti-close');
const artCard = document.querySelectorAll('.art-card');
const projectInfo = document.querySelector('.project-info');
const mediaImg = document.querySelector('.media-view img');
const selectBox = document.querySelector('.select-box');
const addBut = document.querySelector('.add-track');
const trackInput = document.querySelector('.tname');
const loading = document.querySelector('.main-loading');

//WOW Animations
new WOW().init();

//Loading Screen
window.addEventListener('load', function() {
    loading.style.transform = "scale(0,0)";
})


//drop down menu.
menuBut.addEventListener('click', function () {
    dropMenu.classList.toggle('menu-down');
});

//selecting the clciked element
for(var i = 0; i<artCard.length;i++) {
    artCard[i].addEventListener('click', function (evt) {
        let target = evt.target;
        if (!target.className.includes('btn')) {
            const clickedImg = this.children[0].getAttribute('src');
            const clickedLabel = this.children[1].textContent;
            const clickedDate = this.children[2].textContent;
            const clickedBio = this.children[3].textContent;

            mediaView.style.display = 'block';

            projectInfo.children[0].textContent = clickedLabel;
            projectInfo.children[1].textContent = clickedBio;
            projectInfo.children[2].textContent = clickedDate;
    
            mediaImg.setAttribute('src', clickedImg);
        } else {
            //nothing
        }
            
    })
}

//closing media view
mediaClose.addEventListener('click', function () {
    mediaView.style.display = 'none';
})

//adding a new track
addBut.addEventListener('click', function () {
    let newOpt = document.createElement('option');
    newOpt.text = trackInput.value;
    selectBox.appendChild(newOpt);
    console.log(trackInput);
})

