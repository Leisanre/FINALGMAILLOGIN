const Genre = require("../../models/Genre");

const addGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const genre = new Genre({ name });
    await genre.save();

    res.status(201).json({ success: true, data: genre });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error adding genre" });
  }
};

const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json({ success: true, data: genres });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching genres" });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    await Genre.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Genre deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error deleting genre" });
  }
};

module.exports = { addGenre, getGenres, deleteGenre };
