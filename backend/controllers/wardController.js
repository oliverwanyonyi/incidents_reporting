const { validationResult } = require("express-validator");
const sequelize = require("sequelize");
const {
  County,
  SubLocation,
  Ward,
  User,
  Role,
  SubCounty_Authority,
  Ward_Authority,
} = require("../models");
const bcrypt = require("bcryptjs");










const addWardAuthority = async (req, res, next) => {
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

    const { password, ...others } = req.body;

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = await User.create({
      ...others,
      county: req.user.county,
      sub_county: req.user.sub_county,
      ward:req.user.ward,
      password: hashedPassword,
      active: true,
    });
    await Ward_Authority.create({
      user_id: user.id,
     designation:req.body.designation,
     position:req.body.position
    });
    const role = await Role.findOne({ where: { name: "ward-officer" } });

    user.addRole(role);
    res.send("Ward Authority Added");
  } catch (error) {
    next(error);
  }
};

const retrieveWardAuthorities = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const { count, rows: subcounty_authorities } =
      await User.findAndCountAll({
        where: {
          ward: req.user.ward,
        },
        attributes: [
          "full_name",
          "email",
          "phone",
          'id',
          "ward",
          "createdAt"
        ],
        include: [
          { model: Ward_Authority, },
          {model:Role, where:{name:'ward-officer'}},
        ],
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * perPage,
        limit: perPage,
      });

    res.json({ subcounty_authorities, pageCount: Math.ceil(count / perPage) });
  } catch (error) {
    next(error);
  }
};

const authorityCountyList = async (req, res, next) => {
  const { perPage = 10, page = 1 } = req.query;
  try {
    const { rows: users, count } = await User.findAndCountAll({
      include: [
        { model: Role, where: { name: "ward-admin" } },
        { model:Ward_Authority },
      ],
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    res.json({ users, pageCount: Math.ceil(count / perPage) });
  } catch (error) {
    next(error);
  }
};

module.exports = {

  addWardAuthority,
  retrieveWardAuthorities,
  authorityCountyList,
};
