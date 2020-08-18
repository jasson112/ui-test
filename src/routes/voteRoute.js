const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const voteRouter = express.Router();

voteRouter.route('/').get((req, res) => {
  axios.get("http://localhost:3000/candidates").then(response => {
    console.log(response.data)
    res.render('index', {
      candidates: response.data,
      asset() {
        return (text, render) => {
          const raw = fs.readFileSync(path.join(__dirname, '../../', 'public', 'manifest.json'));
          const manifest = JSON.parse(raw);
          const re = /(?:\.([^.]+))?$/;
          const ext = re.exec(manifest[text])[1];
          if (ext === 'css') {
            return `<link rel=stylesheet type=text/css href="${manifest[text]}">`;
          }
          if (ext === 'js') {
            return `<script src="${manifest[text]}"></script>`;
          }
          return render(text);
        };
      }
    })
  }).catch(err => res.send(err));
});

module.exports = voteRouter;
