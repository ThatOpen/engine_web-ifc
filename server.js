const express = require('express');
const multer = require('multer');
const fs = require('fs');

// Require the compiled API. Users must build the project so these files exist.
const WebIFC = require('./dist/web-ifc-api-node.js');

const upload = multer({ dest: 'uploads/' });

const app = express();
const api = new WebIFC.IfcAPI();
const models = new Map();

async function initApi() {
  if (!api.wasmModule) {
    await api.Init();
  }
}

app.post('/models', upload.single('ifc'), async (req, res) => {
  try {
    await initApi();
    const buffer = fs.readFileSync(req.file.path);
    const modelID = api.OpenModel(buffer);
    models.set(modelID, req.file.path);
    res.json({ modelID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/models/:id/lines/:expressID', async (req, res) => {
  const modelID = Number(req.params.id);
  const expressID = Number(req.params.expressID);
  if (!models.has(modelID)) return res.status(404).json({ error: 'Model not found' });
  try {
    const line = api.GetLine(modelID, expressID, true);
    res.json(line);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/models/:id', (req, res) => {
  const modelID = Number(req.params.id);
  const filePath = models.get(modelID);
  if (!filePath) return res.status(404).json({ error: 'Model not found' });
  api.CloseModel(modelID);
  fs.unlinkSync(filePath);
  models.delete(modelID);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`REST API running on port ${PORT}`);
});
