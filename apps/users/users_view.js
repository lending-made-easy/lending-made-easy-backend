const create_user = (req, res) => {
  console.log(req);
  const { name, phone, type } = req.body;
  res.status(200).json({
    message: `user registered with name: ${name}, phone: ${phone}, type: ${type}`,
  });
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
