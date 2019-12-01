

// session token request to API
const getSessionToken = () => {
    const request = new XMLHttpRequest;
    request.open('GET', 'https://opentdb.com/api_token.php?command=request')
    request.send()
    request.onload = () => {
        let res = JSON.parse(request.response)
        return res.token 
    }
} 
 
    
// get quiz data from API
const getData = (cat, level, token) => {
    

    // http request to API
    const request = new XMLHttpRequest;
    request.open('GET', `https://opentdb.com/api.php?amount=10&token=${sessionToken}&category=${categorySelected}&difficulty=${difficulty}`)
    request.send()
    request.onload = () => {
        let resObject = JSON.parse(request.response)
        return data = resObject.results 

    }
    
        
}





export { getData, getSessionToken }