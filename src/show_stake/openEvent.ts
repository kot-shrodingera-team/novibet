import { awaiter, log } from '@kot-shrodingera-team/germes-utils';
import JsFailError from './errors/jsFailError';

const openEvent = async (): Promise<void> => {
  const eventId = worker.EventId;
  if (window.location.href.includes(eventId)) {
    log('Открыта страница нужного события', 'steelblue');
    return;
  }

  log('Ищем событие в боковом меню', 'steelblue');
  const events = [...document.querySelectorAll('.matches_container > .match')];

  const event = events.find((eventElement) => {
    const competitorHomeElement = eventElement.querySelector(
      '.competitors .home, .matchCompetitors .home'
    );
    const competitorAwayElement = eventElement.querySelector(
      '.competitors .away, .matchCompetitors .away'
    );
    if (!competitorHomeElement || !competitorAwayElement) {
      return false;
    }
    const competitorHome = competitorHomeElement.textContent.trim();
    const competitorAway = competitorAwayElement.textContent.trim();
    log(`${competitorHome} - ${competitorAway}`, 'white', true);
    return (
      competitorHome === worker.TeamOne && competitorAway === worker.TeamTwo
    );
  });

  if (!event) {
    throw new JsFailError('Событие не найдено');
  }
  log('Событие найдено', 'steelblue');
  log('Открываем страницу события', 'orange');

  const eventNavigateElement = event.querySelector(
    '.competitors, .matchCompetitors'
  ) as HTMLElement;
  if (!eventNavigateElement) {
    throw new JsFailError('Не найден элемент для перехода в событие');
  }
  eventNavigateElement.click();

  const matchSelected = await awaiter(
    () => {
      return event.classList.contains('selected');
    },
    5000,
    4
  );
  if (matchSelected) {
    log('Событие открыто', 'steelblue');
  } else {
    throw new JsFailError('Не удалось перейти на страницу события');
  }
};

export default openEvent;
