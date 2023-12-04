import users_model from "./users_model";
import { create_user_id } from "../../utils/create_id";

const create_user = async (req, res) => {
  const { name, phone, type } = req.body;
  const id = create_user_id("uid", 12);
  const user = new users_model({
    user_id: id,
    user_phone: phone,
    user_name: {
      first_name: name.firstName,
      last_name: name.lastName,
    },
    user_type: type,
  });
  console.log(
    `user trying to register with user_id: ${id}, name: ${name}, phone: ${phone}, type: ${type}`
  );
  try {
    await user.save();
    res.status(200).json({
      message: `user registered with user_id: ${id}, name: ${name}, phone: ${phone}, type: ${type}`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const get_user_by_id = (req, res) => {
  const { user_id } = req.params;
  res
    .status(200)
    .json({ message: `user details fetched for user_id: ${user_id}` });
};

const get_all_users = (req, res) => {
  res.status(200).json({ message: `all users details fetched` });
};

export { create_user, get_user_by_id, get_all_users };
