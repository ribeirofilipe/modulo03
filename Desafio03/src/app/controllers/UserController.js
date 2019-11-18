import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      return res.status(400).json({ error: 'user already exists.' });
    }

    const { id, name, email, permission_level } = await User.create(req.body);

    return res.status(201).json({
      id,
      name,
      email,
      permission_level,
    });
  }

  async index(req, res) {
    const users = await User.findAll();

    res.json(users);
  }
}

export default new UserController();
