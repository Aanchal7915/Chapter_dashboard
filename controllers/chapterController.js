const Chapter = require('../models/Chapter');
const mongoose = require('mongoose');
const fs = require('fs');
const { invalidateCache } = require('../middlewares/cache');

exports.getAllChapters = async (req, res) => {
  try {
    const { class: cls, unit, status, weakChapters, subject, page = 1, limit = 10 } = req.query;
    const query = {};

    if (cls) query.class = cls; 4
    if (unit) query.unit = unit;
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (weakChapters) query.isWeak = weakChapters === 'true';

    const total = await Chapter.countDocuments(query);
    const chapters = await Chapter.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ total, chapters });
  } catch (e) {
    res.send(500).json({ message: 'Internal Server Error' });
  }
};

exports.getChapterById = async (req, res) => {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid chapter ID' });
    }
    const chapter = await Chapter.findById(id);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.status(200).json(chapter);
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });

  }
};

exports.uploadChapters = async (req, res) => {
  try {
    const raw = req.file.buffer.toString('utf-8');
    let data=[];
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON format' });
    }

    const failed = [];
    for (const item of data) {
      try {
        const chapter = new Chapter(item);
        await chapter.validate();
        await chapter.save();
      } catch (e) {
        failed.push(item);
      }
    }

    await invalidateCache();

    res.status(200).json({ message: 'Upload complete', failed });
  } catch (e) {
    console.log("error: ",e)
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
