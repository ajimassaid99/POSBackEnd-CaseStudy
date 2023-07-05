const router = require('express').Router();
const { police_check } = require('../../middleware');
const ratingController = require('./controller');

router.post('/ratings',
    ratingController.createRating,
    police_check('create', 'Rating')
);
router.get('/ratings/:productId', ratingController.getRatingsByProductId);
router.put('/ratings/:id', ratingController.updateRating, police_check('update', 'Rating'));
router.delete('/ratings/:id', ratingController.deleteRating, police_check('delete', 'Rating'));

module.exports = router;
