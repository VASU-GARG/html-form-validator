const express = require('express');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const {matchedData, sanitizeBody} = require('express-validator/filter');

const app = express();

app.set('view engine','twig');
app.set('views','./public/views');

app.use(express.static('public'));


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/',(req,res)=>{
    res.render('login', {
        title: "login"
    });
});


app.post('/',urlencodedParser,[
    check('email','enter a valid email id').isEmail(),
    check('add1','address must be atleast 5 characters long').isLength({min:5}),
    check('add2','address must be atleast 5 characters long').isLength({min:5}),
    check('city','city must be atleast 3 characters long').isLength({min:3}),
    check('state','enter a valid state').isLength({min:3}),
    check('zipCode','enter a valid pin code').isLength({min:6,max:6}),
    check('password','minimum 8 characters').isLength({min:8}),
    check('cpassword').custom((value,{req})=>{
        if(value!= req.body.password)
        {
            throw new Error('password not matched');
        }
        else{
            return true;
        }
    })
],
(req,res)=>{
    const errors = validationResult(req);
    const userData = matchedData(req);

    if(!errors.isEmpty())
    {
        console.log(errors.mapped());
        console.log(userData);
        res.render('login',{
            title:"login",
            data:userData,
            err:errors.mapped()
           
        });
    }
    else{
        res.render('loggedIn',{
            title:"welcome",
            name:req.body.email
        });
    }
});

app.listen(3000,(req,res)=>{
    console.log("server is running at port 3000");
})

