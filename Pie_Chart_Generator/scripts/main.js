// This is the main JavaScript file for the app

function sayHello() {
    console.log("Hello, world!");
  }
  
var colors = [];
let sections = [];

function createPieChart() {
  sections = [];

  // loop through each field div
  const fieldList = document.getElementById("field-list");
  const fields = fieldList.children;

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const color = getComputedStyle(field.querySelector(".pieColor")).backgroundColor;
    const text = field.querySelector(".pieText").innerText;
    const percentage = field.querySelector(".piePercentage").innerText.replace("%", "");
    const attackValue = field.querySelector(".pieAttackValue").innerText;
    const attackAbility = field.querySelector(".pieAttackAbility").innerText;
    sections.push({ color, text, percentage: parseInt(percentage), attackValue, attackAbility});
  }

  drawPieChart(sections);
}

function getDarkerColor(section){
  const baseColorArray = section.color.match(/\d+/g);
  // Subtract 50 from each RGB value and ensure it stays within 0-255 range
  const newRgbValues = baseColorArray.map(value => Math.max(0, parseInt(value, 10) - 30));
  // Convert the new RGB values back to a color string
  const newBackgroundColor = `rgb(${newRgbValues.join(',')})`;
  return newBackgroundColor;
}

function drawPieChart() {
  const canvas = document.getElementById("pie-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;

  ctx.clearRect(0, 0, width, height);

  let startAngle = 0;
  let endAngle = 0;

  sections.forEach((section) => {
    const sectionStartAngle = startAngle;
    const sectionAngle = (1 / 100) * 2 * Math.PI;

    // Get the RGB values from the background color string
    const baseColor = section.color;
    const newBackgroundColor = getDarkerColor(section)

    // Color in the section with alternating colors
    for (var i = 0; i < section.percentage; i++){
      endAngle = startAngle + sectionAngle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      if(i % 2 == 0){
        ctx.fillStyle = baseColor;
      }
      else{
        ctx.fillStyle = newBackgroundColor;
      }
      
      ctx.fill();
      startAngle = endAngle
    }
    // Write Attack Names
    writeAttackNames(section, ctx, sectionStartAngle, endAngle, radius, centerX, centerY);
    // Write Attack Values
    writeAttackValues(section, ctx, sectionStartAngle, endAngle, radius, centerX, centerY);
    // Draw border
    drawBorder(ctx, 7, centerX, centerY, radius);
  });
}

function writeAttackNames(section, ctx, sectionStartAngle, endAngle, radius, centerX, centerY) {
  if (section.percentage >= 10) {
    const sectionMiddleAngle = sectionStartAngle + ((endAngle-sectionStartAngle) / 2);
    const textRadius = radius * 0.85; // 85% of the pie chart radius
    const textX = centerX + Math.cos(sectionMiddleAngle) * textRadius;
    const textY = centerY + Math.sin(sectionMiddleAngle) * textRadius;
    const sectionText = section.text;
    let fontSize = 60;
    ctx.font = fontSize + "px Segoe UI";

    // Calculate the width of the text
    let textWidth = ctx.measureText(sectionText).width;

    // Calculate the maximum font size that will fit the text inside the outer circle
    let maxFontSize = (textRadius * 2) / Math.sqrt(2 * (1 - Math.cos(textWidth / (textRadius))))/20;
    // Set the font size to the maximum font size or the original font size, whichever is smaller
    ctx.font = Math.min(fontSize, maxFontSize) + "px Segoe UI";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(sectionMiddleAngle-Math.PI/2);
    ctx.fillText(sectionText, 0, 0);
    ctx.restore();
  }
}


function writeAttackValues(section, ctx, sectionStartAngle, endAngle, radius, centerX, centerY){
  if (section.percentage >= 10) {
    const sectionMiddleAngle = sectionStartAngle + ((endAngle-sectionStartAngle) / 2);
    const textRadius = radius * 0.55; // 55% of the pie chart radius
    const textX = centerX + Math.cos(sectionMiddleAngle) * textRadius;
    const textY = centerY + Math.sin(sectionMiddleAngle) * textRadius;
    const sectionText = section.attackValue;
    let fontSize = 80;
    ctx.font = fontSize + "px Segoe UI";

    // Calculate the width of the text
    let textWidth = ctx.measureText(sectionText).width;

    // Calculate the maximum font size that will fit the text inside the outer circle
    let maxFontSize = (textRadius * 2) / Math.sqrt(2 * (1 - Math.cos(textWidth / (textRadius))))/15;
    // Set the font size to the maximum font size or the original font size, whichever is smaller
    ctx.font = "bold " + Math.min(fontSize, maxFontSize) + "px Segoe UI";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(sectionMiddleAngle-Math.PI/2);
    ctx.fillText(sectionText, 0, 0);
    ctx.restore();
  }
}

function drawBorder(ctx, lineWidth, centerX, centerY, radius){
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 4, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

let totalPercentage = 0;

function addField() {
  const color = document.getElementById("color-field").value;
  const attackName = document.getElementById("attack-name-field").value;
  const percentage = document.getElementById("percentage-field").value;
  const attackValue = document.getElementById("attack-value-field").value;
  const attackAbility = document.getElementById("attack-ability-field").value;

  // check if input is valid
  if (color === "" || attackName === "" || percentage === "") {
    alert("Please fill in all fields.");
    return;
  }

  const percentageInt = parseInt(percentage);

  // check if percentage is valid
  if (isNaN(percentageInt) || percentageInt <= 0 || percentageInt + totalPercentage > 100) {
    alert("Please enter a valid percentage.");
    return;
  }
  if (percentageInt + totalPercentage > 100){
    alert("Pie chart segments must be less than 100");
    return;
  }

  const pieChart = document.getElementById("pie-chart");

  // create new section div
  const section = document.createElement("div");
  section.className = "section";
  section.style.backgroundColor = color;
  section.style.backgroundImage = `conic-gradient(${color} 0% ${percentageInt}%, rgba(0,0,0,0) ${percentageInt}% 100%)`;

  // add new section to pie chart
  pieChart.appendChild(section);

  // create new field div
  const field = document.createElement("div");
  field.className = "field";
  
  // create field content
  const fieldName = document.createElement("p");
  fieldName.className = "pieText"
  fieldName.innerText = attackName;
  field.appendChild(fieldName);

  const fieldPercentage = document.createElement("p");
  fieldPercentage.className = "piePercentage"
  fieldPercentage.innerText = percentage + "%";
  field.appendChild(fieldPercentage);

  const pieColor = document.createElement("div");
  pieColor.className = "pieColor";
  pieColor.style.backgroundColor = color;
  pieColor.style.height = "50px";
  pieColor.style.width = "50px";
  field.appendChild(pieColor);

  const fieldAttackValue = document.createElement("p");
  fieldAttackValue.className = "pieAttackValue"
  fieldAttackValue.innerText = attackValue;
  field.appendChild(fieldAttackValue);

  const fieldAttackAbility = document.createElement("p");
  fieldAttackAbility.className = "pieAttackAbility"
  fieldAttackAbility.innerText = attackAbility;
  field.appendChild(fieldAttackAbility);

  // create delete button
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerText = "x";
  deleteButton.addEventListener("click", () => {
    pieChart.removeChild(section);
    field.parentNode.removeChild(field);
    totalPercentage -= percentageInt;
    // update pie chart
    createPieChart();
  });
  field.appendChild(deleteButton);

  // add new field to list
  const fieldList = document.getElementById("field-list");
  fieldList.appendChild(field);

  // update total percentage and clear input fields
  totalPercentage += percentageInt;
  clearFields();

  // update pie chart
  createPieChart();
}

function clearFields(){
  document.getElementById("color-field").value = "#000000";
  document.getElementById("attack-name-field").value = "";
  document.getElementById("attack-value-field").value = "";
  document.getElementById("attack-ability-field").value = "";
  document.getElementById("percentage-field").value = "";
}


sayHello();