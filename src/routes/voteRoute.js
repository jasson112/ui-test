const express = require('express');
const path = require('path');
const fs = require('fs');

const voteRouter = express.Router();

voteRouter.route('/').get((req, res) => res.render('index', {
  description: 'Hallo',
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
}));

module.exports = voteRouter;
