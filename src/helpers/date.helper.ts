export class DateHelper {
  formatDate(date: Date | string) {
    if (typeof date == 'string') {
      return new Date(date).toLocaleDateString('pt-BR');
    }
    return date.toLocaleDateString('pt-BR');
  }

  formatHour(datetime: number) {
    const dayDifference = Math.floor(datetime / 86400000);
    const hourDifference = Math.floor((datetime % 86400000) / 3600000);
    const minuteDifference = Math.round(
      ((datetime % 86400000) % 3600000) / 60000,
    );
    let hours =
      dayDifference > 0
        ? hourDifference + 24
        : hourDifference < 0
        ? 0
        : hourDifference;
    if (minuteDifference == 60) hours++;
    const minutes =
      minuteDifference < 10
        ? `0${minuteDifference}`
        : minuteDifference == 60
        ? '00'
        : minuteDifference;
    return `${hours}h ${minutes}m`;
  }

  getTimeDifferenceBetweenDates(laterDate: Date, earlierDate: Date) {
    const timeDifference = laterDate.getTime() - earlierDate.getTime();
    return timeDifference;
  }
}
