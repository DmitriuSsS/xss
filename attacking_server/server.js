const express = require("express");

const app = express();

app.get("/good", function(request, response){
    console.log(request.query);
    response.send("Ok");
});

app.listen(4200);
