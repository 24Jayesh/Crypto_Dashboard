const express =require('express');
const app =express();
const port =4040;
var request = require('request');

const bodyParser = require('body-parser');
var multer =require('multer');
var upload = multer();

//body parser
app.use(bodyParser.json());  //for parshing application/json
app.use(bodyParser.urlencoded({extended:true}));

//static engine
app.use(express.static(__dirname +'/public'));
app.set('view engine','ejs');

//multer 
app.use(upload.array());


let mData ="";
let coinName ="bitcoin";
let mChart ="";

async function resData(coinName){
  var marketData = await new Promise((resolve,reject)=>{
    //request url setup(API) 
    request('https://api.coingecko.com/api/v3/coins/'+ coinName, function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was receive.
      // console.log('body:', body);
      mData =JSON.parse(body)
      resolve(mData) 
    });

  })
  
  if(marketData){
  var marketChart = await new Promise((resolve,reject)=>{
    //request url setup(API) 
    request('https://api.coingecko.com/api/v3/coins/'+ coinName +'/market_chart?vs_currency=usd&days=30', function (error, response, body) {
      console.error('error:', error); 
      console.log('statusCode:', response && response.statusCode); 
      // console.log('body:', body);
     mChart =JSON.parse(body)
     
     resolve(mData) 
    });

  })
}

}

app.get('/',async(req,resp)=>{
  await resData(coinName);
    resp.render('index',{mData,mChart,coinName});
});

app.post('/',async(req,resp)=>{
  coinName =req.body.selectCoin;
  await resData(coinName);
  resp.render('index',{mData,mChart,coinName});
   
});

app.listen(port,()=>{
   console.log(`app listing on port http://localhost:${port}`);
})
