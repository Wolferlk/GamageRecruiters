const { pool } = require('../config/dbConnection');
const deleteUploadedFile = require('../utils/deleteUplodedFile');

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
  const { title, category, date, time, location, image, color, speaker, price, spots, rating,link,description, event_type } = req.body;

  if (!title || !category || !date || !time || !location || !speaker || !price) {
    return res.status(400).send('Required fields missing');
  }

  try {
    // If existing, access the file names of the cv and image ...
    const workShopImageName = req.files?.workshopImage?.[0]?.filename || null;

    console.log('Image Name:', workShopImageName);

    const query = "INSERT INTO workshops (title, category, date, time, location,image, color, speaker, price, spots, rating, link, description, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [title, category, date, time, location, workShopImageName, color, speaker, price, spots, rating,link, description, event_type];

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
  const { title, category, date, time, location, color, speaker, price, spots, rating, description, event_type, link } = req.body;

  if (!id || !title || !category || !date || !time || !location || !speaker || !price) {
    return res.status(400).send('Required fields missing');
  }

 try {
    const getWorkshopQuery = 'SELECT image FROM workshops WHERE id = ?';

    pool.query(getWorkshopQuery, [id], async (fetchError, fetchResult) => {
      if (fetchError) {
        console.error('Error fetching existing blog:', fetchError);
        return res.status(500).send('Database error when retrieving workshop');
      }

      if (fetchResult.length === 0) {
        return res.status(404).send('Workshop not found');
      }
      
      const existingWorkshop = fetchResult[0];
      const oldWorkshopImage = existingWorkshop.image;

      const workShopImageName = req.files?.workshopImage?.[0]?.filename;

      // delete old image if new one uploaded
      try{
        if (workShopImageName && oldWorkshopImage && workShopImageName !== oldWorkshopImage) {
          await deleteUploadedFile('workshopImage',       oldWorkshopImage);
        }
      } catch (deleteErr) {
        console.error('File deletion error:', deleteErr.message);
      }

      let query, values;

      if (workShopImageName) {
        // If a new image is uploaded, update it
        query = "UPDATE workshops SET title = ?, category = ?, date = ?, time = ?, location = ?, image = ?, color = ?, speaker = ?, price = ?, spots = ?, rating = ?, description = ?, event_type = ?, link = ? WHERE id = ?" ;
        values = [title, category, date, time, location, workShopImageName, color, speaker, price, spots, rating, description, event_type, link, id];
      } else {
        // If no new image, don't update the image field
        query = "UPDATE workshops SET title = ?, category = ?, date = ?, time = ?, location = ?, color = ?, speaker = ?, price = ?, spots = ?, rating = ?, description = ?, event_type = ?, link = ? WHERE id = ?";
        values = [title, category, date, time, location, color, speaker, price, spots, rating, description, event_type, link, id];
      }
        pool.query(query, values, (error, result) => {
        if (error) return res.status(500).send(error);
        if (result.affectedRows === 0) return res.status(400).send('Workshop update failed');
        return res.status(200).send('Workshop updated successfully');
      });
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
}

// Delete Workshop
async function deleteWorkshop(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).send('Workshop ID is required');

  try {
    const getWorkshopQuery = 'SELECT image FROM workshops WHERE id = ?';

    pool.query(getWorkshopQuery, [id], async (fetchError, fetchResult) => {
      if (fetchError) {
        console.error('Error fetching workshop for deletion:', fetchError);
        return res.status(500).send('Database error when retrieving workshop');
      }

      if (fetchResult.length === 0) {
        return res.status(404).send('Workshop not found');
      }

      const workshop = fetchResult[0];

      try{
        if (workshop.image) {
          await deleteUploadedFile('workshopImage', workshop.image);
          console.log(`Deleted workshop image: ${workshop.image}`);
        }
      } catch (deleteError) {
        console.error('Error deleting workshop images:', deleteError);
      }

      const query = "DELETE FROM workshops WHERE id = ?";
      pool.query(query, id, (error, result) => {
        if (error) return res.status(500).send(error);
        if (result.affectedRows === 0) return res.status(400).send('Workshop delete failed');
        return res.status(200).send('Workshop deleted successfully');
      });
    })
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
