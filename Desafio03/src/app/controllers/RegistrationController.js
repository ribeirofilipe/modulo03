import { parseISO, addDays, format } from 'date-fns';
import Plan from '../models/Plan';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import RegistrationNotify from '../jobs/RegistrationNotify';

class RegistrationController {
  async index(req, res) {
    const registration = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registration);
  }

  async show(req, res) {
    const { id } = req.params;

    const registration = await Registration.findByPk(id, {
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!registration) {
      return res.json({ error: 'Student not found.' });
    }

    return res.json(registration);
  }

  async update(req, res) {
    const { id } = req.params;
    const { student_id, plan_id } = req.query;
    const { start_date } = req.body;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(400).json({ error: 'Register not found' });
    }

    const plan = await Plan.findOne({ where: { id: plan_id } });

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const student = await Student.findOne({ where: { id: student_id } });

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { duration, price } = plan;

    const end_date = format(
      addDays(parseISO(start_date), duration * 30),
      'yyyy-MM-dd'
    );

    const { active } = await registration.update({
      start_date,
      plan_id,
      student_id,
      end_date,
      price: price * duration,
    });

    return res.json({
      start_date: format(parseISO(start_date), 'yyyy-MM-dd'),
      end_date,
      active,
      price: price * duration,
    });
  }

  async store(req, res) {
    try {
      

      const { plan_id, student_id } = req.query;
      const { start_date } = req.body;
  
      if (!plan_id || !student_id) {
        return res
          .status(400)
          .json({ error: 'Plan id or student id is invalid' });
      }
  
      const plan = await Plan.findOne({ where: { id: plan_id } });
  
      if (!plan) {
        return res.status(400).json({ error: 'Plan not found' });
      }
  
      const student = await Student.findOne({ where: { id: student_id } });
  
      if (!student) {
        return res.status(400).json({ error: 'Student not found' });
      }

      const { duration, price } = plan;
  
      const end_date = format(
        addDays(parseISO(start_date), duration * 30),
        'yyyy-MM-dd'
      );
  
      const registration = await Registration.create({
        student_id,
        plan_id,
        start_date,
        end_date,
        price: price * duration,
      });

      await Queue.add(RegistrationNotify.key, {
        registration,
        plan,
        student,
      });
  
      return res.json(registration);
    } catch (err) {
      return res.json(err)
    }
    
  }

  async delete(req, res) {
    const { id } = req.params;

    const deleted = await Registration.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(400).json({ error: 'Register not found' });
    }

    return res.sendStatus(200);
  }
}

export default new RegistrationController();
