// routes/admin/vehicles.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vehicle = require('../../../models/Vehicle');
const isAdmin=require('../')

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/uploads/vehicles';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'vehicle-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.get('/admin/vehicles', isAdmin, (req, res) => {
  // only admins reach this point
  res.send('Admin vehicle list');
});

// GET /admin/vehicles - View all vehicles
router.get('/', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const vehicles = await Vehicle.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalVehicles = await Vehicle.countDocuments();
        const totalPages = Math.ceil(totalVehicles / limit);

        res.render('admin/vehicles/index', {
            title: 'Manage Vehicles',
            vehicles,
            currentPage: page,
            totalPages,
            totalVehicles
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).render('error', {
            title: 'Server Error',
            message: 'Unable to fetch vehicles',
            error: error
        });
    }
});

// GET /admin/vehicles/add - Show add vehicle form
router.get('/add', isAdmin, (req, res) => {
    res.render('admin/vehicles/add', {
        title: 'Add New Vehicle',
        vehicle: {},
        errors: {}
    });
});

// POST /admin/vehicles/add - Create new vehicle
router.post('/add', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const vehicleData = {
            name: req.body.name,
            brand: req.body.brand,
            price: parseFloat(req.body.price),
            type: req.body.type,
            description: req.body.description || '',
            year: req.body.year ? parseInt(req.body.year) : undefined,
            fuel_type: req.body.fuel_type || 'gasoline',
            transmission: req.body.transmission || 'automatic',
            mileage: req.body.mileage ? parseFloat(req.body.mileage) : undefined,
            availability: req.body.availability === 'true'
        };

        // Handle features array
        if (req.body.features) {
            vehicleData.features = Array.isArray(req.body.features) 
                ? req.body.features.filter(f => f.trim() !== '')
                : [req.body.features].filter(f => f.trim() !== '');
        }

        // Handle image upload
        if (req.file) {
            vehicleData.image = '/uploads/vehicles/' + req.file.filename;
        } else {
            return res.render('admin/vehicles/add', {
                title: 'Add New Vehicle',
                vehicle: vehicleData,
                errors: { image: 'Vehicle image is required' }
            });
        }

        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();

        req.flash('success', 'Vehicle added successfully!');
        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error('Error adding vehicle:', error);
        
        // Delete uploaded file if vehicle creation failed
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }

        let errors = {};
        if (error.errors) {
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
        } else {
            errors.general = 'An error occurred while adding the vehicle';
        }

        res.render('admin/vehicles/add', {
            title: 'Add New Vehicle',
            vehicle: req.body,
            errors: errors
        });
    }
});

// GET /admin/vehicles/edit/:id - Show edit vehicle form
router.get('/edit/:id', isAdmin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).render('error', {
                title: 'Vehicle Not Found',
                message: 'The requested vehicle could not be found',
                error: { status: 404 }
            });
        }

        res.render('admin/vehicles/edit', {
            title: 'Edit Vehicle',
            vehicle,
            errors: {}
        });
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        res.status(500).render('error', {
            title: 'Server Error',
            message: 'Unable to fetch vehicle details',
            error: error
        });
    }
});

// POST /admin/vehicles/edit/:id - Update vehicle
router.post('/edit/:id', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).render('error', {
                title: 'Vehicle Not Found',
                message: 'The requested vehicle could not be found',
                error: { status: 404 }
            });
        }

        // Store old image path for potential deletion
        const oldImagePath = vehicle.image;

        // Update vehicle data
        vehicle.name = req.body.name;
        vehicle.brand = req.body.brand;
        vehicle.price = parseFloat(req.body.price);
        vehicle.type = req.body.type;
        vehicle.description = req.body.description || '';
        vehicle.year = req.body.year ? parseInt(req.body.year) : undefined;
        vehicle.fuel_type = req.body.fuel_type || 'gasoline';
        vehicle.transmission = req.body.transmission || 'automatic';
        vehicle.mileage = req.body.mileage ? parseFloat(req.body.mileage) : undefined;
        vehicle.availability = req.body.availability === 'true';

        // Handle features array
        if (req.body.features) {
            vehicle.features = Array.isArray(req.body.features) 
                ? req.body.features.filter(f => f.trim() !== '')
                : [req.body.features].filter(f => f.trim() !== '');
        } else {
            vehicle.features = [];
        }

        // Handle image upload
        if (req.file) {
            vehicle.image = '/uploads/vehicles/' + req.file.filename;
            
            // Delete old image file
            if (oldImagePath && oldImagePath.startsWith('/uploads/')) {
                const oldFilePath = path.join('public', oldImagePath);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
        }

        await vehicle.save();

        req.flash('success', 'Vehicle updated successfully!');
        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error('Error updating vehicle:', error);
        
        // Delete uploaded file if update failed
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }

        let errors = {};
        if (error.errors) {
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
        } else {
            errors.general = 'An error occurred while updating the vehicle';
        }

        const vehicle = await Vehicle.findById(req.params.id);
        res.render('admin/vehicles/edit', {
            title: 'Edit Vehicle',
            vehicle: vehicle || req.body,
            errors: errors
        });
    }
});

// DELETE /admin/vehicles/:id - Delete vehicle
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ 
                success: false, 
                message: 'Vehicle not found' 
            });
        }

        // Delete image file
        if (vehicle.image && vehicle.image.startsWith('/uploads/')) {
            const imagePath = path.join('public', vehicle.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await Vehicle.findByIdAndDelete(req.params.id);
        
        res.json({ 
            success: true, 
            message: 'Vehicle deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting vehicle' 
        });
    }
});

// POST /admin/vehicles/:id/toggle-availability - Toggle vehicle availability
router.post('/:id/toggle-availability', isAdmin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ 
                success: false, 
                message: 'Vehicle not found' 
            });
        }

        await vehicle.toggleAvailability();
        
        res.json({ 
            success: true, 
            availability: vehicle.availability,
            message: `Vehicle ${vehicle.availability ? 'enabled' : 'disabled'} successfully`
        });
    } catch (error) {
        console.error('Error toggling vehicle availability:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating vehicle availability' 
        });
    }
});

module.exports = router;