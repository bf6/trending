const express = require('express')
const reader = require('feed-reader')
const request = require('request')
const _ = require('lodash')
const natural = require('natural')
const pos = require('pos')

let termFreq = new natural.TfIdf()


const app = express()

const parseFeedEntries = async () => {
	let entries = []
	const feedUrls = [
		'http://rss.cnn.com/rss/cnn_topstories.rss',
		'http://feeds.foxnews.com/foxnews/latest',
		'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'
	]
	for (let url of feedUrls) {
		try {
			parsedFeed = await reader.parse(url)
			entries = entries.concat(parsedFeed.entries)
		} catch (err) {
			continue
		}
	}
	return entries
}

app.get('/trending', async (req, res) => {
	// Parse the feeds
	let entries = await parseFeedEntries()
	let titleString = _.map(entries, e => e.title).join(' ')

	// Extract tokens
	let words = new pos.Lexer().lex(titleString)
	let tagger = new pos.Tagger()

	// Get the proper nouns
	let terms = _.filter(tagger.tag(words), w => {
		return w[1] === 'NNP' || w[1] === 'NNPS'
	})

	// Make a new document
	terms = _.map(terms, t => t[0]).join(' ')
	termFreq.addDocument(terms)

	// Sort terms by their term-frequency-inverse-document-frequency
	// and get the top 10
	topics = _.sortBy(termFreq.listTerms(0), item => -item.tfidf).map(item => item.term).slice(0, 10)
	res.send({topics})
})

app.listen(8888, () => console.log('running on port 8888'))