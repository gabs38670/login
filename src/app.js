const express = require ('express')
const exphbs = require ('express-handlebars')
const mysql = require ('mysql2')
const session = require ('express-session')

const app = express()

app.engine('handlebars' , exphbs.engine())
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({ extended:true,}));
app.use(express.json())

app.use(session({secret:"chave"}))


function Connectiondb(){
    const con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database: 'autenticacao'
    })
    con.connect((err) =>{
        if(err){
            console.log('Erro connecting to database...',err)
            return
        }
        console.log('Connection established!')
    })
    return con;
}

app.get('/login', (req,res) =>{
    console.log('Usuário fazer login')
    req.session.destroy();
    res.render('login')
})

app.get('/',(req , res)=>{
    res.render('registre')
})

// app.get('/login', (req , res)=>{
//     res.render('login')
// })

app.get('/home', (req , res)=>{
    res.render('home')
})

app.get('home', (req,res) =>{
    if(req,session,user){
        let con = Connectiondb();
        let query2 = 'SELECT * FROM users WHERE emmail LIKE?';
        con.query(query2, [req.session.user],
            function (err, results){
                res.render('login')
            })
    }else{
        res.redirect('login')
    }
})

//registra usuário
app.post('/cadastro',(req , res)=>{
    username = req.body.username
    email = req.body.email
    idade = req.body.idade
    pass = req.body.pass

    let con = Connectiondb()

    let queryConsulta = 'SELECT * FROM users WHERE email LIKE ?';

    con.query(queryConsulta, [email], function (err, results){
        if(results.length > 0){
           console.log('E-mail Já cadastrado');
           res.redirect('/')
        }else{
            let query = 'INSERT INTO users VALUES (DEFAULT, ?,?,?,?)';

            con.query(query, [username , email , idade , pass], function (err ,results){
                if(err){
                    throw err;
                }else{
                    console.log("usuario adicionado com email"  + email);
                    res.redirect('/')
                }


            });
        }

    });
});

// fim registro usuário



app.post('/acesso',(req , res)=>{
    email = req.body.email
    pass = req.body.pass
    let con = Connectiondb();
    let query = 'SELECT * FROM users WHERE pass = ? AND email LIKE ?'

    con.query(query, [pass , email], function(err ,results){
        if(results.length > 0){
            req.session.user = email;
            console.log('Login efetuado com sucesso!');
            res.render('home')
        }else{
            console.log('Login incorreto')
            res.render('login')
        }

    })

})









app.listen(8081,()=> console.log('Porta conectada'))