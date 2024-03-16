### Workshop Explanation: Building a Full Stack Application with React and Flask

In this workshop, we will guide you through building a full-stack web application using React for the frontend and Flask for the backend. The application will involve basic CRUD (Create, Read, Update, Delete) operations on user data, with MongoDB as the database.

### Prerequisites

Before we begin, ensure you have the following installed:

- Node.js
- Python 3
- Docker

### Step 1: Setting Up the Project Structure

Let's start by creating the project directory and setting up the initial structure.

```bash
mkdir react-flask-tutorial
cd react-flask-tutorial
```

### Step 2: Creating React Frontend

We'll begin by creating the frontend using Create React App.

```bash
npx create-react-app client
cd client
npm start
```

This sets up a basic React application. You can start the development server by running `npm start`.

### Step 3: Setting Up Flask Backend

Now, let's create the Flask backend.

```bash
mkdir server
cd server
python3 -m venv .venv
. .venv/Scripts/activate
pip install Flask
touch hello.py
```

Inside `hello.py`, we define a basic Flask route:

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

Run the Flask app using:

```bash
flask --app hello run
```

You can access the Flask app at `http://localhost:5000/`.

### Step 4: Linking Frontend and Backend

To enable communication between the frontend and backend, we'll install and configure Flask-CORS.

```bash
pip install flask-cors
```

Now, we update `hello.py` to include CORS support and an additional route for receiving POST requests:

```python
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
    
@app.route("/hello", methods=["POST"])
def hello():
    data = request.get_json()
    return {"hello": data["name"]}
```

### Step 5: Implementing CRUD Operations with MongoDB

We'll integrate MongoDB for database operations. Ensure you have Docker installed, then run a MongoDB container:

```bash
docker run --env=HOME=/data/db --volume=~/workspace/tailed/workshop/react-flask-tutorial/db:/data/db --volume=/data/configdb --volume=/data/db -p 27017:27017 -d mongo:latest
```

Install `pymongo` for Python MongoDB interaction:

```bash
pip install pymongo
```

In `hello.py`, we define routes for CRUD operations on user data.

```python
import datetime
import json
from bson import ObjectId
from flask import Flask, request
from flask.json.provider import JSONProvider
from flask_cors import CORS
from pymongo import MongoClient

# Custom JSON Encoder to handle ObjectId and datetime
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)

# Custom JSON Provider to use the custom encoder
class CustomJSONProvider(JSONProvider):
    def dumps(self, obj, **kwargs):
        return json.dumps(obj, **kwargs, cls=JSONEncoder)

    def loads(self, s: str | bytes, **kwargs):
        return json.loads(s, **kwargs)

app = Flask(__name__)
CORS(app)

# Set custom JSON provider
app.json = CustomJSONProvider(app)

# Connect to MongoDB
def get_database():
    CONNECTION_STRING = "mongodb://localhost:27017/"
    client = MongoClient(CONNECTION_STRING)
    return client['demo']

dbname = get_database()
collection_name = dbname["users"]

# Routes for CRUD operations
@app.route("/users", methods=["GET"])
def get_users():
    users = list(collection_name.find())
    return users

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    user = collection_name.insert_one(data)
    data["_id"] = user.inserted_id
    return data

@app.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    collection_name.delete_one({"_id": ObjectId(id)})
    return {"message": "User deleted"}

@app.route("/users/<id>", methods=["PUT"])
def update_user(id):
    data = request.get_json()
    collection_name.update_one({"_id": ObjectId(id)}, {"$set": data})
    data["_id"] = id
    return data
```

### Step 6: Styling with Tailwind CSS

We'll use Tailwind CSS for styling. Install Tailwind CSS and create a configuration file:

```bash
npm install -D tailwindcss
npx tailwindcss init
```

Modify the `tailwind.config.js` file:

```javascript
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Include Tailwind CSS in your project's CSS file (`App.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Update the frontend React components to utilize Tailwind CSS classes for styling.

```jsx
// container    className={"bg-zinc-800 min-h-[100vh] flex flex-col items-center justify-center gap-5 text-white"}
// button green className={"bg-green-700 hover:bg-green-800 rounded p-2"}
// button red   className={"bg-red-500 hover:bg-red-600 rounded p-2"}
// button blue  className={"bg-blue-500 hover:bg-blue-600 rounded p-2"}
// li           className={"flex flex-col gap-2 border rounded p-5 ml-3"}
// input        className={"rounded bg-zinc-600 p-2"}
```

```javascript
import './App.css';

import {useEffect, useState} from "react";

function App() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/users")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUsers(data);
            })
    }, []);

    return (
        <div className="App">
            <header className={"bg-zinc-800 min-h-[100vh] flex flex-col items-center justify-center gap-5 text-white"}>
                <form className={"flex gap-2"} onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.target);
                    fetch("http://localhost:5000/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: data.get('name')
                        })
                    }).then(response => response.json())
                        .then(data => {
                            console.log("create", users, data);
                            setUsers([...users, data]);
                        })
                }}>
                    <input name="name" type={"text"} className={"bg-zinc-600 rounded p-2"}/>
                    <button type={"submit"} className={"bg-green-700 hover:bg-green-800 rounded p-2"}>Create User</button>
                </form>
                <ul>
                    {users.map((user, index) => {
                        return <li key={index} className={"flex flex-col gap-2 border rounded p-5 ml-3"}>
                            <div className={"flex items-center gap-2"}>
                                <p className={"text-2xl"}>{user.name}</p>
                                <button className={"bg-red-500 hover:bg-red-600 rounded p-2"} onClick={() => {
                                    console.log("delete", user._id);
                                    fetch(`http://localhost:5000/users/${user._id}`, {
                                        method: "DELETE"
                                    }).then(() => {
                                        setUsers(users.filter(u => u._id !== user._id));
                                    })
                                }}>Delete
                                </button>
                            </div>
                            <form className={"flex gap-2"} onSubmit={(event) => {
                                event.preventDefault();
                                const data = new FormData(event.target);
                                console.log("update", user);
                                fetch(`http://localhost:5000/users/${user._id}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        name: data.get('name')
                                    })
                                }).then(response => response.json())
                                    .then(data => {
                                        console.log("update", users, data);
                                        setUsers(users.map(u => {
                                            if (u._id === user._id) {
                                                return data;
                                            }
                                            return u;
                                        }));
                                    })
                            }}>
                                <input name="name" type={"text"} className={"rounded bg-zinc-600 p-2"}/>
                                <button type={"submit"} className={"bg-blue-500 hover:bg-blue-600 rounded p-2"}>Update</button>
                            </form>
                        </li>
                    })}
                </ul>
            </header>
        </div>
    );
}

export default App;
```

### Conclusion

You've now built a full-stack web application using React for the frontend, Flask for the backend, MongoDB for the database, and Tailwind CSS for styling. This application allows for basic CRUD operations on user data, demonstrating the integration of frontend and backend technologies.