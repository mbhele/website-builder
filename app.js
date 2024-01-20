// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://websiteclient:K8K1iBAOzjSMnnIl@cluster0.f7diq.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a schema for the data
const websiteSchema = new mongoose.Schema({
  name: String,
  message: String
});

// Create a model based on the schema
const Website = mongoose.model('Website', websiteSchema);

// Set up EJS and bodyParser
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', (req, res) => {
  // Extract data from the form
  const { name, message } = req.body;

  // Create a new website entry
  const newWebsite = new Website({
    name,
    message
  });

  // Save it to the database
  newWebsite.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
      res.send('Error submitting data');
    });
});

// New route to display submitted data
app.get('/submissions', (req, res) => {
  Website.find({})
    .then(data => {
      res.render('submissions', { submissions: data });
    })
    .catch(err => {
      console.error(err);
      res.send('Error fetching data');
    });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
