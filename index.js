// call to trivia API and returns question to display
//import getData from './getData'; 
//const getData = require('./getData')

// global variables
// let start = false
// let quit = false
let data = []
let currentScore = 0
let answerSelected
let diffLevel
let count = 0
// functions





// get quiz data from API
const getData = (difficulty) => {
    
    const request = new XMLHttpRequest;
    request.open('GET', `https://opentdb.com/api.php?amount=5&difficulty=${difficulty}`, true)
    request.send()
    request.onload = () => {
        let resObject = JSON.parse(request.response)
        data = resObject.results 
        myState(state = 'gotData')          
    }
    
        
}
 

// get new question
const getQuestion = (array, num) => {  
    document.getElementById('question').innerText = array[num]['question']
    document.getElementById('count').innerText = `Question ${num+1}:`                
} 

// remove question and show score
const ShowPlayerScore = () => {
    document.getElementById('question').innerText = ''
    document.getElementById('count').innerText = ''
    document.getElementById('feedback').textContent = `Quiz ended: You answered ${currentScore} out of ${count} correctly!`
}

// load answers into array and return array
 const getAnswers = (array, num) => {
    let answers = [] 
    if (array.length > num) {
        answers.push(array[num].correct_answer)
        let answersArray = answers.concat(array[num].incorrect_answers)
        
        answers = shuffle(answersArray)
    } 
     return answers   
 }

 // render possible answers in DOM
 const renderAnswers = (array) => {
    array.forEach(function (element) {
        
        let listEl = document.getElementById('list')
        let itemEl = document.createElement('li')
        let buttonEl = document.createElement('button')
        buttonEl.setAttribute('class', 'answer')

        listEl.appendChild(itemEl)
        itemEl.append(buttonEl)
        buttonEl.textContent = element   
    })
 }

 // remove answers
 const removeAnswers = () => {
    let childEl = document.getElementsByTagName('li')
    let arr = Array.from(childEl)
    arr.forEach(function(element) {
        element.parentNode.removeChild(element)
    }) 
    
 }

 // remove feedback
 const removeFeedback = () => {
    document.getElementById('feedback').textContent = ''
 }

 // shuffle array
 let shuffle = (array) => {

	let currentIndex = array.length;
	let temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

// give user feedback if answer correct or not
const giveUserFeedback = (correct) => {
    if (correct === false) {
        document.getElementById('feedback').textContent = `Wrong! The correct answer is: ${data[count].correct_answer}`
    } else {
        document.getElementById('feedback').textContent = 'Correct!'
    }
    
}

// track user score
const isAnswerCorrect = (answer) => {
    let isCorrect = false
    if (answer === data[count].correct_answer) {
        currentScore++
        isCorrect = true
    } 
    return isCorrect
}

// reset quiz
const resetQuiz = () => {
    count = 0
    currentScore = 0
}


// event listeners

// select difficulty level
document.querySelector('#dropdown').addEventListener('change', (e) => { 
    myState(state = 'difficultySelected')
})

// start button pressed
document.querySelector('#start').addEventListener('click', (e) => {
    myState(state = 'requestData')
})

let answer = document.getElementsByClassName('answer')
    for (let x=0; x<answer.length; x++) {
        answer[x].addEventListener('click', (e) => {
            answerSelected =  e.target.textContent
            myState(state = 'submitAnswer')
        })
    }
    

// submit button pressed
// document.querySelector('#submit').addEventListener('click', (e) => {
//     myState(state = 'submitAnswer') 
    
// })

// next button pressed
document.querySelector('#next').addEventListener('click', (e) => {
    removeFeedback()
    if (count === data.length) {
        myState(state = 'quizEnded')
    } else {
        myState(state = 'loadQuestion')
    }
    
})
 
// play again button pressed
document.querySelector('#play_again').addEventListener('click', (e) => {
    myState(state = 'playAgain')
})

// quit button pressed
document.querySelector('#quit').addEventListener('click', (e) => {
    myState(state = 'quit') 
    
})

// finite state machine

let state = ['difficultySelected', 'requestData', 'gotData', 'error', 'load Question', 'submitAnswer', 'quizEnded', 'playAgain', 'quit']

const myState = (state) => {
    switch (state) {
        case 'difficultySelected':
            diffLevel = document.querySelector('#dropdown').value
            if (diffLevel != 'select') {
                document.getElementById('start').hidden = false
            } else {
                document.getElementById('start').hidden = true
            }
        break
    
        case 'requestData':
            document.getElementById('dropdown').disabled = true
            getData(diffLevel)    
        break

        case 'gotData':
            myState(state = 'loadQuestion')   
        break

        case 'error':

        break
    
        case 'loadQuestion':
            getQuestion(data, count)
            renderAnswers(getAnswers(data, count)) 
            document.getElementById('start').hidden = true 
           
            document.getElementById('next').hidden = true
            document.getElementById('quit').hidden = false
        break

        case 'submitAnswer':
            removeAnswers()
            giveUserFeedback(isAnswerCorrect(answerSelected))
            document.getElementById('next').hidden = false
            count++ 
        break
    
        case 'quizEnded':
            ShowPlayerScore()
            document.getElementById('next').hidden = true
            document.getElementById('play_again').hidden = false
        break

        case 'playAgain':
            removeFeedback()
            resetQuiz()
            myState(state = 'requestData')
            document.getElementById('play_again').hidden = true
        break

        case 'quit':
            removeAnswers()
            removeFeedback()
            resetQuiz()
            document.getElementById('count').innerText = ''
            document.getElementById('question').innerText = 'Select difficulty level and click the start button to begin'
            document.getElementById('dropdown').value = 'select'
            document.getElementById('dropdown').disabled = false
            document.getElementById('submit').hidden = true
            document.getElementById('next').hidden = true
            document.getElementById('play_again').hidden = true
            document.getElementById('quit').hidden = true
        break
        
    }
}
