const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const http = require('http');
const https = require('https');
let fullURL;
let data=''
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/shortURL')
})




app.get('/shortURL', async (req, res) => { //若無設置async/await 渲染有可能搶先
  
  fullURL = req.query.transform?.trim();
  let search= "none" //一開始沒有設置搜尋
  if ( (typeof(fullURL)==='string') && (fullURL.length===0)){ //搜尋有被建立 但是空搜尋
    search="empty" 
  }
  else if ((typeof(fullURL)==='string') && (fullURL.length>0)) { //搜尋有被建立 檢查並回傳網址
    await isURLvalid(fullURL).then((result)=>{
      if (result){
        console.log("有效網址 : " + fullURL)
        search ="success"
      }else{
        console.log("無效網址 : " + fullURL)
        search = "wrong"
      }
    }).catch((err)=>{
      search = "wrong"
    })
  }


  if (search==="none"){
      res.render('home' , {fullURL})
    }else if (search==="success"){
      res.render('success' , {fullURL})
    }else if (search==="empty"){
      res.render('empty')
    }else if (search==="wrong"){
      res.render('wrong')
    }
})





app.listen(port, () => {
  console.log(`Click : http://localhost:3000/shortURL`)
})

function isURLvalid(url){
    return new Promise((resolve,reject)=>{
      let protocol;
      if (url.startsWith('https')){ //重要!! 如果把https放在http下面 https的網址就會優先被設定http
          protocol=https
      }else if (url.startsWith('http')){
          protocol=http
      }else {
          resolve(false)
      }
      protocol.get(url,(res)=>{
        if (res.statusCode===200){
          resolve(true)
        }
        else {
          resolve(false)
        }
      }).on('error', (err) => {
      reject(err) })
    })
}

function getRandomNumbers(){
  
  while(data.length<5){
    data=''
    const type=Math.floor(Math.random()*3)
    let word=''
    switch (type){
      case 0 : word =String.fromCharCode(Math.floor(Math.random() * 26) + 97);break;
      case 1 : word =String.fromCharCode(Math.floor(Math.random() * 26) + 65);break;
      case 2 : word =String.fromCharCode(Math.floor(Math.random() * 11) + 47);
    }
    data+=word
  }
}