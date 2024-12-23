// const { default: axios } = require("axios");

// Calling Html Elements
let chooseCountry = document.querySelector("#country");
let chosenCountry = document.querySelector("option");
let cities = document.querySelector("#city");
let prayerText = document.querySelectorAll(".prayer p");
let prayer = document.querySelectorAll(".prayer");
let currentTime = document.querySelector(".current-time p");
let yaer = (document.querySelector(".footer span").innerHTML =
  new Date().getFullYear());
// Get Countries
function getCountries() {
  axios
    .get("http://api.geonames.org/countryInfoJSON?username=abdulaziz487583")
    .then((response) => {
      let countryName = response.data.geonames.map((ele) => ele.countryName);
      let uniqCountryName = [...new Set(countryName)];
      let countryCode = response.data.geonames.map((ele) => ele.countryCode);
      let uniqCountryCode = [...new Set(countryCode)];
      // Calling Countries
      addCountryToPage(uniqCountryName, uniqCountryCode);
      // Country Click Event
      chooseCountry.addEventListener("change", (e) => {
        cities.innerHTML = "";
        cities.innerHTML = `<option style="display: none">اختر المدينة</option>`;
        getCitesByClic(chooseCountry.value);
      });
      //  print city name
      cities.addEventListener("change", () => {
        let innerCountryText =
          chooseCountry.options[chooseCountry.selectedIndex].text;
        let innerCityText = cities.options[cities.selectedIndex].text;
        // get Prayer Time
        getPrayerTimes(innerCountryText, innerCityText);
      });
    });
}
getCountries();
// تحديث الساعة أول مرة عند تحميل الصفحة
updateClock();
function addCountryToPage(countryName, countryCode) {
  countryName.forEach((element, index) => {
    let option = document.createElement("option");
    let opText = document.createTextNode(element);
    option.appendChild(opText);
    // تعيين القيمة (value) باستخدام countryCode المرتبط
    option.value = countryCode[index]; // كل دولة تأخذ الكود المقابل لها
    // إضافة العنصر إلى القائمة
    chooseCountry.appendChild(option);
  });
}
function getCitesByClic(countryCode) {
  axios
    .get(
      `http://api.geonames.org/searchJSON?country=${countryCode}&maxRows=1000&username=abdulaziz487583`
    )
    .then((response) => {
      let city = response.data.geonames
        .map((ele) => ele.adminName1)
        .filter((ele) => ele != "");

      let filteredCity = [...new Set(city)];
      filteredCity.forEach((element) => {
        let option = document.createElement("option");
        let opText = document.createTextNode(element);
        option.appendChild(opText);
        cities.appendChild(option);
      });
    });
}
// get Prayer Times
function getPrayerTimes(countryName, cityName) {
  axios
    .get(
      `https://api.aladhan.com/v1/timingsByCity?city=${cityName}&country=${countryName}`
    )
    .then((response) => {
      let times = response.data.data.timings;

      prayerText[0].innerHTML = times.Fajr;
      prayerText[1].innerHTML = times.Sunrise;
      prayerText[2].innerHTML = times.Dhuhr;
      prayerText[3].innerHTML = times.Asr;
      prayerText[4].innerHTML = times.Maghrib;
      prayerText[5].innerHTML = times.Isha;
      prayer.forEach((element) => {
        element.classList.add("show");
      });
    });
}
function updateClock() {
  const clockElement = document.getElementById("clock");

  // الحصول على الوقت الحالي
  const now = new Date();

  // استخراج الساعة والدقيقة والثانية
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // تحديث النص في العنصر
  currentTime.textContent = `${hours}:${minutes}:${seconds}`;
}

// تحديث الساعة كل ثانية
setInterval(updateClock, 1000);
