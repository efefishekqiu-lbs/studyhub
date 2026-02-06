const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const defaultClasses = require('../lib/defaultClasses')

const {
  createAuthToken,
  setAuthCookie,
  authGuard,
  clearAuth,
} = require('../lib/cookieLib.js')
  
const supabase = require('../lib/supabase');

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/panel', authGuard, async (req, res) => {
  const userId = req.user.userId
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('userId', userId)
    .single()

  if (!user) {
    clearAuth(res)
    return res.render('signup')
  }

  res.render('panel', {
    user: user,
    defaultClasses: defaultClasses,
    csrfToken: req.csrfToken ? req.csrfToken() : null
  })
})

router.post('/addKalender', authGuard, async (req, res) => {
  const userId = req.user.userId;
  try {
    const { title, startTime, endTime, dateStr, klassKod } = req.body;
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    if (!user) throw new Error("User not found");

    let calendarData;
    try {
      let parsed = JSON.parse(user.calendar);
      calendarData = Array.isArray(parsed) ? {} : parsed; 
    } catch {
      calendarData = {};
    }

    const newId = generateString(5);
    calendarData[newId] = {
      title,
      startTime,
      endTime,
      dateStr,
      id: newId,
      klassKod
    };

    const { error: updateError } = await supabase
      .from('users')
      .update({ calendar: JSON.stringify(calendarData) })
      .eq('userId', userId);

    if (updateError) throw updateError;

    res.json({ success: true, newData: calendarData[newId] });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});


router.post('/addClass', authGuard, async (req, res) => {
  const userId = req.user.userId
  try {
    let { klassKod } = req.body;
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single()

    if (error) throw error;
    if (!user) throw new Error("User not found");

    let classes = JSON.parse(user.classes)
    
    if (!(klassKod in classes)) { 
      return res.json({
        success: false,
        message: "Ogiltigt klass kod",
      });
    }
    classes[klassKod] = true;

    const { error: updateError } = await supabase
      .from('users')
      .update({ classes: JSON.stringify(classes) })
      .eq('userId', userId);

    if (updateError) throw updateError;

    res.json({ success: true })
  } catch (err) {
    console.error(err) 
    res.json({ success: false, message: err.message })
  }
})

router.post('/removeClass', authGuard, async (req, res) => {
  const userId = req.user.userId;
  try {
    let { klassKod } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    if (!user) throw new Error("User not found");

    let classes = JSON.parse(user.classes);

    if (!(klassKod in classes)) { 
      return res.json({
        success: false,
        message: "Ogiltigt klass kod",
      });
    }

    classes[klassKod] = false;

    const { error: updateError } = await supabase
      .from('users')
      .update({ classes: JSON.stringify(classes) })
      .eq('userId', userId);

    if (updateError) throw updateError;

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});


router.post('/signup', async (req, res) => {
  try {
    let { email, password, loginType } = req.body;

    if (!email || !password || !loginType) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (!["login", "register"].includes(loginType)) {
      return res.json({
        success: false,
        message: "Invalid login type"
      });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    if (password.length < 4) {
      return res.json({
        success: false,
        message: "Password too short"
      });
    }
    const emailPrefix = email.split("@")[0];   
    const rawUsername = emailPrefix.split(".")[0]; 
    const username =
      rawUsername.charAt(0).toUpperCase() +
      rawUsername.slice(1).toLowerCase();


    if (loginType === "register") {
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (findError) {
        return res.json({
          success: false,
          message: "Database error"
        });
      }

      if (existingUser) {
        return res.json({
          success: false,
          message: "User already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = generateString(15)
      let userClasses = {};
      Object.keys(defaultClasses).forEach((key) => {
        userClasses[key] = false;
      });
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          userId: userId,
          username: username,
          email: email,
          password: hashedPassword,
          assignments: JSON.stringify([]),
          calendar: JSON.stringify([]),
          classes: JSON.stringify(userClasses),
        });

      if (insertError) {
        return res.json({
          success: false,
          message: "Register failed"
        });
      }
      const token = createAuthToken({
        userId,
        email,
      })
      setAuthCookie(res, token)
      return res.json({
        success: true,
        message: "Register successful",
        redirect: "/website/panel"
      });
    }

    if (loginType === "login") {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error || !user) {
        return res.json({
          success: false,
          message: "User not found"
        });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.json({
          success: false,
          message: "Wrong password"
        });
      }

      const token = createAuthToken({
        userId: user.userId,
        email: user.email,
      })
      setAuthCookie(res, token)
      setTimeout(() => {
        return res.json({
          success: true,
          message: "Login successful",
          redirect: "/website/panel",
        });
      }, 100);

    }

  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.json({
      success: false,
      message: "Server error"
    });
  }
});

router.post('/submitFile', authGuard, async (req, res) => {
  const userId = req.user.userId;

  try {
    const { fileName, lektion } = req.body;
    if (!fileName) {
      return res.json({ success: false, message: "fileName missing" });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('assignments')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    if (!user) throw new Error("User not found");

    let assignments;

    try {
      const parsed = JSON.parse(user.assignments);
      assignments = Array.isArray(parsed) ? {} : parsed;
    } catch {
      assignments = {};
    }

    assignments[fileName] = lektion;

    const { error: updateError } = await supabase
      .from('users')
      .update({ assignments: JSON.stringify(assignments) })
      .eq('userId', userId);

    if (updateError) throw updateError;

    res.json({ success: true });

  } catch (err) {
    console.error("submitFile error:", err);
    res.json({ success: false, message: err.message });
  }
});

router.post("/readFile", authGuard, async (req, res) => {
  try {
    const { fileName } = req.body;
      const filePath = path.join(__dirname, "files/"+fileName);
      const payload = fs.readFileSync(filePath, "utf8");
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.send(payload);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Dosya okunurken hata oluştu"
    });
  }
});

function generateString(length) {
  return crypto.randomBytes(length).toString('hex') 
}

module.exports = router;