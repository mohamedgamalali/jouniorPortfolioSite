
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

//drop down menu.
menuBut.addEventListener('click', function () {
    dropMenu.classList.toggle('menu-down');
});

//selecting the clciked element
for(var i = 0; i<artCard.length;i++) {
    artCard[i].addEventListener('click', function () {

        const clickedImg = this.children[0].getAttribute('src');
        const clickedLabel = this.children[1].textContent;
        const clickedDate = this.children[2].textContent;

        mediaView.style.display = 'block';

        projectInfo.children[0].textContent = clickedLabel;
        projectInfo.children[2].textContent = clickedDate;
        
        mediaImg.setAttribute('src', clickedImg);
            
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



