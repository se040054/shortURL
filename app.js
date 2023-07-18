
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const http = require('http');
const https = require('https');
const URLlist=require('./public/json/data.json').result ;
const fs = require('fs');





app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/shortURL')
})



app.get('/shortURL', async (req, res) => { //若無設置async/await 渲染有可能搶先
  let fullURL;
  let shortURL;
  fullURL = req.query.transform?.trim();
  let search= "none" //一開始沒有設置搜尋
  if ( (typeof(fullURL)==='string') && (fullURL.length===0)){ //搜尋有被建立 但是空搜尋 若使用者沒有輸入內容，就按下了送出鈕，需要防止表單送出並提示使用者
    search="empty" 
  }
  else if ((typeof(fullURL)==='string') && (fullURL.length>0)) { //搜尋有被建立 檢查並回傳網址
    await isURLvalid(fullURL).then((result)=>{
      if (result){
      //  console.log("有效網址 : " + fullURL)
        search ="success"
          writeJSON(fullURL)
           URLlist.some(URLpair =>{ 
           if (URLpair.full===fullURL){
            shortURL=URLpair.short
              return 
            }
  })

      }else{
      //  console.log("無效網址 : " + fullURL)
        search = "wrong"
      }
    }).catch((err)=>{
      search = "wrong"
    })
  }


  if (search==="none"){
      res.render('home' , {fullURL})
    }else if (search==="success"){
      res.render('success' , {fullURL,shortURL})
    }else if (search==="empty"){
      res.render('empty')
    }else if (search==="wrong"){
      res.render('wrong')
    }
})


app.get('/shortURL/:id' , (req,res)=>{
  let fullURL;
  let shortURL = req.params.id 
  let find= URLlist.some(URLpair =>{
    if (URLpair.short===shortURL){ 
      fullURL=URLpair.full
      shortURL=URLpair.short
      console.log("找到")
      return true
    }
    
  })
  if(find){
    res.redirect(fullURL)
  }
  else{
    res.render('wrong')
  }
  
})


app.listen(port, () => {
  console.log(`Click : http://localhost:3000/shortURL`)
})

function isURLvalid(url){
    return new Promise((resolve,reject)=>{
      let protocol;
      if (url.startsWith('https')){ //重要!! 如果把https放在http下面 https的網址就會優先被設定http導致判定錯誤
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
  let data=''
  while(data.length<5){
    const type=Math.floor(Math.random()*3)
    let word=''
    switch (type){
      case 0 : word =String.fromCharCode(Math.floor(Math.random() * 26) + 97);break;
      case 1 : word =String.fromCharCode(Math.floor(Math.random() * 26) + 65);break;
      case 2 : word =String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    }
    data+=word
  }return data
}

function writeJSON(fullURL){ //檢查長網址是否已有配對，生成短網址，檢查生成的短網址有無重複
  const pairURL ={"short":'',
                  "full":fullURL} 
  let find = URLlist.some(URLpair =>{
    if (URLpair.full===fullURL){
      pairURL.short=URLpair.short
      let shortURL=URLpair.short
      return true
    }
  })
  if (find){
    return
  }
  pairURL.short=getRandomNumbers() //物件短網址屬性賦值隨機亂數
  let shortURL =pairURL.short
  JsonURL = require('./public/json/data.json') //JSON檔案拿出來
  JsonURL.result.push(pairURL) //改寫檔案
  const JsonData=JSON.stringify(JsonURL)
  fs.writeFile('./public/json/data.json',JsonData , (err)=>{
    if (err){
     // console.log(JsonData +"寫入失敗")
    }
    else {
     // console.log(JsonData +"寫入成功")
    }
  })
}

