const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000


app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/shortURL')
})

app.get('/shortURL', (req, res) => {
  
  const fullURL = req.query.transform?.trim();
  let search= "none" //一開始沒有設置搜尋
  if (typeof(fullURL)==='string'){
    search = fullURL.length>0 ? "yes" : "empty" //當fullURL被宣告 檢測字串長度
  }
  if (search==="none"){res.render('home' , {fullURL})}
  else if (search==="yes"){res.render('search' , {fullURL})}
  else if (search==="empty")res.render('empty')
})





app.listen(port, () => {
  console.log(`Click : http://localhost:3000/shortURL`)
})