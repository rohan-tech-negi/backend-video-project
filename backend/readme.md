now a sum up of how we setup this project 


1 - we define the folder structure 
    - controller
    - db
    - middlewares
    - modles
    - routes
    - utils


2 - installing development dependencies as dev dependencies

3 - setting up prettierrc
{
    "singleQuote": false,
    "bracketSpacing": true,
    "tabWidth": 2,
    "semi": true,
    "trailingComma": "es5"
}  , some prettier setup code things

  4 - setting up the db using mongodb

  5 - we have to setup dotenv but we have module import so we havbe to do steps
  dotenv.config({
    path: "./env"
})



6 - an experimental feature in package.json
"scripts": {
    "dev": "nodemon -r dotnev /config --experimental-json-modules src/index.js"
  },




7 - defining different ways of pasing the main index file as 
import dotenv from "dotenv"

import express from "Express"
import DbConnection from "./db/index.js"

dotenv.config({
    path: "./env"
})

const app = express()



<!-- via passing the db connection ew can also pass the app.listen -->
DbConnection()
.then(()=>{
    app.listeb(process.env.PORT || 8000, ()=>{
        console.log()
    })
})
.catch((error)=>{
    console.log(error)
})


8- we use app.use() mostly for middlewares and config settings


9- use can define cors to allow the user to access the application
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources. CORS also relies on a mechanism by which browsers make a "preflight" request to the server hosting the cross-origin resource, in order to check that the server will permit the actual request. In that preflight, the browser sends headers that indicate the HTTP method and headers that will be used in the actual request.



10 - use of middleware functions
1. CORS Middleware
        app.use(cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }))
🔍 What it does:
Enables Cross-Origin Resource Sharing (CORS)
Allows your frontend (e.g., React app) to talk to your backend if they’re on different domains/ports
🧠 Key parts:
origin: process.env.CORS_ORIGIN
→ Only allows requests from this specific origin (like http://localhost:5173)
credentials: true
→ Allows cookies, authorization headers, etc. to be sent
⚡ Example:

If your frontend is running on port 5173 and backend on 3000 → without CORS, browser blocks requests.

📦 2. JSON Parser
app.use(express.json({limit: "16kb"}))
🔍 What it does:
Parses incoming JSON data in request body
Converts it into req.body
🧠 Example:
{
  "name": "Rohan"
}

Now you can access:

req.body.name  // "Rohan"
⚠️ limit: "16kb"
Prevents large payloads (security + performance)
Rejects requests bigger than 16KB
📝 3. URL-Encoded Parser
app.use(express.urlencoded({extended: true, limit: "16kb"}))
🔍 What it does:
Parses data from HTML forms
🧠 Example form data:
name=Rohan&age=21
⚡ Now available as:
req.body.name // "Rohan"
🔑 extended: true
Allows nested objects (uses qs library)
user[name]=Rohan
📁 4. Static Files Middleware
app.use(express.static("public"))
🔍 What it does:
Serves static files like:
images
CSS
JS
PDFs
🧠 Example:

If you have:

public/logo.png

You can access:

http://localhost:3000/logo.png
🍪 5. Cookie Parser
app.use(cookieParser())
🔍 What it does:
Parses cookies from request headers
🧠 Example:

If browser sends:

Cookie: token=abc123

You can access:

req.cookies.token // "abc123"



11- a sample modeling of the db 
import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema({
    videoFile:{
        type: String,
        required: true
    },
    thumbnail:{
         type: String,
        required: true
    },
    title:{
         type: String,
        required: true
    },
     description:{
         type: String,
        required: true
    },
     duration:{
         type: Number,
        required: true
    },
     views:{
         type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    <!-- this is the foregin key stuff -->
    owner:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
    


},{timestamps: true})

export const Video = mongoose.model("Video", videoSchema)





12- use of videoSchema.plugin(mongooseAggregatePaginate)
What problem does it solve?

When you use Mongoose aggregate(), you don’t get built-in pagination like .find().limit().skip().

So if you have:

10,000 records
and you only want 10 per page

👉 You’d have to manually handle skip + limit + count.

This plugin does that automatically + cleanly.

<!-- this is how we apply it in schema -->
videoSchema.plugin(mongooseAggregatePaginate)





13 - we be working with the pre hooks and methods that can be injected in the model
1. Your pre("save") hook
userModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next()
})

This hook runs automatically before a User document is saved to MongoDB.

For example:

const user = new User({
    username: "rohan",
    password: "mypassword"
})

await user.save()

Before MongoDB actually saves the user, the pre("save") middleware runs.

this

Inside this function:

this

refers to the current user document.

So:

this.password

means the password of the user currently being saved.




2. isModified("password")
if (!this.isModified("password")) return next()

This is important.

It checks:

"Has the password actually changed?"

Suppose you create a user:

password: "hello123"

The hook hashes it:

hello123
↓
$2b$10$....

Later, you update only:

username: "rohan123"

You don't want to hash the already-hashed password again.

Without this check:

hello123
↓
hash 1
↓
hash 2
↓
hash 3

Your original password would effectively be lost.

So:

this.isModified("password")

prevents unnecessary re-hashing.






2. isModified("password")
if (!this.isModified("password")) return next()

This is important.

It checks:

"Has the password actually changed?"

Suppose you create a user:

password: "hello123"

The hook hashes it:

hello123
↓
$2b$10$....

Later, you update only:

username: "rohan123"

You don't want to hash the already-hashed password again.

Without this check:

hello123
↓
hash 1
↓
hash 2
↓
hash 3

Your original password would effectively be lost.

So:

this.isModified("password")

prevents unnecessary re-hashing.







4. isPasswordCorrect()

You created:

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

This is a custom method attached to every User document.

So if you have:

const user = await User.findOne({ username })

you can do:

const isCorrect = await user.isPasswordCorrect("userEnteredPassword")

bcrypt.compare() compares:

User enters:
"hello123"

        ↓

bcrypt.compare()

        ↓

Database:
"$2b$10$....hashed password"

It returns:

true

or

false

This is how login password verification normally works.







5. generateAccessToken()

You have:

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

This creates a JWT access token.

For example, after successful login:

const accessToken = user.generateAccessToken()

The token contains information like:

{
    _id: user._id,
    email: user.email,
    username: user.userName,
    fullName: user.fullName
}

and is signed using:

process.env.ACCESS_TOKEN_SECRET

The expiry comes from:

process.env.ACCESS_TOKEN_EXPIRY

For example your .env might contain:

ACCESS_TOKEN_SECRET=some_super_secret_key
ACCESS_TOKEN_EXPIRY=15m

The access token is generally used to authenticate API requests.

For example:

Login
  ↓
Username + Password
  ↓
Verify password
  ↓
Generate Access Token
  ↓
Client stores token
  ↓
Client requests protected API
  ↓
Server verifies token










6. generateRefreshToken()

Your second method:

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.userName,
            fullName: this.fullName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

works similarly.

But this creates a refresh token.

The major idea is:

Access token

Short-lived:

15 minutes
30 minutes
1 hour

Used frequently for API authentication.

Refresh token

Longer-lived:

7 days
30 days
90 days

Used to obtain a new access token when the old one expires.

