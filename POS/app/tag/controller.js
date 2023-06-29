const Tag = require('./model');

const getTag = async (req, res, next) => {
  try {
    let tag = await Tag.find({});
    return res.json(tag);
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    let payload = req.body;
    let tag = new Tag(payload);
    await tag.save();
    return res.json(tag);
  } catch (error) {
    next(error);
  }
};

const updateTagById = async (req, res, next) => {
  try {
    let { name } = req.body;
    let { id } = req.params;

    let payload = {};
    if (name) payload.name = name;

    let tag = await Tag.findByIdAndUpdate(
      id,
      payload,
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    return res.json(tag);
  } catch (error) {
    next(error);
  }
};

const deleteTagById = async (req, res, next) => {
  let { id } = req.params;

  try {
    let result = await Tag.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    return res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTag,
  createTag,
  updateTagById,
  deleteTagById
};