const express = require('express');
const userAccountController = require('../controllers/userAccountController');

const router = express.Router();
router.post('/createAccount', userAccountController.createAccount);
router.delete('/deleteAccount', userAccountController.deleteAccount);
router.put('/editAccountDetails', userAccountController.editAccountDetails);
router.get('/getUserIdFromUserName', userAccountController.getUserIdFromUserName);
router.get('/getUserIdFromEmail', userAccountController.getUserIdFromEmail);
router.get('/getRoutePacketFromID', userAccountController.getRoutePacketFromID);
router.get('/getForumPacketFromID', userAccountController.getForumPacketFromID);
router.get('/getSettingsFromID', userAccountController.getSettingsFromID);

module.exports = router;





/*
server.use(favicon('./public/favicon.ico')); 
server.use('/', homePageRoutes);
server.use('/images', imageRoutes);

//Listen to server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}//`);
})
*/