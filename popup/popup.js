import { checkBirthdays } from "../scripts/birthdaysUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  const createBirthdayCard = (birthday, index) => {
    const birthdayCard = document.createElement("div");
    birthdayCard.className = "birthday-card";

    const birthdayContent = document.createElement("div");
    birthdayContent.innerHTML = `
      <h3>${birthday.name}</h3>
      <p>${birthday.birthdate}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      chrome.storage.local.get(["birthdays"], function (result) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }

        const birthdays = result.birthdays || [];
        birthdays.splice(index, 1);

        chrome.storage.local.set({ birthdays: birthdays }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }

          displayBirthdays();
        });
      });
    });

    birthdayContent.appendChild(deleteButton);
    birthdayCard.appendChild(birthdayContent);
    return birthdayCard;
  };

  const displayBirthdays = () => {
    chrome.storage.local.get(["birthdays"], function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      const birthdays = result.birthdays || [];
      checkBirthdays(birthdays);

      const birthdaysContainer = document.getElementById("birthdays-container");
      birthdaysContainer.innerHTML = "";

      birthdays.forEach((birthday, index) => {
        const birthdayCard = createBirthdayCard(birthday, index);
        birthdaysContainer.appendChild(birthdayCard);
      });
    });
  };

  displayBirthdays();

  const form = document.getElementById("birthdayForm");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const personName = document.getElementById("personName").value;
    const birthdate = document.getElementById("birthdate").value;

    chrome.storage.local.get(["birthdays"], function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      const birthdays = result.birthdays || [];
      birthdays.push({ name: personName, birthdate: birthdate });

      chrome.storage.local.set({ birthdays: birthdays }, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }

        displayBirthdays();
      });
    });
  });
});
