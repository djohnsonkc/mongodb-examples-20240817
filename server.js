
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const myAPI = require('./api');


//********************************************************************************
// CRUD endpoints for myAPI (NO Security in this example)
//********************************************************************************
app.get('/api/somethings', myApi.getAllItems); // only super users can access
app.get('/api/somethings/:id', myAPI.getItemById);
app.post('/api/somethings', myAPI.addItem);
app.put('/api/somethings/:id', myAPI.updateItem);
app.delete('/api/somethings/:id', myAPI.deleteItem);
app.patch('/api/somethings/a-specific-attribute', myAPI.patchItem);


//********************************************************************************
// Web server
//********************************************************************************
var port = process.env.PORT || 3000; 
const pool = require('./mongodb/connectionPool');
pool.init(function(status){
    if(status.ok) {
        server.listen(port, function () {
            console.log("Express server listening on port " + port);
        }); 
    }
    else {
        console.log("db connection failed", status);
    }
});

