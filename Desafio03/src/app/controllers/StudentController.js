import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .max(100)
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findOne({ where: { email: req.body.email } });

    if (student) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.status(201).json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .positive()
        .max(3),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const student = await Student.findOne({ where: { id } });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const { name, email, age, weight, height } = await student.update(req.body.data);

    return res.status(200).json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async index(req, res) {
    try {
      const students = await Student.findAll();

      return res.json(students);
    } catch (err) {
      return res.json({ error: 'Error to processing request.' });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.json({ error: 'Student not found.' });
    }

    return res.json(student);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const student = await Student.findOne({
      where: { id },
    });

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    await student.destroy({ where: { id } });

    return res.sendStatus(200);
  }
}

export default new StudentController();
