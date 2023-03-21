export class DateHelper {
  formatDate(date: Date | string) {
    if (typeof date == 'string') {
      return new Date(date).toLocaleDateString('pt-BR');
    }
    return date.toLocaleDateString('pt-BR');
  }

  formatHour(datetime: number) {
    const hourDifference = Math.floor((datetime % 86400000) / 3600000);
    const minuteDifference = Math.round(
      ((datetime % 86400000) % 3600000) / 60000,
    );
    let hours = hourDifference;
    const minutes =
      minuteDifference < 10
        ? `0${minuteDifference}`
        : minuteDifference == 60
        ? hours++
        : minuteDifference;
    return `${hourDifference}h ${minutes}m`;
  }

  getTimeDifferenceBetweenDates(laterDate: Date, earlierDate: Date) {
    const timeDifference = laterDate.getTime() - earlierDate.getTime();
    return timeDifference;
  }
}
