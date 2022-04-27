"use strict"

function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }
});

let popupVideoBlock = document.querySelector('.popup__video')
let popupVideoItem = document.querySelector('.popup__video > video');
let popupPlayIcon = document.querySelector('.popup__play');
popupPlayIcon && popupPlayIcon.addEventListener('click', () => {
    if (popupVideoItem.paused) {
        popupVideoItem.play();
        popupPlayIcon.classList.remove('active');
        popupVideoBlock.classList.add('active');
    }
});

popupVideoItem && popupVideoItem.addEventListener('click', () => {
    popupVideoItem.pause();
    popupPlayIcon.classList.add('active');
    popupVideoBlock.classList.remove('active');
});


// POPUP=========================================================
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function (e) {
            e.preventDefault();
            const popupName = popupLink.getAttribute('href').replace('#', '')
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function (e) {
            e.preventDefault();
            popupClose(el.closest('.popup'));
            popupVideoItem.pause();
            popupPlayIcon.classList.add('active');
            popupVideoBlock.classList.remove('active');
        });
    }
}

function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open');
        curentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
                popupVideoItem.pause();
                popupPlayIcon.classList.add('active');
                popupVideoBlock.classList.remove('active');
            }
        });

    }
}

function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnlock) {
            bodyUnLock();
        }
    }
}


function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}
function bodyUnLock() {
    setTimeout(function () {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px'
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

let productivityInput = document.querySelectorAll('.productivity__input > label');
let productivityItem = document.querySelectorAll('.productivity__input > input');
let startIndex = document.querySelector('.start-index');
let stopButton = document.querySelector('.stop');

productivityInput && productivityInput.forEach((elem) => {
    elem.addEventListener('click', () => {
        if (JSON.parse(localStorage.getItem('activeStopButton') != 1)) {
            startIndex.classList.add('active');
            startIndex.classList.remove('disabled');
        }
    })
});

if (JSON.parse(localStorage.getItem('activeStopButton')) == 1) {
    stopButton.classList.add('active');
    stopButton && stopButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        stopButton.classList.add('animated');
        setTimeout(() => {
            stopButton.classList.remove('active');
            stopButton.classList.remove('animated');
        }, 1500);
        if ((!(startIndex.classList.contains('active'))) && (productivityItem[0].checked || productivityItem[1].checked)) {
            setTimeout(() => {
                startIndex.classList.add('active');
            }, 1500);
            startIndex.classList.remove('disabled');
        }
    })
}



$(document).on('ready', function () {
    $('#startBtn').on('click', function () {
        if (JSON.parse(localStorage.getItem('getGender')) == 'male') {
            let data = { gender: 'male' }
            $.post('https://hook.eu1.make.com/eak04y6kngyhwxdnt61gix2tektqd802?train_title=Energichnost&sex=m&secret=dsaSDFa321@3!@#123WQSE', data, function (response) {
                console.log(response);
            })
        } else {
            let data = { gender: 'female' }
            $.post('https://hook.eu1.make.com/eak04y6kngyhwxdnt61gix2tektqd802?train_title=Energichnost&sex=f&secret=dsaSDFa321@3!@#123WQSE', data, function (response) {
                console.log(response);
            })
        }
    })
})
