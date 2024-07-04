const express = require("express");
const router = express.Router();
const {
  createUser,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor,
  getAllAdvisors,
  createCourseInstructor,
  updateCourseInstructor,
  deleteCourseInstructor,
  getAllCourseInstructors,
  getallUser,
  getRole,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");
//const authenticate = require("../middlewares/authenticate");
//router.use(authenticate); // Ensure all routes are authenticated

///admin zone
router.post("/createUser", createUser);

router.get("/getallUser", getallUser);
router.get("/getRole/:role", getRole);
router.put("/updateUser/:id", checkRole(['ADMIN']), updateUser);
router.delete("/deleteUser/:id", checkRole(['ADMIN']), deleteUser);

router.post("/createAdvisor", checkRole(['ADMIN']), createAdvisor);
router.get("/getAllAdvisors", checkRole(['ADMIN']), getAllAdvisors);
router.put("/updateAdvisor/:id", checkRole(['ADMIN']), updateAdvisor);
router.delete("/deleteAdvisor/:id", checkRole(['ADMIN']), deleteAdvisor);
router.post("/createCourseInstructor", checkRole(['ADMIN']), createCourseInstructor);
router.get("/getAllCourseInstructors", checkRole(['ADMIN']), getAllCourseInstructors);
router.put("/updateCourseInstructor/:id", checkRole(['ADMIN']), updateCourseInstructor);
router.delete("/deleteCourseInstructor/:id", checkRole(['ADMIN']), deleteCourseInstructor);


module.exports = router;



