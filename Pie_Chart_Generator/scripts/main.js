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
    sections.push({ color, text, percentage: parseInt(percentage) });
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
    const sectionMiddleAngle = sectionStartAngle + endAngle / 2;
    const textRadius = radius * 0.75; // 75% of the pie chart radius
    const sectionText = section.text;
    const fontSize = Math.min(Math.max(radius * 0.07, 12), 30); // Scale font size based on radius
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Split the section text into individual characters and create a span element for each character
    const chars = sectionText.split("");
    const charSpans = chars.map((char) => {
      const span = document.createElement("span");
      span.innerText = char;
      span.style.position = "absolute";
      span.style.transformOrigin = "bottom center";
      return span;
    });
    
    // Position and rotate each character span
    const charAngle = endAngle / chars.length;
    const charSpacing = 0.003; // Spacing between characters, in radians
    let charRotation = sectionMiddleAngle - endAngle / 2 + charAngle / 2;
    charSpans.forEach((span) => {
      const charX = centerX - Math.cos(charRotation) * textRadius;
      const charY = centerY - Math.sin(charRotation) * textRadius;
      span.style.left = `${charX}px`;
      span.style.top = `${charY}px`;
      span.style.transform = `rotate(${charRotation - Math.PI / 2}rad)`;
      charRotation += charAngle + charSpacing;
    });

    // Add the span elements to the DOM
    charSpans.forEach((span) => {
      pieChartContainer = document.getElementById("pie-chart-container");
      pieChartContainer.appendChild(span);
    });
  }
}


function writeAttackValues(section, ctx, sectionStartAngle, endAngle, radius, centerX, centerY){
  if (section.percentage >= 10) {
    const sectionMiddleAngle = sectionStartAngle + endAngle / 2;
    const textRadius = radius * 0.75; // 75% of the pie chart radius
    const textX = centerX + Math.cos(sectionMiddleAngle) * textRadius;
    const textY = centerY + Math.sin(sectionMiddleAngle) * textRadius;
    const sectionText = section.text;
    const fontSize = Math.min(Math.max(radius * 0.07, 12), 30); // Scale font size based on radius
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(sectionMiddleAngle);
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
  const name = document.getElementById("text-field").value;
  const percentage = document.getElementById("percentage-field").value;

  // check if input is valid
  if (color === "" || name === "" || percentage === "") {
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
  fieldName.innerText = name;
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
  document.getElementById("color-field").value = "#000000";
  document.getElementById("text-field").value = "";
  document.getElementById("percentage-field").value = "";

  // update pie chart
  createPieChart();
}


sayHello();