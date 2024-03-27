const mongoose = require('mongoose');

/*
const url =
  `mongodb+srv://heka:${password}@cluster.rvzhvul.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster`
*/

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(res => {
    console.log('connected to MongoDB');
  })
  .catch(err => {
    if (err) {
      console.log('error connecting to MongoDB:', error.message);
    } else {
      console.log('Failed to connect to database.');
    }
  });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// .id laitetaan id ja turha __V pois.
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
  
module.exports = mongoose.model('Note', noteSchema);
  