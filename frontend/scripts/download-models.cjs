
const fs = require('fs');
const https = require('https');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

const filesToDownload = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

const downloadFile = (filename) => {
  return new Promise((resolve, reject) => {
    const dest = path.join(modelsDir, filename);
    if (fs.existsSync(dest)) {
      console.log(filename + ' already exists, skipping.');
      return resolve();
    }
    
    console.log('Downloading ' + filename + '...');
    const file = fs.createWriteStream(dest);
    https.get(baseUrl + filename, (response) => {
      if (response.statusCode !== 200) {
        fs.unlinkSync(dest);
        return reject(new Error('Failed to get ' + filename + ' (' + response.statusCode + ')'));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
};

(async () => {
  try {
    for (const file of filesToDownload) {
      await downloadFile(file);
    }
    console.log('All models downloaded successfully!');
  } catch (error) {
    console.error('Error downloading models:', error);
    process.exit(1);
  }
})();
