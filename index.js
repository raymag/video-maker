const readline = require('readline-sync')

function start(){
    const content = {}

    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchTerm(){
        return readline.question('Type a Wikipedia Search Term? ')
    }

    function askAndReturnPrefix(){
        const prefixes = ['Who is', 'What is', 'The hystory of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one prefix: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]
        return selectedPrefixText
    }

    console.log(content)
}
start()