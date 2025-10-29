import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db.js";


// Register

export const register = async (req, res) => {
  const { first_name, last_name, username, email, phone, password, role } = req.body;

  try {
    // Email yoki username bandligini tekshiramiz
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Email yoki username allaqachon mavjud" });
    }

    // Parolni hash qilamiz
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yangi foydalanuvchini saqlaymiz
    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, username, email, phone, password_hash, role, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()) RETURNING id, username, email, role`,
      [first_name, last_name, username, email, phone, hashedPassword, role || "user"]
    );

    res.status(201).json({ message: "Ro'yxatdan o'tish muvaffaqiyatli", user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// Login

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email topilmadi" });
    }

    const validPass = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPass) return res.status(400).json({ message: "Parol noto'g'ri" });

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Kirish muvaffaqiyatli",
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
};
