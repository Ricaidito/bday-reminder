const checkBirthdays = birthdays => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const todayString = `${today.getFullYear()}-${month}-${day}`;

  birthdays.forEach(birthday => {
    if (birthday.birthdate === todayString) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "../assets/bday-icon.png",
        title: "Birthday Reminder",
        message: `Today is ${birthday.name}'s birthday!`,
      });
    }
  });
};

export { checkBirthdays };
