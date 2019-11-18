import Student from '../models/Student';
import Queue from '../../lib/Queue';
import HelpOrders from '../models/HelpOrders';
import HelpOrderNotify from '../jobs/HelpOrdersNotify';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id invalid' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const orders = await HelpOrders.findAll({ where: { student_id: id } });

    return res.json(orders);
  }

  async store(req, res) {
    const { id } = req.params;
    const { question } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Id invalid' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const helpOrder = {
      student_id: id,
      question,
    };

    await HelpOrders.create(helpOrder);

    return res.json(helpOrder);
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id invalid' });
    }

    const helpOrders = await HelpOrders.findByPk(Number(id), {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrders) {
      return res.status(400).json({ error: 'Help order not found' });
    }

    helpOrders.answer_at = new Date();

    const helpOrder = await helpOrders.update(req.body);

    await Queue.add(HelpOrderNotify.key, {
      helpOrder,
    });

    const { question, answer, answer_at } = helpOrders;

    return res.json({
      question,
      answer,
      answer_at,
    });
  }

  async show(req, res) {
    const helpOrders = await HelpOrders.findAll({
      where: { answer: null },
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
