const robots = {
    userInput: require('./robots/userInput'),
    text: require('./robots/text')
}

async function start(){
    const content = {}

    robots.userInput(content)
    robots.text(content)

    console.log(content)
}
start()