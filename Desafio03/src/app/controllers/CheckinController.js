import { Op } from 'sequelize';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id invalid' });
    }

    const checkins = await Checkin.findAll({ where: { student_id: id } });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const searchDate = Number(new Date());

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [
            startOfDay(subDays(searchDate, 7)),
            endOfDay(searchDate),
          ],
        },
      },
    });

    if (checkins.length >= 5) {
      return res
        .status(400)
        .json({ error: 'Limit exceeded, please wait for next week' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Id invalid' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { created_at } = await Checkin.create({ student_id: id });

    const { name, email } = student;

    return res.json({
      name,
      email,
      checkin: created_at,
    });
  }
}

export default new CheckinController();
