const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const Drive = require("./model/schema")
const express = require("express")
const router = express.Router()
const url = "mongodb://localhost/G-Drive";
const app = express();
const mongoose = require ("mongoose")
var cors = require("cors");
app.use(cors());
app.use(router)

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("CONNECTED To DATABASE");
});


app.use(express.json());

app.listen(7000, () => {
    console.log("SERVER STARTED");
  });

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content),listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

var file_ids = [];
var file_names=[];
var file_links=[]
var content=[]

const dir ='files'

fs.readdir(dir,(err,files)=>{
    if(err){
        throw err
    }
    for(let i=0; i<files.length;i++){
        console.log(files[i])
        var readfi = readingFile('files/'+files[i])
        content.push(readfi)
    }
    //console.log(readfi)
    //console.log(content)
    
})


function readingFile(file){
   const data = fs.readFileSync(file,'utf8')
   //console.log(data)
   return data;
}
/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listFiles(auth) {
  const drive = google.drive({ version: "v3", auth });
  drive.files.list(
    {
      fields: "nextPageToken, files(id, name, webViewLink)",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = res.data.files;
      if (files.length) {
        console.log("Files:");
        files.map((file) => {
          //console.log(`${file.name} (${file.id}) (${file.webViewLink} `);
          file_ids.push(file.id);
          file_names.push(file.name)
          file_links.push(file.webViewLink)
        });
      } else {
        console.log("No files found.");
      }
      //console.log(file_ids);
      //console.log(files)
      for(let i=0; i<4; i++){
        //downloadFile(file_ids[i])
      var read =  content[i]
        names = file_names[i]
        id = file_ids[i]
        link = file_links[i]

        var obj = {fileName: names , fileId: id, fileLink: link, fileContent: read}
        //var obj = {fileName: names , fileId: id}

        Drive.create(obj,(err,res)=>{
            if(err) throw err;
            //console.log("file added"+ res)
        })
      }
      
    }
  );
}
//  var data = Drive.find()
 //console.log(Drive.find({}))
function downloadFile(auth) {
  const drive = google.drive({ version: "v3", auth });
  var fileId = '1PL3hLsuySO84QYCzzIJKgOnkMt_1vkR2';
  var dest = fs.createWriteStream('./FILE_NAME.extension');
  drive.files.get({ fileId: fileId, alt: "media" }), { responseType: "stream" },
  (err,res)=>{
    res.data
    .on('end',()=>{
        console.log("Done")
    })
    .on('error',err=>{
        console.log("error: " + err)
    })
    .pipe(dest)
  }
}




//  async function downloadFile(realFileId){
    

//   const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/drive'});
//   const service = google.drive({version: 'v3', auth});

//   fileId = realFileId;
//   try {
//     const file = await service.files.get({
//       fileId: fileId,
//       alt: 'media',
//     });
//     console.log(file.status);
//     return file.status;
//   } catch (err) {
//     // TODO(developer) - Handle error
//     throw err;
//   }
//  }


async function createIndex(){
    var reply =await Drive.find({ $text: { $search: "naman" } })
    
    console.log(reply) 
}
//createIndex();
router.get('/every',async(req,res)=>{
    const ev = await Drive.find()
    res.json(ev)
})
router.get('/search/:search', async(req,res)=>{
    try{
        const reply = await Drive.find({ $text: { $search: req.params.search } });
        res.json(reply)
        console.log(reply)
    }
    catch(err){
        res.send(err)

    }
})

module.exports = router;