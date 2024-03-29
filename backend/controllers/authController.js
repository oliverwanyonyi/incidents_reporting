const {
  User,
  Role,
 Ward_Authority,
  Notification,
} = require("../models");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await User.findOne({
      where: {
        [sequelize.Op.or]: [
          { email: req.body.email },
          { phone: req.body.phone },
        ],
      },
    });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }
    const { password,position,designation, ...others } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    let user = await User.create({
      ...others,
      password: hashedPassword,
    });
    await Ward_Authority.create({
      user_id: user.id,
     position:position,
     designation:designation
    });
    const role = await Role.findOne({ where: { name: "ward-admin" } });

    await user.addRole(role);

    user = await User.findOne({
      where: {
        id: user.id,
      },
      attributes: [
        "id",
        "full_name",
        "email",
        "phone",
        "county",
        "sub_county",
        "ward",
        "active",
      ],
      include: [Role,Ward_Authority],
    });

    const access_token = generateToken(
      { id: user.id },
      process.env.ACCESS_EXPIRY,
      process.env.ACCESS_SECRET
    );
    const refresh_token = generateToken(
      { id: user.id },
      process.env.REFRESH_EXPIRY,
      process.env.REFRESH_SECRET
    );

    const cookieOptions = {
      httpOnly: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    }

    const notif_targets = await User.findAll({
      include: [
        {
          model: Role,
          where: {
            name: "system-admin",
          },
        },
      ],
    });

    const userIds = notif_targets.map((user) => user.dataValues.id);

    const promises = userIds.map((userId) => {
      return Notification.create({
        initiator_id: user.id,
        message: `New Ward Authority has Signed Up`,
        receiver_id:userId
      });
    });

    await Promise.all(promises);

    res.cookie("refresh_token", refresh_token, cookieOptions);

    res.json({ user, access_token });
  } catch (error) {
    next(error);
  }
};

const reporterSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await User.findOne({
      where: {
        phone: req.body.phone,
      },
    });

    if (existingUser) {
      res.status(400);
      throw new Error(req.body.phone + " Is already registered");
    }

    const { password, ...others } = req.body;

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(password, salt);

    let user = await User.create({
      ...others,
      password: hashedPassword,
    });

    const role = await Role.findOne({ where: { name: "user" } });

    await user.addRole(role);
    user = await User.findOne({
      where: {
        id: user.id,
      },
      attributes: [
        "id",
        "full_name",
        "phone",
        "county",
        "sub_county",
        "ward",
        "active",
      ],
      include: [Role],
    });


    const notif_targets = await User.findAll({
      include: [
        {
          model: Role,
          where: {
            name: "system-admin",
          },
        },
      ],
    });

    const userIds = notif_targets.map((user) => user.dataValues.id);

    const promises = userIds.map((userId) => {
      return Notification.create({
        message:'New Incident Reporter has Signed up',
        receiver_id_id: userId,
        initiator_id: user.id,
      });
    });

    await Promise.all(promises);

    const access_token = generateToken(
      { id: user.id },
      process.env.ACCESS_EXPIRY,
      process.env.ACCESS_SECRET
    );

    const refresh_token = generateToken(
      { id: user.id },
      process.env.REFRESH_EXPIRY,
      process.env.REFRESH_SECRET
    );

    const cookieOptions = {
      httpOnly: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    };

    res.cookie("refresh_token", refresh_token, cookieOptions);

    res.json({ user, access_token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { emailOrPhone, password } = req.body;

    let user = await User.findOne({
      where: {
        [sequelize.Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
      include: [
        { model: Role },
        { model: Ward_Authority }
      ],
    });

    if (user && bcrypt.compareSync(password, user.password)) {
    
      

      const cookieOptions = {
        httpOnly: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
      };

      access_token = generateToken(
        { id: user.id },
        process.env.ACCESS_EXPIRY,
        process.env.ACCESS_SECRET
      );

      refresh_token = generateToken(
        { id: user.id },
        process.env.REFRESH_EXPIRY,
        process.env.REFRESH_SECRET
      );

      res.cookie("refresh_token", refresh_token, cookieOptions);

      return res.json({
        user,
        access_token,
      });
    }
    res.status(400);
    throw new Error("Invalid email or password");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const tokenRefresh = (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    jwt.verify(refresh_token, process.env.REFRESH_SECRET, (err, payload) => {
      if (!err) {
        const access_token = generateToken(
          { id: payload.id },
          process.env.ACCESS_EXPIRY,
          process.env.ACCESS_SECRET
        );
        res.status(200).json({ access_token });
      } else {
        res.status(403);
        const error = new Error("Unauthorized");
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ where: { id: req.user.id } });

    user.full_name = req.body.full_name;
    user.phone = req.body.phone;
    if (req.body.email) {
      user.email = req.body.email;
    }

    await user.save();

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, reporterSignup, tokenRefresh, updateProfile };
