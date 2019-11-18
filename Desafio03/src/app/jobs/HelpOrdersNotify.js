import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrdersNotiy {
  get key() {
    return 'helpOrdersNotify';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Pedido de auxílio respondido.',
      template: 'orderAnwser',
      context: {
        name: helpOrder.student.name,
        question: helpOrder.question,
        orderNumber: helpOrder.id,
        answer: helpOrder.answer,
        answer_at: format(parseISO(helpOrder.answer_at), "dd'/'MM'/'yy", {
          locale: pt,
        }),
      },
    });
  }
}

export default new HelpOrdersNotiy();
