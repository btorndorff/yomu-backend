const express = require('express');
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { MangaSee } = require('@specify_/mangascraper');
const cors = require('cors')

const app = express();
var jsonParser = bodyParser.json()
const mangasee = new MangaSee({ puppeteerInstance: { instance: 'default', launch: { args: ['--no-sandbox'] } } });
const uri = "mongodb+srv://borff:56709Telephone@manga.gcizg8q.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  console.log("connected!")
});

app.use(cors())

app.get('/', (req, res) => {
  res.send("Hello World!");
});

// get methods

/* 
  GET /manga/
  Retrieves a manga by url

  Query parameters:
    - url: the url of the manga to retrieve
*/
app.get('/manga', async (req, res) => {
  const url = req.query.url;
  const manga = await mangasee.getMangaMeta(url);
  res.send(manga)
});

/* 
  GET /chapter/
  Retrieves a chapter by url

  Query parameters:
    - url: the url of the chapter to retrieve
*/
app.get('/chapter', async (req, res) => {
  const url = req.query.url
  const chapter = await mangasee.getPages(url);
  res.send(chapter)
});

/* 
  GET /search/
  Retrieves search results of title

  Query parameters:
    - title: the title of the manga to search for
*/

app.get('/search', async (req, res) => {
  const title = req.query.title
  const results = await mangasee.search(title);
  const data = []
  for (const manga of results) {
    let mangaInfo = await mangasee.getMangaMeta(manga.url)
    delete mangaInfo.chapters
    data.push({...mangaInfo, url: manga.url})
  }
  res.send(data)
});

/* 
  GET /hotUpdates/
  Retrieves the latest hot updates from mangasee
*/
app.get('/hotUpdates', async (req, res) => {
  const results = await mangasee.getHotUpdates();
  res.send(results)
});

/* 
  GET /library/
  Retrieves the library of manga
*/
app.get('/library', async (req, res) => {
  
  client.db("library").collection("manga").find({}).sort({"title":1}).toArray((err, results) => {
    res.send(results);
  });
});

// POST methods

/* 
  POST /addManga/
  Add Manga to library
*/
app.post('/addManga', jsonParser, (req, res) => {
  client.db("library").collection("manga").insertOne(req.body, (err, result) => {
    res.send(result);
  });
});

/* 
  POST /removeManga/
  Remove Manga from library
*/
app.post('/removeManga', jsonParser, (req, res) => {
  client.db("library").collection("manga").deleteOne(req.body, (err, result) => {
    res.send(result);
  });
});


// listen port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`);
});