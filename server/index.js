var express=require('express');
var bodyParser = require('body-parser')
var app=express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const db = {
    "tasks":[
        {
            "id":1,
            "title":"Read Book",
            "description":"learning reactjs",
            "status":0
        },
        {
            "id":2,
            "title":"Play game",
            "description":"",
            "status":1
        },
        {
            "id":3,
            "title":"learning java",
            "description":"",
            "status":2
        }
    ],
    "customers": [
        {
            "id":1,
            "first_name":"Johnson",
            "last_name":"James",
            "phone_number":"",
            "birth_day":13,
            "sex":"Nam",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":2,
            "first_name":"Smith",
            "last_name":"Michael",
            "phone_number":"",
            "birth_day":22,
            "sex":"Nam",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":3,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":4,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":5,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":6,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        }
        ,   {
            "id":7,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":8,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":9,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":10,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":11,
            "first_name":"Hernandez",
            "last_name":"Maria",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        },
        {
            "id":12,
            "first_name":"Phong",
            "last_name":"Phong",
            "phone_number":"",
            "birth_day":25,
            "sex":"Nữ",
            "address":"Viet Nam",
            "buy_count":1
        }
        
    ]
}

app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

app.listen(3000);

app.get('/',function(req,res){
    res.render("home");
})

app.get('/api/v1/customers', function(req,res){
    let currentPage = req.query.currentPage == 'undefined' ?0:req.query.currentPage 
    let pageSize = req.query.pageSize == 'undefined'?10:req.query.pageSize 
    
    let data = []
    let a= (currentPage+1)*pageSize

    db["customers"].forEach((o, i)=>{
      
        if (o.id <a){
            data.push(o)
        }
    })
    console.log(data.length)
    res.json({totalCount:db["customers"].length, listCustomer:data})
})


app.get('/api/v1/customers/search', function(req,res){
    let textQuery = req.query.q
    console.log(textQuery)
    let data = []

    db["customers"].forEach((o, i)=>{
        if(i<3){
            data.push(o)
        }
    })
    res.json({totalCount:data.length, listCustomer:data})
})

app.post('/api/v1/customers', function(req,res){
    db['customers'].push(req.body)
    res.json({}), 201
})

app.put('/api/v1/customers', function(req,res){
    let customer = req.body;
    console.log(customer)
    for (var i = 0; i < db['customers'].length; i++) {
        var obj = db['customers'][i];
        if(obj.id == customer.id){
            if (customer.first_name){
                obj.first_name=customer.first_name
            }
            if (customer.last_name){
                obj.last_name=customer.last_name
            }
            if (customer.phone_number){
                obj.phone_number=customer.phone_number
            }
            if (customer.birth_day){
                obj.birth_day=customer.birth_day
            }
            if (customer.address){
                obj.address=customer.address
            }
            if (customer.sex){
                obj.sex=customer.sex
            }

            if (customer.buy_count){
                obj.buy_count=customer.buy_count
            }
            console.log(obj)
        }
    } 
    res.json({}), 201
})

app.delete('/api/v1/customers/:id', function(req,res){
    let id = req.params.id
    for (var i = 0; i < db['customers'].length; i++) {
        var obj = db['customers'][i];
        if(obj.id == id){
            db['customers'].splice(i, 1);
        }
    } 
    res.json({}), 200
})