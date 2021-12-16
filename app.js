const express = require('express')
const app = express()
const {MongoClient,ObjectId} = require('mongodb')

const DATABASE_URL = 'mongodb+srv://donams:Sktt1micheal1@cluster0.cazee.mongodb.net/test'// dường đãn đén mongodb
const DATABASE_NAME = 'GCH0901_DB'//

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.post('/edit',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const id = req.body.txtId
    
    const myquery = { _id: ObjectId(id) }
    const newvalues = { $set: {name: nameInput, price: priceInput,picURL:picURLInput } }
    const dbo = await getDatabase()
    await dbo.collection("Products").updateOne(myquery,newvalues)
    res.redirect('/view')
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id
    //truy cap database lay product co id o tren
    const dbo = await getDatabase()
    const productToEdit = await dbo.collection("Products").findOne({_id:ObjectId(id)})
    res.render('edit',{product:productToEdit})
})

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/insert',(req,res)=>{
    res.render('product')
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    console.log("id can xoa:"+ id)
    const dbo = await getDatabase()
    await dbo.collection("Products").deleteOne({_id:ObjectId(id)})
    res.redirect('/view')
})

app.get('/view',async (req,res)=>{
    //1. lay du lieu tu Mongo
    const dbo = await getDatabase()
    const results = await dbo.collection("Products").find({}).sort({name:1}).limit(7).toArray()
    //2. hien thi du lieu qua HBS
    res.render('view',{products:results})
})

app.post('/product',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    if(isNaN(priceInput)==true){
        //Khong phai la so, bao loi, ket thuc ham
        const errorMessage = "Gia phai la so!"
        const oldValues = {name:nameInput,price:priceInput,picURL:picURLInput}
        res.render('product',{error:errorMessage,oldValues:oldValues})
        return;
    }
    const newP = {name:nameInput,price:Number.parseFloat(priceInput),picURL:picURLInput}

    const dbo = await getDatabase()
    const result = await dbo.collection("Products").insertOne(newP)
    console.log("Gia tri id moi duoc insert la: ", result.insertedId.toHexString());
    res.redirect('/')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')

async function getDatabase() {
    const client = await MongoClient.connect(DATABASE_URL)
    const dbo = client.db(DATABASE_NAME)
    return dbo
}