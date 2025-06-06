const { pool } = require('../config/dbConnection');

// Get All Workshops
async function getAllWorkshops(req, res) {
  try {
    const query = "SELECT * FROM workshops";
    pool.query(query, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      }
      if (result.length === 0) {
        return res.status(404).send('No workshops found');
      }
      return res.status(200).json({ message: 'Workshops Found', data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// Get latest Workshops
async function getLatestWorkshops(req, res) {
  try {
    const query = "SELECT * FROM workshops ORDER BY addedAt DESC LIMIT 3";
    pool.query(query, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      }
      if (result.length === 0) {
        return res.status(404).send('No Latest workshops found');
      }
      return res.status(200).json({ message: 'Latest Workshops Found', data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}


// Get Single Workshop by ID
async function getWorkshopById(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).send('Workshop ID is required');

  try {
    const query = "SELECT * FROM workshops WHERE id = ?";
    pool.query(query, id, (error, result) => {
      if (error) return res.status(500).send(error);
      if (result.length === 0) return res.status(404).send('Workshop not found');
      return res.status(200).json({ message: 'Workshop Found', data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// Create New Workshop
async function createWorkshop(req, res) {
  const { title, category, date, time, location, image, color, speaker, price, spots, rating } = req.body;

  if (!title || !category || !date || !time || !location || !speaker || !price) {
    return res.status(400).send('Required fields missing');
  }

  try {
    // If existing, access the file names of the cv and image ...
    const workShopImageName = req.files?.workshopImage?.[0]?.filename || null;

    console.log('Image Name:', workShopImageName);

    const query = "INSERT INTO workshops (title, category, date, time, location,image, color, speaker, price, spots, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [title, category, date, time, location, workShopImageName, color, speaker, price, spots, rating];

    pool.query(query, values, (error, result) => {
      if (error) return res.status(500).send(error);
      
      return res.status(201).json({ message: 'Workshop Created', data: result });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// Update Workshop
async function updateWorkshop(req, res) {
  const { id } = req.params;
  const { title, category, date, time, location, color, speaker, price, spots, rating } = req.body;

  if (!id || !title || !category || !date || !time || !location || !speaker || !price) {
    return res.status(400).json({ message: 'Required fields missing', missingFields: 
      ['id', 'title', 'category', 'date', 'time', 'location', 'speaker', 'price']
      .filter(field => !eval(field)) });
  }

  try {
    // Log the request body for debugging
    console.log('Update request body:', req.body);
    console.log('Update files:', req.files);

    // Format the date to MySQL format (YYYY-MM-DD)
    let formattedDate;
    try {
      // Convert ISO date string to YYYY-MM-DD format
      formattedDate = date ? new Date(date).toISOString().split('T')[0] : null;
    } catch (err) {
      console.error('Date parsing error:', err);
      formattedDate = null;
    }

    // Get image from either files or req.body.image if it's a URL
    let workshopImage;
    
    if (req.files && req.files.workshopImage && req.files.workshopImage[0]) {
      workshopImage = req.files.workshopImage[0].filename;
    } else if (req.body.image && req.body.image.startsWith('http')) {
      workshopImage = req.body.image;
    }
    
    const query = "UPDATE workshops SET title = ?, category = ?, date = ?, time = ?, location = ?, image = ?, color = ?, speaker = ?, price = ?, spots = ?, rating = ? WHERE id = ?";
    const values = [title, category, formattedDate, time, location, workshopImage, color, speaker, price, spots, rating, id];
    
    pool.query(query, values, (error, result) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
      }
      if (result.affectedRows === 0) return res.status(400).json({ message: 'Workshop update failed - no rows affected' });
      return res.status(200).json({ message: 'Workshop updated successfully' });
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Delete Workshop
async function deleteWorkshop(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).send('Workshop ID is required');

  try {
    const query = "DELETE FROM workshops WHERE id = ?";
    pool.query(query, id, (error, result) => {
      if (error) return res.status(500).send(error);
      if (result.affectedRows === 0) return res.status(400).send('Workshop delete failed');
      return res.status(200).send('Workshop deleted successfully');
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

module.exports = {
  getAllWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getLatestWorkshops
};
