const imageDownloader = require('image-downloader')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state')

const googleSearchCredentials = require('../credentials/google-search.json')

async function robot(){
    const content = state.load()

    await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)

    state.save(content)

    async function fetchImagesOfAllSentences(content){
        for (const sentence of content.sentences){
            const query = `${content.searchTerm} ${sentence.keywords[0]}`
            sentence.images = await fetchGoogleAndReturnImagesLInks(query)
            console.log(sentence.images)

            sentence.googleSearchQuery = query
        }    
    }

    async function fetchGoogleAndReturnImagesLInks(query){
        try {
            const response = await customSearch.cse.list({
                auth: googleSearchCredentials.apiKey,
                cx: googleSearchCredentials.searchEngineId,
                q: query,
                searchType: 'image',
                imgSize: 'huge',
                num: 4
            })

            const imagesUrl = response.data.items.map((item) => {
                return item.link || ''
            }) 

            return imagesUrl
        } catch (error) {
            return []
        }
    }

    async function downloadAllImages(content){
        content.downloadedImages = []

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++){
            if (content.sentences[sentenceIndex].images === undefined){
                content.sentences[sentenceIndex].images = []
            }
            const images = content.sentences[sentenceIndex].images

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++){
                const imageUrl = images[imageIndex]

                try {
                    if (content.downloadedImages.includes(imageUrl)){
                        throw new Error('Image was already downloaded.')
                    }
                    await downloadAndSaveImage(imageUrl, `${sentenceIndex}-original.png`)
                    content.downloadedImages.push(imageUrl)
                    console.log(`> [${sentenceIndex}][${imageIndex}] Image was successfully downloaded: ${imageUrl}`)
                    break
                } catch (error) {
                    console.log(`> [${sentenceIndex}][${imageIndex}] Image was not downloaded: ${imageUrl}`)
                }
            }
        }
    }

    async function downloadAndSaveImage(url, fileName){
        return imageDownloader.image({
            url, url,
            dest: `./content/${fileName}`
        })
    }
}

module.exports = robot