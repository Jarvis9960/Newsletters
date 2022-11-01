const express = require("express");
const bodyParse = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParse.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.listen(3000, function() {
  console.log("server is running on 3000 port");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.First;
  const lastName = req.body.Last;
  const email = req.body.Email;

  const data = {
    email_address: email,
    status: "subscribed",
    merge_field: {
      FNAME: firstName,
      LNAME: lastName
    }
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/fe630795c4/members";
  // c1496b31b91289e45d2e8f0e5023d2b5-us21
  const options = {
    method: "POST",
    auth: "Ankit:c1496b31b91289e45d2e8f0e5023d2b5-us21"
  };

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();

});
