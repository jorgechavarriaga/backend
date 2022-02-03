const { response } = require('express');
const EventModel = require('../models/EventModel');

const getEvents = async(req, res = response) => {
    // console.log("Get Events!")
    const events = await EventModel.find().populate('user', 'name');

    res.json({
        ok: true,
        events
    })
}
const createEvent = async (req, res = response) => {
    // console.log("Create Event!")
    const event = new EventModel(req.body);
    
    try {
        event.user = req.uid;
        const eventSaved = await event.save();
        res.json({
            ok: true,
            event: eventSaved
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Contact the administrator.'
        });
    }
}
const updateEvent = async (req, res = response) => {
    // console.log("Update Event!")
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await EventModel.findById(eventId);
        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'Event does not exist with that id.'
            });
        }
        if(event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'The user does not have the privileges to edit this event.'
            })
        }
        const newEvent = {
            ...req.body,
            user: uid
        }
        const eventUpdated = await EventModel.findByIdAndUpdate( eventId, newEvent, {new: true});
        res.json({
            ok: true,
            event: eventUpdated
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact the administrator.'
        });
    }

}
const deleteEvent = async (req, res = response) => {
    // console.log("Delete Event!")
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await EventModel.findById(eventId);
        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'Event does not exist with that id.'
            });
        }
        if(event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'The user does not have the privileges to edit this event.'
            })
        }

        const eventDeleted = await EventModel.findByIdAndDelete( eventId);
        res.json({
            ok: true,
            event: eventDeleted
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact the administrator.'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}