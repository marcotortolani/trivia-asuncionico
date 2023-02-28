const body = document.querySelector("body");


// if('serviceWorker' in navigator){
//   navigator.serviceWorker.register("./sw.js")
//   .then(reg => console.log("Registro de SW exitoso", reg))
//   .catch(err => console.warn("Error al tratar de registrar el SW", err))
// }

// const URLSite = "http://test.moob.club:8000/guido/trivia-comiccon-py";
let URLSite = "";

let catSelected;
//let numberSelected;

let score;
let date = new Date();
let currentDate = date.getDate();


let answersByCategory = {
	1 : [],
	2 : [],
	3 : [],
	4 : [],
	5 : [],
	6 : [],
  7 : [],
  8 : []
};


let categoriesCompleted = {
  1 : false,
  2 : false,
  3 : false,
  4 : false,
  5 : false,
  6 : false,
  7 : false,
  8 : false
};

let answersLimited = {
  answersAllowedPerDay : 0,
  dateAnswered : []
}

// let answersAllowedCount = 0;

// let dateAnswered = [];


let soundControl = {
  allowSound : false,
  volumeSound : 0.5
}


function encryptingData(data){
  return window.btoa(data);
}

function desencryptingData(data){
  return window.atob(data);
}





//!   INDEX = SPINER WHEEL
if (body.className === "spiner-wheel") {

  
  // To initialize variables in Local Storage


  URLSite = window.location.href.replace("/index.html", "");
  localStorage.setItem("a1a2a3", encryptingData(JSON.stringify(URLSite)));
  
  URLSite = JSON.parse(desencryptingData(localStorage.getItem("a1a2a3")));
  
  // score counter
	if(!localStorage.getItem("b1b2b3")){
      score = 0;
      localStorage.setItem("b1b2b3", encryptingData(JSON.stringify(score)));
  }else{
      score = JSON.parse(desencryptingData(localStorage.getItem("b1b2b3")));
  }
  

  // Get Data from LocalStorage - Answers by Category
  if(!localStorage.getItem("c1c2c3")){
    localStorage.setItem("c1c2c3", encryptingData(JSON.stringify(answersByCategory)));
  }else{
    answersByCategory = JSON.parse(desencryptingData(localStorage.getItem("c1c2c3")));
  }


  // Array with categories that were made completed
  if(!localStorage.getItem("d1d2d3")){
    localStorage.setItem("d1d2d3", encryptingData(JSON.stringify(categoriesCompleted)));
  }else{
    categoriesCompleted = JSON.parse(desencryptingData(localStorage.getItem("d1d2d3")));
  }
  
  
  // Volume control config by user
  if(!localStorage.getItem("e1e2e3")){
    localStorage.setItem("e1e2e3", encryptingData(JSON.stringify(soundControl)));
  }else{
    soundControl = JSON.parse(desencryptingData(localStorage.getItem("e1e2e3")));
  }
  

  // Answers Allowed Per Day
  if(!localStorage.getItem("f1f2f3")){
    localStorage.setItem("f1f2f3", encryptingData(JSON.stringify(answersLimited)));
  }else{
    answersLimited = JSON.parse(desencryptingData(localStorage.getItem("f1f2f3")));
  }
  // ----------------------------------------------


  
  


	const scoreDisplayed = document.getElementById("score-displayed");
  const buttonRewards = document.getElementById("button-rewards");
  const buttonClosePopUp = document.getElementById("close-button");
  const wheel = document.getElementById("wheel");
  const spin = document.getElementById("spin");
  const popUpFireworks = document.querySelector(".pop-up-fireworks");
  const popUpLimitAnswers = document.querySelector(".pop-up-limit-answers");

  //const volumeControl = document.getElementById("volume-control");
  const muteControl = document.getElementById("mute-control");
  //const volumeLevel = document.getElementById("volume-level");


  const rouletteSFX = document.getElementById("roulette-sfx");
  const fireworksSFX = document.getElementById("fireworks-sfx");

  rouletteSFX.preload;
  fireworksSFX.preload;
  rouletteSFX.volume = soundControl.volumeSound;
  fireworksSFX.volume = soundControl.volumeSound;

	var degree = 1800;
	var clicks = 0;
	let timeSpinning = 3;
  //let numberSelected;
  var categoriesWheel;

	scoreDisplayed.innerHTML = score;


  answersLimited.dateAnswered = answersLimited.dateAnswered.filter(el => el >= currentDate);



  const soundControlSetting = (e) => {

    if(e === "render"){
      //console.log("rendering sound");
      muteControl.checked = soundControl.allowSound;
      //volumeLevel.value = soundControl.volumeSound*100;
    }

    // if(e === "set-level"){
    //   soundControl.volumeSound = volumeLevel.value / 100;
    //   if(soundControl.volumeSound === 0){
    //     soundControl.allowSound = false;
    //     soundControlSetting("render");
    //   }else{
    //     soundControl.allowSound = true;
    //     soundControlSetting("render");
    //   }  
    // }
    rouletteSFX.volume = soundControl.volumeSound;
    fireworksSFX.volume = soundControl.volumeSound;

    
    if(muteControl.checked ){
      muteControl.parentElement.children[1].classList.remove("hide");
      muteControl.parentElement.children[2].classList.add("hide");
      soundControl.allowSound = true;
    }else{
      muteControl.parentElement.children[1].classList.add("hide");
      muteControl.parentElement.children[2].classList.remove("hide");
      soundControl.allowSound = false;
    }

  
    // if(volumeControl.checked ){
    //   volumeControl.parentElement.children[2].classList.remove("hide");
    // }else{
    //   volumeControl.parentElement.children[2].classList.add("hide");
    // }
    
    localStorage.setItem("e1e2e3", encryptingData(JSON.stringify(soundControl)));

  }

  document.addEventListener("DOMContentLoaded", e => soundControlSetting("render"));
  muteControl.addEventListener("click", e => soundControlSetting());
  //volumeControl.addEventListener("click", e => soundControlSetting());
  //volumeLevel.addEventListener("input", e => soundControlSetting("set-level"));


  const renderCategories = async () => {

    let counterCatCompleted = 0;
    let requestJson, questions;
    let infoCategories = undefined;
  
    try{
      requestJson = await fetch(URLSite + "/config/config.txt");
      infoCategories = await requestJson.json();
    } catch(err){
      //console.log(err);
    }

    // Reading quantity of Answers Allowed Per Day
    answersLimited.answersAllowedPerDay = infoCategories.trivia.answersAllowedPerDay;
    localStorage.setItem("f1f2f3", encryptingData(JSON.stringify(answersLimited)));
    if(answersLimited.dateAnswered.length >= answersLimited.answersAllowedPerDay){
      //console.log("llegaste a tu limite diario");
      popUpLimitAnswers.classList.remove("hide");
    }

    categoriesWheel = infoCategories.trivia.categoriesWheel;
  
    for (let i = 0; i < 5; i++) {
      wheel.children[i].classList.add("hide");
      wheel.children[i].id = "";
    };



    //console.log(URLSite);
    try {
        requestJson = await fetch(URLSite + "/preguntas.txt");
        questions = await requestJson.json();
        
        //if (!res.ok) throw {status: res.status, statusText: res.statusText};
    } catch (err) {
      //console.log(requestJson.json());
        console.log(err);
    }

    // check in all categories (between 4 and 8, chosen in config file)
    for (let i = 0; i < categoriesWheel; i++) {
      let imgURL = infoCategories.trivia.catInfo[i].img;
      let nameCat = infoCategories.trivia.catInfo[i].name;
  
      wheel.children[categoriesWheel-4].children[i].insertAdjacentHTML('afterbegin', '<img>');
      wheel.children[categoriesWheel-4].children[i].insertAdjacentHTML('afterbegin', '<h5></h5>');
      
      //console.log(wheel.children[categoriesWheel-4].children[i].children[0].src);
      
      wheel.children[categoriesWheel-4].children[i].children[0].innerHTML = nameCat;
      wheel.children[categoriesWheel-4].children[i].children[1].src = URLSite + imgURL;


      if(!categoriesCompleted[i+1]){
        
        if(answersByCategory[i+1].length === questions.categories[i]['preguntas'].length){
          
          // put this field on true when the category is completed
          categoriesCompleted[i+1] = true;
          localStorage.setItem("d1d2d3", encryptingData(JSON.stringify(categoriesCompleted)));
          
        }
      }
  
      if(categoriesCompleted[i+1]){
        // put category disabled
        wheel.children[categoriesWheel-4].children[i].classList.add("disabled");
      }

      if(categoriesCompleted[i+1]) {
        counterCatCompleted++;
      
        // console.log("Counter: ", counterCatCompleted);
        // console.log("Cat Wheel: ", categoriesWheel);
        if(counterCatCompleted === categoriesWheel){
          //put the spin button disabled
          spin.children[0].children[0].classList.add("disabled");
          spin.removeEventListener("click", function(){});
          if(soundControl.allowSound){
            fireworksSFX.play();
          }
          popUpFireworks.classList.remove("hide");
        }
      }

    };
    
    wheel.children[categoriesWheel-4].classList.remove("hide");
    wheel.children[categoriesWheel-4].id = "inner-wheel";
  
    //console.log(answersByCategory[1].length);
    //console.log(questions.categories[0]['preguntas'].length);
    //console.log("Categorias completadas");
    //console.log(categoriesCompleted[1]);

       
  }
  
  
  document.addEventListener("DOMContentLoaded", e => renderCategories());


  spin.addEventListener("click", function () {

      if (soundControl.allowSound) {
        rouletteSFX.pause();
        rouletteSFX.currentTime = 0;
        rouletteSFX.play();
      }
      

      clicks ++;
      var newDegree;
      var extraDegree;

      const randomNumber = () => {
        
        newDegree = degree * clicks;
        extraDegree = Math.floor(Math.random() * (360 -1+1)) + 1;
        totalDegree = newDegree + extraDegree;


        if(categoriesWheel===4){
          extraDegree >= 1 && extraDegree <=90 ? catSelected=4 : "";
          extraDegree >= 91 && extraDegree <=180 ? catSelected=3 : "";
          extraDegree >= 181 && extraDegree <=270 ? catSelected=2 : "";
          extraDegree >= 271 && extraDegree <=360 ? catSelected=1 : "";
        }
      
        if(categoriesWheel===5){
          extraDegree >= 1 && extraDegree <=72 ? catSelected=5 : "";
          extraDegree >= 73 && extraDegree <=144 ? catSelected=4 : "";
          extraDegree >= 145 && extraDegree <=216 ? catSelected=3 : "";
          extraDegree >= 217 && extraDegree <=288 ? catSelected=2 : "";
          extraDegree >= 289 && extraDegree <=360 ? catSelected=1 : "";
        }
      
        if(categoriesWheel===6){
          extraDegree >= 1 && extraDegree <=60 ? catSelected=6 : "";
          extraDegree >= 61 && extraDegree <=120 ? catSelected=5 : "";
          extraDegree >= 121 && extraDegree <=180 ? catSelected=4 : "";
          extraDegree >= 181 && extraDegree <=240 ? catSelected=3 : "";
          extraDegree >= 241 && extraDegree <=300 ? catSelected=2 : "";
          extraDegree >= 301 && extraDegree <=360 ? catSelected=1 : "";  
        }
      
        if(categoriesWheel===7){
          extraDegree >= 1 && extraDegree <=51.4 ? catSelected=7 : "";
          extraDegree >= 52.4 && extraDegree <=102.8 ? catSelected=6 : "";
          extraDegree >= 103.8 && extraDegree <=154.25 ? catSelected=5 : "";
          extraDegree >= 155.25 && extraDegree <=205.66 ? catSelected=4 : "";
          extraDegree >= 206.66 && extraDegree <=257.06 ? catSelected=3 : "";
          extraDegree >= 258.06 && extraDegree <=308.46 ? catSelected=2 : "";
          extraDegree >= 309.46 && extraDegree <=360 ? catSelected=1 : "";  
        }
      
        if(categoriesWheel===8){
          extraDegree >= 1 && extraDegree <=45 ? catSelected=8 : "";
          extraDegree >= 46 && extraDegree <=90 ? catSelected=7 : "";
          extraDegree >= 91 && extraDegree <=135 ? catSelected=6 : "";
          extraDegree >= 136 && extraDegree <=180 ? catSelected=5 : "";
          extraDegree >= 181 && extraDegree <=225 ? catSelected=4 : "";
          extraDegree >= 226 && extraDegree <=270 ? catSelected=3 : "";
          extraDegree >= 271 && extraDegree <=315 ? catSelected=2 : "";  
          extraDegree >= 316 && extraDegree <=360 ? catSelected=1 : ""; 
        }

        if(categoriesCompleted[catSelected] === true){
          randomNumber();
        }
      }

      randomNumber();
    

      setTimeout(() => {
        $('#wheel .sec').each(function() {
          var t = $(this);
          var noY = 0;
  
          var c = 0;
          var n = 700;
          var interval =  setInterval(function () {
            c++;
            if (c === n) {
              clearInterval(interval);
            }
  
            var aoY = t.offset().top;
            //$('#txt').html(aoY);
  
            // if(aoY < 23.89) {
            //   $('#arrow-wheel').addClass('spin');
            //   setTimeout(function () {
            //     $("#arrow-wheel").removeClass('spin');
            //   }, 100);
            // }

          }, 10);
  
          $('#inner-wheel').css({'transform' : 'rotate(' + totalDegree + 'deg)'});
  
          $('#inner-wheel').css({'transition-duration' : timeSpinning + 's'});
          $('#inner-wheel').css({'-webkit-transition-duration' : timeSpinning + 's'});
          $('#inner-wheel').css({'-moz-transition-duration' : timeSpinning + 's'});
          $('#inner-wheel').css({'-ms-transition-duration' : timeSpinning + 's'});
          $('#inner-wheel').css({'-o-transition-duration' : timeSpinning + 's'});
  
        
  
          noY = t.offset().top;
        });
      }, 350);

        setTimeout(function (){
          // $('#txt').html(catSelected);
          rouletteSFX.pause();
          window.location.href = URLSite + "/html/category.html" + "?" + "cat=" + catSelected;
        
        }, (timeSpinning * 1000) + 500);

  })



  const showPopUpRewards = () => {

    buttonClosePopUp.parentElement.parentElement.classList.toggle("hide");

  }

  buttonRewards.addEventListener("click", e => showPopUpRewards());
  buttonClosePopUp.addEventListener("click", e => showPopUpRewards());



}


//!   CATEGORY CHOSEN
if (body.className === "category") {

  // GET data from URL

  let url = window.location;
  let paramaters = (new URL(url)).searchParams;
  let catSelect = parseInt(paramaters.get("cat"));

  URLSite = JSON.parse(desencryptingData(localStorage.getItem("a1a2a3")));

  //--------------------

  // Get Data from LocalStorage - Answers by Category
  if(!localStorage.getItem("c1c2c3")){
    localStorage.setItem("c1c2c3", encryptingData(JSON.stringify(answersByCategory)));
  }else{
    answersByCategory = JSON.parse(desencryptingData(localStorage.getItem("c1c2c3")));
  }

  // Volume control config by user
  if(!localStorage.getItem("e1e2e3")){
    localStorage.setItem("e1e2e3", encryptingData(JSON.stringify(soundControl)));
  }else{
    soundControl = JSON.parse(desencryptingData(localStorage.getItem("e1e2e3")));
  }

  // Answers Allowed Per Day
  if(!localStorage.getItem("f1f2f3")){
    localStorage.setItem("f1f2f3", encryptingData(JSON.stringify(answersLimited)));
  }else{
    answersLimited = JSON.parse(desencryptingData(localStorage.getItem("f1f2f3")));
  }
  // --------------------------------------------
  

  const catDisplayed = document.querySelector(".category-name");
  const catImage = document.getElementById("cat-image");
  const buttonBegin = document.querySelector(".button-begin");

  const categoryChosen = document.querySelector(".category-chosen");
  const cardsQuestions = document.querySelector(".cards-questions");
  const cardsAnswers = document.getElementById("answers");
  const answersButtons = document.querySelectorAll("input[type=checkbox]");

  const answerCorrectAnimation = document.querySelector(".answer-animation-correct");
  const answerWrongAnimation = document.querySelector(".answer-animation-wrong");

  const footer = document.querySelector(".footer");
  const questionsTotalDisplayed = document.getElementById("questions-total");
  const questionsAnswered = document.getElementById("questions-answered");
  //const adviseCatFull = document.getElementById("advise-cat-full");


  const buttonSFX = document.getElementById("button-sfx");
  const wrongSFX = document.getElementById("wrong-answer-sfx");
  const correctSFX = document.getElementById("correct-answer-sfx");
  const confettiSFX = document.getElementById("confetti-sfx");
  
  buttonSFX.preload;
  wrongSFX.preload;
  correctSFX.preload;
  confettiSFX.preload;
  buttonSFX.volume = soundControl.volumeSound;
  wrongSFX.volume = soundControl.volumeSound;
  correctSFX.volume = soundControl.volumeSound;
  confettiSFX.volume = soundControl.volumeSound;


  const scoreDisplayed = document.getElementById("score-displayed");
  score = JSON.parse(desencryptingData(localStorage.getItem("b1b2b3")));
  scoreDisplayed.innerHTML = score;


  let numPreguntas;

  let questions = undefined;
  let random;




  // Read Data of Category chosen in config file
  const getCategoryData = async () => {

    let requestJson;
    let infoCategories = undefined;
  
    try{
      requestJson = await fetch(URLSite + "/config/config.txt");
      infoCategories = await requestJson.json();
    } catch(err){
      //console.log(err);
    }

    // Reading quantity of Answers Allowed Per Day
    answersLimited.answersAllowedPerDay = infoCategories.trivia.answersAllowedPerDay;
    localStorage.setItem("f1f2f3", encryptingData(JSON.stringify(answersLimited)));
    if(answersLimited.dateAnswered.length >= answersLimited.answersAllowedPerDay){
      //console.log("llegaste a tu limite diario");
      window.location.href = URLSite + "/index.html";
    }

    // Show Data of Category Chosen
    catImage.children[0].src = URLSite + infoCategories.trivia.catInfo[catSelect - 1].img;
    catDisplayed.innerHTML = infoCategories.trivia.catInfo[catSelect - 1].name;
  
  }
  
  document.addEventListener("DOMContentLoaded", e => getCategoryData());
  // -----------------------------------------------



// Read data of preguntas.txt with Category Selected
  const readQuestionsData = async () =>{
	  let requestJson;

    try {
        requestJson = await fetch(URLSite + '/preguntas.txt');
        questions = await requestJson.json();
        //if (!res.ok) throw {status: res.status, statusText: res.statusText};
    } catch (err) {
        //console.log(err);
    }

  	numPreguntas = questions.categories[catSelect-1]['preguntas'].length;

  	if(numPreguntas<10){
  		questionsTotalDisplayed.innerHTML = "0" + numPreguntas;
  	}else{
  		questionsTotalDisplayed.innerHTML = numPreguntas;
  	}
  
  	if(answersByCategory[catSelect].length<10){
  		questionsAnswered.innerHTML = "0" + answersByCategory[catSelect].length;
  	}else{
  		questionsAnswered.innerHTML = answersByCategory[catSelect].length;
  	}

	
	// Check if the Category Select by de Roulete was completed
  	// if (answersByCategory[catSelect].length === questions.categories[catSelect-1]['preguntas'].length){
		//   adviseCatFull.classList.remove("hide");
    //   buttonBegin.innerHTML = "Volver"

    //   buttonBegin.addEventListener("click", e => ()=>{
    //     window.location.href = "/index.html";
    //   })
  	// }else{
		//   adviseCatFull.classList.add("hide");
  	// }

  }

  window.addEventListener("DOMContentLoaded", e => readQuestionsData());





 


  const displayQuestions = () => {

    

    categoryChosen.classList.add("show-questions");
    footer.classList.add("show-questions");
    //footer.children[1].classList.remove("hide");


    if(answersByCategory[catSelect].length<10){
		  questionsAnswered.innerHTML = "0" + answersByCategory[catSelect].length;
	  }else{
		  questionsAnswered.innerHTML = answersByCategory[catSelect].length;
	  }

    random = Math.floor(Math.random() * numPreguntas);

	  if(answersByCategory[catSelect].length != questions.categories[catSelect-1]['preguntas'].length){
		
		  while (answersByCategory[catSelect].includes(random)) {
			  // try to another random number
			  random = Math.floor(Math.random() * numPreguntas);
		  }
		
	  }else{
		  // already answered all questions
      // COMPLETASTE LA CATEGORIA
      // MOSTRAR CARTEL CELEBRATION

      // cardsQuestions.classList.remove("show");
      // cardsQuestions.classList.add("hide");
      console.log("Categoria completada");
      //console.log(cardsQuestions.children[2].children[0]);

      //cardsQuestions.children[0].children[0].innerHTML = "FELICIDADES HAS COMPLETADO LA CATEGORÍA";
      //cardsAnswers.classList.add("hide");
      
      setTimeout(() => {
        cardsQuestions.children[0].classList.remove("show");
        cardsQuestions.children[0].classList.add("hide");
        cardsQuestions.children[1].classList.remove("show");
        cardsQuestions.children[1].classList.add("hide");
        cardsQuestions.nextElementSibling.classList.remove("hide");
        
        if(soundControl.allowSound){
          wrongSFX.pause();
          correctSFX.pause();
          confettiSFX.play();
        }
        
        cardsQuestions.classList.add("show-side-left");
        cardsQuestions.classList.add("show");
      }, 100);

    
		  setTimeout(() => {
			  window.location.href = URLSite + "/index.html";
		  }, 5000);

      
		
	  }
	
    //console.log(cardsQuestions.children[2].children[0]);

    setTimeout(() => {
      cardsQuestions.children[0].children[0].innerHTML = questions.categories[catSelect-1]['preguntas'][random]['preg'];
      cardsAnswers.children[0].children[0].innerHTML = questions.categories[catSelect-1]['preguntas'][random]['resp'][0].rta;
      cardsAnswers.children[1].children[0].innerHTML = questions.categories[catSelect-1]['preguntas'][random]['resp'][1].rta;
      cardsAnswers.children[2].children[0].innerHTML = questions.categories[catSelect-1]['preguntas'][random]['resp'][2].rta;  
    }, 500);

    
    //answer01.dataset.value = questions.categories[catSelect-1]['preguntas'][random-1]['resp'][0].correcta;
    //answer02.dataset.value = questions.categories[catSelect-1]['preguntas'][random-1]['resp'][1].correcta;
    //answer03.dataset.value = questions.categories[catSelect-1]['preguntas'][random-1]['resp'][2].correcta;

    for (let i = 0; i < answersButtons.length; i++) {
      answersButtons[i].dataset.value = questions.categories[catSelect-1]['preguntas'][random]['resp'][i].correcta;
      
    }

    setTimeout(() => {
      //console.log("desliza desde la izquierda");
      cardsQuestions.classList.remove("show-side-right");
      cardsQuestions.classList.add("show-side-left");
      cardsQuestions.classList.add("show");
    }, 500);


	
  }

   

  buttonBegin.addEventListener("click", e => {

    if(soundControl.allowSound){
      buttonSFX.pause();
      buttonSFX.currentTime = 0.05;
      buttonSFX.play();
    };

    setTimeout(() => {
      //console.log("click boton sfx");  
      displayQuestions();
    }, 300);
    
  });




  const checkAnswer =(e)=>{

    // Disabled Answers Buttons
    cardsAnswers.children[0].children[1].disabled = true;
    cardsAnswers.children[1].children[1].disabled = true;
    cardsAnswers.children[2].children[1].disabled = true;

    
    answersLimited.dateAnswered.push(date.getDate());
    localStorage.setItem("f1f2f3", encryptingData(JSON.stringify(answersLimited)));


  	if(e.target.dataset.value === "true"){
      
      if(soundControl.allowSound){
        wrongSFX.pause();
        correctSFX.pause();
        correctSFX.currentTime = 0;
        correctSFX.play();
      }

      e.target.parentElement.firstElementChild.innerHTML ="";
      e.target.parentElement.classList.add("correct");
      e.target.nextElementSibling.classList.add("show");
  
      answerCorrectAnimation.classList.remove("hide");

  		score = score + 1000;

      
  	}else{
      
      if(soundControl.allowSound){
        correctSFX.pause();
        wrongSFX.pause();
        wrongSFX.currentTime = 0;
        wrongSFX.play();
      }

      e.target.parentElement.firstElementChild.innerHTML ="";
  		e.target.parentElement.classList.add("wrong");
  		e.target.nextElementSibling.nextElementSibling.classList.add("show");

      answerWrongAnimation.classList.remove("hide");

  		score = score + 500;

      

  		for (let i = 0; i < answersButtons.length; i++) {
  			if(answersButtons[i].dataset.value === "true"){
  				answersButtons[i].parentElement.classList.add("correct");
  			}
  		}
  	}

	

  	answersByCategory[catSelect].push(random);
  	localStorage.setItem("c1c2c3", encryptingData(JSON.stringify(answersByCategory)));

  	if(answersByCategory[catSelect].length<10){
  		questionsAnswered.innerHTML = "0" + answersByCategory[catSelect].length;
  	}else{
  		questionsAnswered.innerHTML = answersByCategory[catSelect].length;
  	}


  	scoreDisplayed.innerHTML = score;
  	localStorage.setItem("b1b2b3", encryptingData(JSON.stringify(score)));

    // setTimeout(() => {
    //   cardsQuestions.classList.remove("show-side-left");
    //   cardsQuestions.classList.add("show-side-right");
    // }, 3000);


  	setTimeout(() => {

      cardsQuestions.classList.remove("show-side-left");
      cardsQuestions.classList.add("show-side-right");
      answerCorrectAnimation.classList.add("hide");
      answerWrongAnimation.classList.add("hide");

      setTimeout(() => {
        for (let i = 0; i < answersButtons.length; i++) {
          answersButtons[i].parentElement.classList.remove("correct");
          answersButtons[i].parentElement.classList.remove("wrong");
          

          answersButtons[i].nextElementSibling.classList.remove("show");
          answersButtons[i].nextElementSibling.nextElementSibling.classList.remove("show");
  
          cardsAnswers.children[0].children[1].disabled = false;
          cardsAnswers.children[1].children[1].disabled = false;
          cardsAnswers.children[2].children[1].disabled = false;
        }
      }, 500);

      if(answersLimited.dateAnswered.length >= answersLimited.answersAllowedPerDay){
        console.log("llegaste a tu limite diario");
        window.location.href = URLSite + "/index.html";

      }
  		  

      setTimeout(() => {
        displayQuestions();
      }, 200);
  		
    
  	}, 2000);
	

  }


  answersButtons.forEach(el => {
    el.addEventListener("click", e => checkAnswer(e));
  });


}