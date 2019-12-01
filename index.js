// call to trivia API and returns question to display

import { getData, getSessionToken } from "./data.js"


// global variables
let currentScore = 0
let answerSelected
let diffLevel
let category
let count = 0



// request session token
let sessionToken = getSessionToken()




// functions

// filter questions for special characters
const filterQuestionString = (string) => {
    const specialChars = ['&quot;', '&#039;']
    const replacementChars = ['"',"'"]
    for (let x = 0; x < specialChars.length; x++) {
        let regex = RegExp(specialChars[x], 'g')
        string = (string.replace(regex, replacementChars[x]))
    }
    return string
}




// get new question
const getQuestion = (array, num) => { 
    document.getElementById('question').innerText = filterQuestionString(array[num]['question'])
    document.getElementById('count').innerText = `Question ${num+1}:`                
} 

// remove question and show score
const ShowPlayerScore = () => {
    document.getElementById('question').innerText = ''
    document.getElementById('count').innerText = ''
    document.getElementById('finalScore').textContent = `Quiz ended: You answered ${currentScore} out of ${count} correctly!`
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
    let x=0
    array.forEach(function (element) {
        
        let listEl = document.getElementById('list')
        let itemEl = document.createElement('li')
        let buttonEl = document.createElement('button')
        buttonEl.setAttribute('class', 'answer')
        buttonEl.setAttribute('id', 'answer'+ x)
        x++
        listEl.appendChild(itemEl)
        itemEl.append(buttonEl)
        buttonEl.textContent = element 
        answerEventListener(buttonEl)  
    })
 }

 // add event listeners to answers
 const answerEventListener = (element) => {
    element.addEventListener('click', (e) => {
        answerSelected =  e.target.textContent
        myState(state = 'submitAnswer')
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
 // remove final score
 const removeFinalScore = () => {
    document.getElementById('finalScore').textContent = ''
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
        let feedback  = document.getElementById('feedback')
        feedback.textContent = `Wrong! The correct answer is: ${data[count].correct_answer}`
        feedback.setAttribute('style', 'color: red;')
    } else {
        let feedback = document.getElementById('feedback')
        feedback.textContent = 'Correct!'
        feedback.setAttribute("style", "color:  rgb(111, 211, 86);");
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

// error hide buttons
const hideButtons = () => {
    document.getElementById('start').hidden = true 
    document.getElementById('next').hidden = true
    document.getElementById('quit').hidden = false
}

// event listeners
// select difficulty level
document.querySelector('#categoryDD').addEventListener('change', (e) => { 
    myState(state = 'categorySelect')
})

// select difficulty level
document.querySelector('#dropdown').addEventListener('change', (e) => { 
    myState(state = 'difficultySelect')
})

// start button pressed
document.querySelector('#start').addEventListener('click', (e) => {
    myState(state = 'requestData')
})

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

let state = ['categorySelect', 'difficultySelect', 'requestData', 'gotData', 'error', 'load Question', 'submitAnswer', 'quizEnded', 'playAgain', 'quit']

const myState = (state) => {
    switch (state) {
        case 'categorySelect':
            category = document.querySelector('#categoryDD').value
            if (category != 'select') {
                myState(state = 'difficultySelect')
            }
        break
        case 'difficultySelect':
            diffLevel = document.querySelector('#dropdown').value
            if (diffLevel != 'select') {
                document.getElementById('start').hidden = false
            } else {
                document.getElementById('start').hidden = true
            }
        break
    
        case 'requestData':
            document.getElementById('dropdown').hidden = true
            let p = new Promise((resolve, reject) => {
                data = getData(category, diffLevel, sessionToken)
                if (data != []) {
                    resolve(data)
                } else {
                    reject('Error: Cannot get data')
                }
                
            })
            p.then(myState(state = 'loadQuestion')).catch(myState(state = 'error'))
              
        break

        case 'error':
            document.getElementById('count').innerText = ('Error:')
            document.getElementById('question').innerText = ('No data available')            
            hideButtons()
        break
    
        case 'loadQuestion':
            getQuestion(data, count)
            renderAnswers(getAnswers(data, count)) 
            hideButtons()
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
            removeFinalScore()
            resetQuiz()
            myState(state = 'requestData')
            document.getElementById('play_again').hidden = true
        break

        case 'quit':
            removeAnswers()
            removeFeedback()
            removeFinalScore()
            resetQuiz()
            document.getElementById('count').innerText = ''
            document.getElementById('question').innerText = 'Select difficulty level and click the start button to begin'
            document.getElementById('dropdown').value = 'select'
            document.getElementById('dropdown').hidden = false
            document.getElementById('next').hidden = true
            document.getElementById('play_again').hidden = true
            document.getElementById('quit').hidden = true
        break
        
    }
}
