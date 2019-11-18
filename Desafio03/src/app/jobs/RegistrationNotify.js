import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationNotify {
  get key() {
    return 'registrationNotify';
  }

  async handle({ data }) {
    const { registration, plan, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula efetuada.',
      template: 'register',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(parseISO(registration.start_date), "dd'/'MM'/'yy", {
          locale: pt,
        }),
        end_date: format(parseISO(registration.end_date), "dd'/'MM'/'yy", {
          locale: pt,
        }),
      },
    });
  }
}

export default new RegistrationNotify();
