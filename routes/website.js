const express = require('express');
const router = express.Router();
const path = require('path');
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
    let { title, startTime, endTime, dateStr } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    if (!user) throw new Error("User not found");

    // JSON parse
    let calendarData = user.calendar ? JSON.parse(user.calendar) : {};

    // Yeni ID
    let newId = generateString(5);
    calendarData[newId] = {
      title,
      startTime,
      endTime,
      dateStr,
      id: newId,
    };

    // Update
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ calendar: JSON.stringify(calendarData) }) // Supabase jsonb field ise JSON.stringify gerek yok
      .eq('userId', userId)
      .select() // Güncellenen satırı geri almak için select ekledik

    if (updateError) {
      console.log(updateError)
      return 
    };
    console.log(calendarData, updatedUser)

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
    console.log("KlassKod:", klassKod, "UserId:", userId)

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single()

    if (error) throw error;
    if (!user) throw new Error("User not found");

    let classes = JSON.parse(user.classes)
    
    if (!(klassKod in classes)) { 
      console.log("Ogiltigt klass kod")
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
    console.log("KlassKod:", klassKod, "UserId:", userId);

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    if (!user) throw new Error("User not found");

    let classes = JSON.parse(user.classes);

    if (!(klassKod in classes)) { 
      console.log("Ogiltigt klass kod");
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

function generateString(length) {
  return crypto.randomBytes(length).toString('hex') 
}

module.exports = router;