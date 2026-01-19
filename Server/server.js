// 1. Import necessary libraries
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dbPool = require('./db'); // Import the database connection pool

// 2. Initialize the Express application and define the port
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Apply Middleware
app.use(cors());
app.use(express.json());

// 4. Define Routes (Endpoints)
app.get('/', (req, res) => {
    res.send('API Server is running');
});

/* start Inserting Records */
app.post('/api/add_lists', async (req, res) => {
    const { Desc } = req.body
    try {
        const [inserted_rows] = await dbPool.query('INSERT INTO `lists`(`Description`) VALUES (?)', [Desc]);
        res.json(inserted_rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
/* End Inserting Records */
/* Start Viewing data */
app.get('/api/view_data', async (req, res) => {
    try {
        const [lists_data] = await dbPool.query("SELECT * FROM lists WHERE flag = 1")
        res.json(lists_data)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})
/* End Viewing data */

/* Start Reterving Data for selected row */
app.post('/api/edit_data', async (req, res) => {
    const { value } = req.body
    try {
        const [edit_data] = await dbPool.query("SELECT * FROM lists WHERE id = ?", [value])
        res.json(edit_data[0])
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})
/* End Reterving Data for selected row */

/* Start Update Route*/
app.post('/api/update_data', async (req, res) => {
    const { TabID, edit_desc } = req.body
    try {
        const [updated_rows] = await dbPool.query('UPDATE `lists` SET Description = ? WHERE id = ? ', [edit_desc, TabID]);
        // res.json(updated_rows > 0 ? "Updated Successfully" : "Updated failed");
        res.json(
            updated_rows.affectedRows > 0
                ? "Updated Successfully"
                : "Update Failed"
        );
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
/* End Update Route*/

/* Start Delete Route */
app.post('/api/delete_data', async (req, res) => {
    const { RowTabID } = req.body
    try {
        const [delete_row] = await dbPool.query('UPDATE `lists` SET flag = 0 WHERE id = ? ', [RowTabID]);
        res.json(
            delete_row.affectedRows > 0
                ? "Deleted Successfully"
                : "Deleted Failed"
        );
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
/* End Delete Route */

// 5. Start the server (The Listener)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
