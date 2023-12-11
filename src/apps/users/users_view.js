import users_model from "./users_model";
import { create_id } from "../../utils/create_id";

const create_user = async (req, res) => {
  const { name, phone, type } = req.body;
  const id = create_id("uid", 12);
  const user = new users_model({
    user_id: id,
    user_phone: phone,
    user_name: {
      first_name: name.firstName,
      last_name: name.lastName,
    },
    user_type: type,
  });
  try {
    await user.save();
    res.status(200).json({
      message: `user registered`,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};

const get_user_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await users_model.findOne({ user_id: id });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};

const get_all_users = async (req, res) => {
  const { type } = req.params;
  try {
    let users;
    if (type == "all") {
      users = await users_model.find();
    } else {
      users = await users_model.find({ user_type: type }).exec();
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};

export { create_user, get_user_by_id, get_all_users };
