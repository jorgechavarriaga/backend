/* 
    CRUD
    Event Routes
    /api/events
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');
const router = Router();

// All the petitions must pass by validate JWT

router.use(validateJWT);
// Get Events
router.get('/', getEvents);

// Create new event
router.post(
    '/',
    [
        check('title', 'Title is mandatory').not().isEmpty(),
        check('start', 'Start date is mandatory').custom( isDate ),
        check('end', 'End date is mandatory').custom( isDate ),
        validateFields
    ]
    , createEvent);

// Update event
router.put('/:id', updateEvent);

// Delete event
router.delete('/:id', deleteEvent);

module.exports = router;