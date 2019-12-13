var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Log = require('../models/logs');

/* GET ALL LOGS */
router.get('/', function (req, res, next) {
    Log.find({$and: [{ level: "ERROR" }, 
    { loggerName: { $ne: "com.gi.config.filter.CookieSetupFilter" } },
    { loggerName: { $ne: "info.magnolia.personalization.variant.RegistryVariantResolver" } }]}, function (err, logs) {
        if (err) return next(err);
        res.json(logs);
    }).sort({date: -1}).limit(40);
});

router.get('/aggr1', function (req, res, next) {
    Log.aggregate([
        { $match: 
            { $and: [
                { level: { $in: ["ERROR"] } }, 
                { loggerName: { $ne: "com.gi.config.filter.CookieSetupFilter" } }, 
                { loggerName: { $ne: "com.gi.login.filter.PageFlowFilter" } }] } }, 
        { $group: { _id: "$loggerName", count: { $sum: 1 } } }], function(err, data){
            if (err) return next(err);
            data.sort(function(a, b){
                return parseInt(b.count) - parseInt(a.count);
            });
            res.json(data);
        });
})

router.get('/timeouts', function(req, res, next){
    Log.find(
        {$or: [
            {message: { $regex : /WebService Timed Out From Client side/, $options: "i" }},
            {message: { $regex : /sockettimeout/, $options: "i" }}]}).count(function(err, data){
                if (err) return next(err);
                res.json(JSON.parse('{"webService Timeout":'+data+'}'));
            });
})

router.get('/pagehits', function(req, res, next){
    Log.find({message: { $regex : /^pagehit counter/, $options: "i" }}).count(function(err, data){
        if (err) return next(err);
        res.json(JSON.parse('{"pagehits":'+data+'}'));
    });
})

router.get('/aggr', function(req, res, next){
    Log.aggregate([
        { $match: 
            { $and: [
                { level: { $in: ["ERROR"] } }, 
                { loggerName: { $ne: "com.gi.config.filter.CookieSetupFilter" } }, 
                { loggerName: { $ne: "com.gi.login.filter.PageFlowFilter" } },
                { loggerName: { $ne: {$regex : /^info/} } }] } }, 
        { $group: { _id: "$loggerName", count: { $sum: 1 } } }], function(err, data){
            if (err) return next(err);
            data.sort(function(a, b){
                return parseInt(b.count) - parseInt(a.count);
            });
            Log.find(
                {$or: [
                    {message: { $regex : /WebService Timed Out From Client side/, $options: "i" }},
                    {message: { $regex : /sockettimeout/, $options: "i" }}]}).count(function(err, count){
                        if (err) return next(err);
                        data.push(JSON.parse('{"_id":"webService Timeout","count":'+count+'}'));
                        Log.find({message: { $regex : /^pagehit counter/, $options: "i" }}).count(function(err, count){
                            if (err) return next(err);
                                data.push(JSON.parse('{"_id":"pagehits","count":'+count+'}'));
                                res.json(data);
                        });
            });
            
    });
    
})

module.exports = router;