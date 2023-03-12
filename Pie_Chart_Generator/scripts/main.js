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

function getDarkerColor(section, darkenFactor){
  const baseColorArray = section.color.match(/\d+/g);
  // Subtract 50 from each RGB value and ensure it stays within 0-255 range
  const newRgbValues = baseColorArray.map(value => Math.max(0, parseInt(value, 10) - darkenFactor));
  // Convert the new RGB values back to a color string
  const newBackgroundColor = `rgb(${newRgbValues.join(',')})`;
  return newBackgroundColor;
}

function drawSectionBorder(ctx, centerX, centerY, radius, endAngle){
  // draw section border
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, endAngle-0.005, endAngle);
  ctx.closePath();
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fill();
}

function drawPieCenter(ctx, centerX, centerY, radius){
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius/5, 0, 2*Math.PI);
  ctx.closePath();
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius/6, 0, 2*Math.PI);
  ctx.closePath();
  ctx.fillStyle = 'rgb(40,40,40)';
  ctx.fill();
}

function drawPieChart() {
  const canvas = document.getElementById("pie-chart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height)/2 - 15;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0, 0, 0, 0)";

  let startAngle = 0;
  let endAngle = 0;

  sections.forEach((section) => {
    const sectionStartAngle = startAngle;
    const sectionAngle = (1 / 100) * 2 * Math.PI;

    // Get the RGB values from the background color string
    const baseColor = section.color;
    const newBackgroundColor = getDarkerColor(section, 20)

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

    // Draw section border
    drawSectionBorder(ctx, centerX, centerY, radius, endAngle);
    // Write Attack Names
    writeAttackNames(section.text, section.percentage, ctx, sectionStartAngle, endAngle, radius, centerX, centerY);
    // Write Attack Values
    writeAttackValues(section.attackValue, section.percentage, ctx, sectionStartAngle, endAngle, radius, centerX, centerY);
    
  });
  // Draw border
  drawBorder(ctx, 20, centerX, centerY, radius);
  // Draw pie center
  drawPieCenter(ctx, centerX, centerY, radius)
}

function writeAttackNames(text, percentage, ctx, sectionStartAngle, endAngle, radius, centerX, centerY) {
  if (percentage >= 4) {
    const sectionMiddleAngle = sectionStartAngle + ((endAngle-sectionStartAngle) / 2);
    const textRadius = radius * 0.85; // 85% of the pie chart radius
    const textX = centerX + Math.cos(sectionMiddleAngle) * textRadius;
    const textY = centerY + Math.sin(sectionMiddleAngle) * textRadius;
    const sectionText = text;
    
    const font = "Segoe UI";
    let fontSize = 1; // starting font size
    ctx.font = "bold " + fontSize + "px " + font;
    let desiredLength = 0;

    // Determine chord length the text must fit over
    if(percentage >= 17) { 
      const theta17p = (2*Math.PI) * (17 / 100)
      const maxChordLen = (2 * radius * 0.85) * Math.abs(Math.sin(theta17p/2));
      desiredLength = maxChordLen;
    }
    else{
      const theta = (2*Math.PI) * (percentage / 100);
      const smallerRadius = 0.85 * radius;
      const chordLen = (2 * smallerRadius) * Math.abs(Math.sin(theta/2));
      desiredLength = chordLen;
    }

    // Increase font size until chord length is reached
    while (ctx.measureText(text).width < desiredLength && fontSize < 50) {
      fontSize++;
      ctx.font = "bold " + fontSize + "px " + font;
    }

    // Write to canvas
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


function writeAttackValues(text, percentage, ctx, sectionStartAngle, endAngle, radius, centerX, centerY){
  if (percentage >= 4) {
    const sectionMiddleAngle = sectionStartAngle + ((endAngle-sectionStartAngle) / 2);
    const textRadius = radius * 0.55; // 55% of the pie chart radius
    const textX = centerX + Math.cos(sectionMiddleAngle) * textRadius;
    const textY = centerY + Math.sin(sectionMiddleAngle) * textRadius;
    const sectionText = text;
    let fontSize = 100;
    ctx.font = fontSize + "px Segoe UI";

    // Calculate the width of the text
    let textWidth = ctx.measureText(sectionText).width;

    // Calculate the maximum font size that will fit the text inside the outer circle
    let arcFactor = 150 / percentage;
    let maxFontSize = (textRadius * 2) / Math.sqrt(2 * (1 - Math.cos(textWidth / (textRadius))))/arcFactor;
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

function drawBorder(ctx, borderWidth, centerX, centerY, radius){
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 4, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.lineWidth = borderWidth;
  ctx.stroke();
}

let totalPercentage = 0;

function validateInput(color, attackName, percentage){
  if (color === "" || attackName === "" || percentage === "") {
    alert("Please fill in all fields.");
    return false;
  }

  const percentageInt = parseInt(percentage);

  // check if percentage is valid
  if (isNaN(percentageInt) || percentageInt <= 0 || percentageInt + totalPercentage > 100) {
    alert("Please enter a valid percentage.");
    return false;
  }
  if (percentageInt + totalPercentage > 100){
    alert("Pie chart segments must be less than 100");
    return false;
  }
  return true;
}

function createFieldContent(field, attackName, percentage, color, attackValue, attackAbility){
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
  field.appendChild(pieColor);

  const fieldAttackValue = document.createElement("p");
  fieldAttackValue.className = "pieAttackValue"
  fieldAttackValue.innerText = attackValue;
  field.appendChild(fieldAttackValue);

  const fieldAttackAbility = document.createElement("p");
  fieldAttackAbility.className = "pieAttackAbility"
  fieldAttackAbility.innerText = attackAbility;
  field.appendChild(fieldAttackAbility);
}

function addField() {
  const color = document.getElementById("color-field").value;
  const attackName = document.getElementById("attack-name-field").value;
  const percentage = document.getElementById("percentage-field").value;
  const attackValue = document.getElementById("attack-value-field").value;
  const attackAbility = document.getElementById("attack-ability-field").value;

  // check if input is valid
  if (!validateInput(color, attackName, percentage)){
    return;
  }
  let percentageInt = parseInt(percentage);
  
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
  createFieldContent(field, attackName, percentage, color, attackValue, attackAbility)

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

function downloadDisk(){
  // Get the canvas element
  const canvas = document.getElementById("pie-chart");
  // Convert the new canvas to an image and download it
  const dataUrl = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.download = "pie-chart.jpg";
  link.href = dataUrl;
  link.click();
}

sayHello();