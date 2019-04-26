const {shell} = require('electron')

//creates a DOM Parser instance..used after fetching the text contents
const parser = new DOMParser();

//DOM element Selector
const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

//an eventListener to enable the Submit Button
newLinkUrl.addEventListener('keyup', () => {
newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});


newLinkForm.addEventListener('submit', (event) => {

    //not to trigger HTTP request
    event.preventDefault();

    //grab the url value
    const url = newLinkUrl.value;

    //using Fetch API to fetch the content of the provided URL
    fetch(url)
        .then(validateResponse)
        .then(response => response.text()) //parse the response as plain text
        .then(parseResponse) //parsing response and finding the title
        .then(findTitle) //traverse the DOM tree and find the title
        .then(title =>storeLink(title,url)) //stores the title and URL into local Storage
        .then(clearForm) //clears the input form
        .then(renderLinks) //Creating a function to render all links and add them to the DOM
        .catch(error => handleError(error,url)) //handles error
});


//helper function to clear the input form
const clearForm = () => {
    newLinkUrl.value = null;
}

//Adding functions for parsing response and finding the title
const parseResponse = (text) => {
    return parser.parseFromString(text, 'text/html');
}
const findTitle = (nodes) => {
    return nodes.querySelector('title').innerText;
}

//creating a function to persist links in local storage
const storeLink = (title,url)=>{
    localStorage.setItem(url, JSON.stringify({
        title:title,
        url:url
    }))
}

//creating a function to get links from local storage
const getLinks = ()=>{
    return Object.keys(localStorage)
        .map(key => JSON.parse(localStorage.getItem(key)))
}

//creating a funtion for creating DOM nodes from link data
const convertToElement = (link) =>{
    return `
    <div class = "link">
    <h3>${link.title}</h3>
    <p>
    <a href = "${link.url}">${link.url}</a>
    </p>
    </div>
    `
}

//function to render all links and  add the, to the DOM
const renderLinks = () =>{
    const linksElements = getLinks().map(convertToElement).join('')
    linksSection.innerHTML = linksElements
}

//writing the Clear storage Button
clearStorageButton.addEventListener('click', ()=>{
    localStorage.clear()
    linksSection.innerHTML = ''
})

//handling an error message
const handleError = (error,url) =>{
    errorMessage.innerHTML = `
    There was an issue adding "${url}":${error.message}
    `.trim()

    setTimeout(() => errorMessage.innerHTML = null, 5000)
}

//validating the response from remote servers
const validateResponse = (response) =>{
    if (response.ok){
        return response
    }
    throw new Error(`Status code of ${response.status}
        ${response.statusText}`)
}

//opening links in the user's default browser
linksSection.addEventListener('click', (event)=>{
    if(event.target.href){
        event.preventDefault()
        shell.openExternal(event.target.href)
    }
})

renderLinks()