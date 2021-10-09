//---------------VARIABILES-------------
let btn = document.querySelector(".cont"),
  inner = document.querySelector(".inner"),
  Asia = document.querySelector(".Asia"),
  Europe = document.querySelector(".Europe"),
  Africa = document.querySelector(".Africa"),
  Oceania = document.querySelector(".Oceania"),
  Americas = document.querySelector(".Americas"),
  country = document.querySelector("#country"),
  corona = document.querySelector(".corona"),
  num1 = document.querySelector(".num1"),
  num2 = document.querySelector(".num2"),
  num3 = document.querySelector(".num3"),
  num4 = document.querySelector(".num4"),
  num5 = document.querySelector(".num5"),
  num6 = document.querySelector(".num6");

btn.addEventListener("click", () => {
  corona.style.display = "none";
  inner.style.transform = "scale(1)";
  inner.style.transitionDuration = "4s";
});
//------------------- CALLING THE DATA--------------------
async function getCountry() {
  let statsCountry = await (await fetch("https://corona-api.com/countries")).json();
  countryArray = statsCountry.data.map((item) => {
    return {
      NameCon: item.name,
      confirmed: item.latest_data.confirmed,
      deaths: item.latest_data.deaths,
      recovered: item.latest_data.recovered,
      critical: item.latest_data.critical,
      today_confirmed: item.today.confirmed,
      today_deaths: item.today.deaths,
    };
  });
  window.localStorage.setItem("countries", JSON.stringify(countryArray));
}
getCountry()
let getCount = JSON.parse(window.localStorage.getItem("countries"));
console.log(getCount)



async function getRegion() {
  let Region = await (await fetch("https://api.allorigins.win/raw?url=https://restcountries.herokuapp.com/api/v1")).json();
  regionArray = Region.filter((val) => val.region.length > 0).map((item) => {
    return {
      Name: item.name.common,
      region: item.region,
    };
  });
  window.localStorage.setItem("regions", JSON.stringify(regionArray));
}
getRegion();
let getReg = JSON.parse(window.localStorage.getItem("regions"));

//------------------- CHARTING--------------------
//FUNCTION THAT TAKES AN ARRAY OF COUNTRIES NAMES AND AN ARRAY OF THE STATISTICS FOR SPECIFIC CASE
let myChart;
function getChart(regArr, statInfoConfirmed, statInfoDeath,statInfoRecovered,statInfoCritical) {
  if (myChart) 
  myChart.destroy();
//   Chart.defaults.datasets.data = `${statInfoConfirmed}`;
  var ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    // type: "line",
    data: {
      labels: regArr,
      datasets: [
        {
          label: "# of Confirmed",
          data: statInfoConfirmed,
          type: "line",
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
          ],
          borderColor: ["black"],
          borderWidth: 2,
          fill: true,
          tension: 0.5,
          hidden:false
        },
        {
            label: "# of Deaths",
            data: statInfoDeath,
            type: "line",
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
            ],
            borderColor: ["black"],
            borderWidth: 2,
            fill: true,
            tension: 0.5,
            hidden:true
          },
           {
            label: "# of Recoverd",
            data: statInfoRecovered,
            type: "line",
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
            ],
            borderColor: ["black"],
            borderWidth: 2,
            fill: true,
            tension: 0.5,
            hidden:true

          },
        {
            label: "# of Critical",
            data: statInfoCritical,
            type: "line",
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
            ],
            borderColor: ["black"],
            borderWidth: 2,
            fill: true,
            tension: 0.5,
            hidden:true
          },
      ],
    },
    options: {
      maintainAspectRatio: false,
    },
  });
}

//-------------------FUNCTIONS--------------------
//FUNCTION THAT TAKES THE REGION NAME, AND RETURN AN ARRAY OF ALL THE COUNTRIES IN THAR REGION
function getCountryByRegion(region) {
  return getReg.filter((val) => val.region == region).map((item) => item.Name);
}

// FUNCTION THAT TAKES THE REGION NAME, AND RETURNS AN OBJECT THAT CONTAINS THE COUNTRIES NAMES AS KEYS AND HOW MANY CONFIRMED CASES FOR EACH COUNTRY IN THAT ORIGIN
function getConfirmedByCountry(region, cases) {
  let obj = {};
  getCountryByRegion(region).forEach((element) => {
    getCount.map((val) => {
      if (val.NameCon == element) {
        obj[`${element}`] = val[`${cases}`];
      }
    });
  });
  return obj;
}

//FUNCTION THAT GIVES ME THE CHART PER REGION 
function chartByRegion(region){
    getChart(
    Object.keys(getConfirmedByCountry(region, "confirmed")),
    Object.values(getConfirmedByCountry(region, "confirmed")),
    Object.values(getConfirmedByCountry(region, "deaths")),
    Object.values(getConfirmedByCountry(region, "recovered")),
    Object.values(getConfirmedByCountry(region, "critical"))
  );
}

//FUNCTION THE TAKES THE COUNTRIES OF EACH REGION AND ADD THEM TO THE SELECT TAG
function interCountries(region){
country.innerHTML=`<option value="Any">Any</option>`;
let countryName=Object.keys(getConfirmedByCountry(region, "confirmed"))
for(let i=0;i<countryName.length;i++){
country.innerHTML+=`<option value="${countryName[i]}">${countryName[i]}</option>`
}
} 

//ADDEVENTLISTENER TO THE SELECT TAG BY CHANGING THE COUNTRY GIVES US THE SPECIFIC DATA FOR THE SELECTED COUNTRY
country.addEventListener("change",()=>{
   let selected=document.querySelector("select").value
    console.log(selected)
    for(let i=0;i<getCount.length;i++){
        if(selected=="Any"){
            num1.innerHTML=num2.innerHTML=num3.innerHTML=num4.innerHTML=num5.innerHTML=num6.innerHTML=""
        }
        if(selected==getCount[i].NameCon){
            console.log(getCount[i])
            num1.innerHTML=getCount[i].confirmed
            num2.innerHTML=getCount[i].today_confirmed
            num3.innerHTML=getCount[i].deaths
            num4.innerHTML=getCount[i].today_deaths
            num5.innerHTML=getCount[i].recovered
            num6.innerHTML=getCount[i].critical
        }
    }
});

//ADDEVENTLISTENER TO THE REGIONS BUTTONS TO CALL THE CHART FUNCTION AND THE FUNCTION THAT INTER THE COUNTREIS TO THE SELECT TAG
Asia.addEventListener("click", () => {
    num1.innerHTML=num2.innerHTML=num3.innerHTML=num4.innerHTML=num5.innerHTML=num6.innerHTML=""
    chartByRegion("Asia")
    interCountries("Asia") 
});
Europe.addEventListener("click", () => {
    num1.innerHTML=num2.innerHTML=num3.innerHTML=num4.innerHTML=num5.innerHTML=num6.innerHTML=""
    chartByRegion("Europe")
    interCountries("Europe")
});
Oceania.addEventListener("click", () => {
    num1.innerHTML=num2.innerHTML=num3.innerHTML=num4.innerHTML=num5.innerHTML=num6.innerHTML=""
    chartByRegion("Oceania")
    interCountries("Oceania")
});
Africa.addEventListener("click", () => {
    num1.innerHTML=num2.innerHTML=num3.innerHTML=num4.innerHTML=num5.innerHTML=num6.innerHTML=""
    chartByRegion("Africa")
    interCountries("Africa")
});
Americas.addEventListener("click", () => {
    num1.innerHTML=num2.innerHTML=num3.innerHTML=num4.innerHTML=num5.innerHTML=num6.innerHTML=""
    chartByRegion("Americas")
    interCountries("Americas")
});





