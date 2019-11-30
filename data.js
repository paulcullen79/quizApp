

// get session token
(function getSessionToken () {
    try {
        const request = new XMLHttpRequest;
        request.open('GET', 'https://opentdb.com/api_token.php?command=request')
        request.send()
        request.onload = () => {
            let res = JSON.parse(request.response)
            let apiResponseCode = res.response_code
            sessionToken = res.token
            if (apiResponseCode != 0) {
                myState(state = 'error')
            } 
            
        }
    }   catch {
        apiResponseCode = 1
        console.log(apiResponseCode)
        myState(state = 'error')
    }
    
}) ()

// get quiz data from API
const getData = (categorySelected, difficulty, token) => {
    try {
        const request = new XMLHttpRequest;
        request.open('GET', `https://opentdb.com/api.php?amount=10&token=${sessionToken}&category=${categorySelected}&difficulty=${difficulty}`)
        request.send()
        request.onload = () => {
            let resObject = JSON.parse(request.response)
            apiResponseCode = resObject.response_code
            if (apiResponseCode != 0) {
                myState(state = 'error')
            } else {
                data = resObject.results 
                console.log(data)
                myState(state = 'loadQuestion')   
            }
                    
        }
    }   catch {
        myState(state = 'error')
    }
        
}

export { getData }