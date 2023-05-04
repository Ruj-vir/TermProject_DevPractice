const express = require('express');
const { getCampgrounds, getCampground, createCampground, updateCampground, deleteCampground, getVacCenters } = require("../controllers/campgrounds.js");

/**
 * @swagger
 * components:
 *  schemas:
 *      Hospital:
 *          type: object
 *          required:
 *          - name
 *          - address
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *                  description: The auto-generated id of the hospital
 *                  example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *              ลำดับ:
 *                  type: string
 *                  description: Ordinal nunmber
 *              name:
 *                  type: string
 *                  description: Hospital name
 *              address:
 *                  type: string
 *                  description: House No., Street, Road
 *              district:
 *                  type: string
 *                  description: District
 *              province:
 *                  type: string
 *                  description: province
 *              postalcode:
 *                  type: string
 *                  description: 5-digit postal code
 *              tel:
 *                  type: string
 *                  description: telephone number
 *              region:
 *                  type: string
 *                  description: region
 *          example:
 *              id: 609bda561452242d88d36e37
 *              ลำดับ: 121
 *              name: Happy Hospital
 *              address: 121 ถ.สุขุมวิท
 *              district: บางนา
 *              province: กรุงเทพมหานคร
 *              postalcode: 10110
 *              tel: 02-2187000
 *              region: กรุงเทพมหานคร(Bangkok)
 */



/**
* @swagger
* tags:
*   name: Hospitals
*   description: The hospitals managing API
*/

/**
 * @swagger
 * /hospitals:
 *  get:
 *      summary: Return the list of all hospitals
 *      tags: [Hospitals]
 *      responses:
 *          200:
 *              description: The list of the hospitals
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Hospital'
 */

/**
 * @swagger
 * /hospitals/{id}:
 *  get:
 *      summary: Get the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The hospital id
 *      responses:
 *          200:
 *              description: The hospital description by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Hospital'
 *          404:
 *              description: The hospital was not found
 */

/**
 * @swagger
 * /hospitals:
 *  post:
 *      summary: Create a new hospital
 *      tags: [Hospitals]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Hospital'
 *      responses:
 *          201:
 *              description: The hospital was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Hospital'
 *          500:
 *              description: Some server error
 */

/**
 * @swagger
 * /hospitals/{id}:
 *  put:
 *      summary: Update the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The hospital id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Hospital'
 *      responses:
 *          200:
 *              description: The hospital was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Hospital'
 *          404:
 *              description: The hospital was not found
 *          500:
 *              description: Some error happened
 */

/**
 * @swagger
 * /hospitals/{id}:
 *  delete:
 *      summary: Remove the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The hospital id
 *      responses:
 *          200:
 *              description: The hospital was deleted
 *          404:
 *              description: The hospital was not found
 */

// Include other resource routers 
const bookingRouter = require('./bookings.js');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth.js');
// Re-route into other resource routers 
router.use('/:campgroundId/bookings/', bookingRouter);

router.route('/vacCenters').get(getVacCenters);
router.route('/')
    .get(getCampgrounds)
    .post(protect,authorize('user','admin'), createCampground);
router.route('/:id')
    .get(protect,getCampground)
    .put(protect,authorize('user','admin'), updateCampground)
    .delete(protect, authorize('admin'), deleteCampground);

module.exports=router;