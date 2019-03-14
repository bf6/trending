# Trending Topics

### Installation
1. `git clone ''`
2. `npm install`
3. `npm start`
4. `curl localhost:8888/trending`
4. 🔥🔥🔥

### Approach

This is a NLP-based solution that uses part-of-speech tagging to get the most frequent terms from the titles of each feed entry. The procedure is as follows:

1. Parse the RSS feeds from NYT, CNN and Fox
2. Get the titles for each entry
3. Tag the part-of-speech for each word in the title
4. Filter for proper nouns
5. Join all proper nouns in a single document
6. Get the term-frequency-inverse-document-frequency for each term in the new document, which is a rough measure of the importance of a word in that document
7. Return the top 10 terms

### Discussion

To get a more accurate measure of whether a topic is "trending", one strategy is to weigh each term by a time-based exponential decay relative to the publish date of the article the term appears in. The POS tagging could also be improved using various heuristics - filtering out common words and phrases for example.

In a more production-ready application there might be a parsing class with multiple feed-specific parsing implementations that could apply special rules to the parsed result.

You could also have multiple strategies for finding trending topics. You could score each term according to the strategy used weighed by some factor. 
