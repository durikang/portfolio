'use strict'
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpMessage = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('data/sound/carrot_pull.mp3');
const alertSound = new Audio('data/sound/alert.mp3');
const bgSound = new Audio('data/sound/bg.mp3');
const bugSound = new Audio('data/sound/bug_pull.mp3');
const winSound = new Audio('data/sound/game_win.mp3');
let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click',onFiledclick);

gameBtn.addEventListener('click', ()=>{
    if(started){
        stopGame();

    }else{
        startGame();
    }
    /* 만약 started가 true이면 false로 false이면 true로 변환*/

});
popUpRefresh.addEventListener('click',()=>{
    startGame();
    hidePopUp();
});

/* 시작과 종료 함수들 */
function startGame(){
    started=true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}
function stopGame(){
    started=false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithMessage('REPLAY ??');
    playSound(alertSound);
    stopSound(bgSound);

}
function finishGame(win){
    started=false;
    hideGameButton();
    if(win){
        playSound(winSound);
    }else {
        playSound(bugSound);
    }
    
    stopGameTimer();
    stopSound(bgSound);
    showPopUpWithMessage(win ? ' YOU WON' : 'YOU LOST');
}

/* UI 확인 */
function showStopButton(){
    const icon=gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility='visible';
}

function hideGameButton(){
    gameBtn.style.visibility = 'hidden';
}


function showTimerAndScore(){
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function startGameTimer(){
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if(remainingTimeSec<=0){
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            
        }

        updateTimerText(--remainingTimeSec)

    }, 1000);
}
function stopGameTimer(){
    clearInterval(timer);
}
function updateTimerText(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    gameTimer.innerText=`${minutes} : ${seconds}`;

}
function showPopUpWithMessage(text){
    popUpMessage.innerText=text;
    popUp.classList.remove('pop-up--hide');
}
function hidePopUp(){
    popUp.classList.add('pop-up--hide');
}


function initGame(){
    score=0;
    field.innerHTML='';
    gameScore.innerHTML= CARROT_COUNT;

    //벌레와 당근을 생성한뒤 field에 추가해줌
    addItem('carrot',CARROT_COUNT,'data/img/carrot.png');
    addItem('bug',BUG_COUNT,'data/img/bug.png');
}

function onFiledclick(event){
    if(!started)
        return;
    
    const target = event.target;
    if(target.matches('.carrot')){
        //당근!!?
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
    if(score == CARROT_COUNT)
    {
        finishGame(true);
    
    }
    }else if(target.matches('.bug')){
        finishGame(false);
    } 
}

function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}
function stopSound(sound){
    sound.pause();
}



function updateScoreBoard(){
    gameScore.innerText=CARROT_COUNT-score;
}

function addItem(className, count, imgPath){
    
    const x1 = 0;
    const y1 = 0;
    const x2= fieldRect.width - CARROT_SIZE;
    const y2= fieldRect.height - CARROT_SIZE;

    for(let i =0;i<count;i++){

        const item = document.createElement('img');
        item.setAttribute('class',className);
        item.setAttribute('src',imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1,x2);
        const y = randomNumber(y1,y2);
        
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);

    }




}

function randomNumber(min,max){

    return Math.random() * ( max - min ) + min;
}
