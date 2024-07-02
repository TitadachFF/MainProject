const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");

exports.login = async (req, res) => {
  const { username, password, role } = req.body;
  console.log("Request body:", req.body); 
  try {
    let user;

    // Choose the database to search based on the user role
    //ใช้ switch case เพื่อตรวจสอบบทบาทของผู้ใช้ role และค้นหาผู้ใช้ในฐานข้อมูลที่เกี่ยวข้องตามบทบาท
    switch (role) {
      case 'ADMIN':
        user = await prisma.admin.findUnique({ where: { username } });
        break;
      case 'ADVISOR':
        user = await prisma.advisor.findUnique({ where: { username } });
        break;
      case 'COURSE_INSTRUCTOR':
        user = await prisma.courseInstructor.findUnique({ where: { username } });
        break;
      default:
        return res.status(401).json({ message: "Invalid role" });
    }


    ///การตรวจสอบการมีอยู่ของผู้ใช้
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    
    ///เปรียบเทียบรหัสผ่านที่ส่งมาจาก client กับรหัสผ่านที่ถูกเข้ารหัสในฐานข้อมูล
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create token using user id and role
    ///สร้างและส่ง JWT
    const token = jwt.sign({ id: user.id, role: role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
