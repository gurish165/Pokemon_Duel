// This is the main JavaScript file for the app

function sayHello() {
    console.log("Hello, world!");
  }
  
var colors = [];
let sections = [];

function createPieChart() {
  sections = [];

  // loop through each field div
  const fieldList = document.getElementById("attack-table");
  const fields = fieldList.querySelectorAll("tbody");

  for (let i = 0; i < fields.length; i++) {
    const tbody = fields[i];
    const color = getComputedStyle(tbody.querySelector(".attack-name-cell")).backgroundColor;
    let attackName = tbody.querySelector(".attack-name-cell").innerText;
    const percentage = tbody.querySelector(".attack-percentage-cell").innerText;
    let attackValue = tbody.querySelector(".attack-value-cell").innerText;
    // Get attack ability if there is one
    const attackAbilityRow = tbody.querySelector(".attack-ability-row");
    let attackAbility = "";
    if(attackAbilityRow){
      attackAbility = attackAbilityRow.querySelector(".attack-ability-cell").innerText;
    }

    // Seperate the attack damage from attack name if it is a purple attack
    if (color == "rgb(192, 113, 226)"){
      let originalString = attackName;
      let words = originalString.split(" "); // split the string into an array of words
      let lastWord = words.pop(); // remove and return the last word from the array
      let shortenedString = words.join(" "); // join the remaining words back into a string
      attackName = shortenedString;
      attackValue = lastWord;
    }
    sections.push({ color, attackName, percentage: parseInt(percentage), attackValue, attackAbility});
  }
  drawPieChart(sections);
}

function getDarkerColor(color, darkenFactor){
  const baseColorArray = color.match(/\d+/g);
  // Subtract darkenFactor from each RGB value and ensure it stays within 0-255 range
  const newRgbValues = baseColorArray.map(value => Math.max(0, parseInt(value, 10) - darkenFactor));
  // Convert the new RGB values back to a color string
  const newBackgroundColor = `rgb(${newRgbValues.join(',')})`;
  return newBackgroundColor;
}

function getLighterColor(color, lightenFactor){
  const baseColorArray = color.match(/\d+/g);
  // Add lightenFactor from each RGB value and ensure it stays within 0-255 range
  const newRgbValues = baseColorArray.map(value => Math.max(0, parseInt(value, 10) + lightenFactor));
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

function drawPieChart(sections) {
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
    const sectionAngle = (1 / 96) * 2 * Math.PI;

    // Get the RGB values from the background color string
    const baseColor = section.color;
    const newBackgroundColor = getDarkerColor(section.color, 20)

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
    writeAttackNames(section.attackName, section.percentage, ctx, sectionStartAngle, endAngle, radius, centerX, centerY);
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
      const theta17p = (2*Math.PI) * (17 / 96)
      const maxChordLen = (2 * radius * 0.85) * Math.abs(Math.sin(theta17p/2));
      desiredLength = maxChordLen;
    }
    else{
      const theta = (2*Math.PI) * (percentage / 96);
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
  if (isNaN(percentageInt) || percentageInt <= 0 || percentageInt + totalPercentage > 96) {
    alert("Please enter a valid percentage.");
    return false;
  }
  if (percentageInt + totalPercentage > 96){
    alert("Pie chart segments must <= 96");
    return false;
  }
  return true;
}

function addTableHeader(table){
  if(table.getElementsByClassName("table-header").length == 0){
    // Create table header
    let tableHeader = document.createElement("tr");
    tableHeader.className = "table-header";
    // Add header fields
    let percentageHeader = document.createElement("td");
    percentageHeader.className = "percentage-header";
    percentageHeader.innerText = "Size";
    let attackNameHeader = document.createElement("td");
    attackNameHeader.className = "attack-name-header";
    attackNameHeader.innerText = "Attack";
    let attackDamageHeader = document.createElement("td");
    attackDamageHeader.className = "attack-damage-header";
    attackDamageHeader.innerText = "Damage";
    let deleteHeader = document.createElement("td");
    deleteHeader.className = "delete-header";
    deleteHeader.innerText = "Delete";
    // Add header cells to header
    tableHeader.appendChild(percentageHeader);
    tableHeader.appendChild(attackNameHeader);
    tableHeader.appendChild(attackDamageHeader);
    tableHeader.appendChild(deleteHeader);
    table.appendChild(tableHeader);
  }
}

function formatAttackAbility(attackAbilityRow, attackAbility, color){
  attackAbilityRow.className = "attack-ability-row";
  let attackAbilityCell = document.createElement("td");
  attackAbilityCell.className = "attack-ability-cell";
  attackAbilityCell.innerText = attackAbility;
  attackAbilityCell.colSpan = 3;
  attackAbilityCell.style.outline = "2px solid " + getDarkerColor(color, 30);
  attackAbilityCell.style.setProperty("-webkit-outline", "2px solid " + getDarkerColor(color, 30));
  attackAbilityCell.style.setProperty("-moz-outline", "2px solid " + getDarkerColor(color, 30));
  attackAbilityCell.style.outlineOffset = "-2px";
  attackAbilityRow.appendChild(attackAbilityCell);
  // Add attack ability row to attack body with color
  attackAbilityRow.style.backgroundColor = getLighterColor(color, 120);
}

function createTable(attackName, percentage, color, attackValue, attackAbility){
  const table = document.getElementById("attack-table");
  addTableHeader(table);
  let attackBody = document.createElement("tbody");
  attackBody.className = "attack-body";

  let attackRow = document.createElement("tr");
  attackRow.className = "attack-row";

  let percentageCell = document.createElement("td");
  percentageCell.className = "attack-percentage-cell";
  percentageCell.innerText = percentage;
  percentageCell.style.backgroundColor = getDarkerColor(color, 30);
  attackRow.appendChild(percentageCell);

  let attackNameCell = document.createElement("td");
  attackNameCell.className = "attack-name-cell";
  // add stars if attack is purple
  if(color == "rgb(192, 113, 226)"){
    attackNameCell.innerText = attackName + " " + attackValue;
  }
  else{
    attackNameCell.innerText = attackName;
  }
  attackNameCell.style.backgroundColor = color;
  attackRow.appendChild(attackNameCell);

  let attackValueCell = document.createElement("td");
  attackValueCell.className = "attack-value-cell";
  // Don't add attack value if it is a purple attack
  if(color != "rgb(192, 113, 226)"){
    attackValueCell.innerText = attackValue;
  }
  attackValueCell.style.backgroundColor = color;
  attackRow.appendChild(attackValueCell);

  // Configure and add delete button to first tr in tbody
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerText = "x";
  deleteButton.addEventListener("click", () => {
    attackBody.remove();
    totalPercentage -= parseInt(percentage);
    // update pie chart
    createPieChart();
  });
  const deleteCell = document.createElement('td');
  deleteCell.className = "delete-cell";
  deleteCell.appendChild(deleteButton);
  deleteCell.rowSpan = 2;
  attackRow.appendChild(deleteCell);

  // Add attack row to attack body with color
  // attackRow.style.backgroundColor = color;
  attackBody.appendChild(attackRow);

  // Create an attack ability row if there is an attack ability 
  if(attackAbility != ""){
    let attackAbilityRow = document.createElement("tr");
    formatAttackAbility(attackAbilityRow, attackAbility, color);
    attackBody.appendChild(attackAbilityRow);
  }
  
  table.appendChild(attackBody);
}

function addField() {
  const color = document.getElementById("color-dropdown").value;
  const attackName = document.getElementById("attack-name-field").value;
  const percentage = document.getElementById("percentage-field").value;
  const attackValue = document.getElementById("attack-value-field").value;
  const attackAbility = document.getElementById("attack-ability-field").value;

  // check if input is valid
  if (!validateInput(color, attackName, percentage)){
    return;
  }
  let percentageInt = parseInt(percentage);

  // update total percentage and clear input fields
  totalPercentage += percentageInt;
  clearFields();

  // Add table
  createTable(attackName, percentage, color, attackValue, attackAbility);

  // update pie chart
  createPieChart();

}

function clearFields(){
  document.getElementById("color-dropdown").selectedIndex = 0;
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
  let pokemon_name = document.getElementById("pokemon-name-field").value;
  if(pokemon_name == "") pokemon_name = "default-pokemon";
  link.download = pokemon_name +"-wheel.jpg";
  link.href = dataUrl;
  link.click();
}

function downloadTable(){
  let pokemon_name = document.getElementById("pokemon-name-field").value;
  if(pokemon_name == "") pokemon_name = "default-pokemon";
  // Get the canvas element
  // Get the HTML table element
  const table = document.querySelector('#attack-table');

  // Clone the table and remove the delete header and cells
  const tableClone = table.cloneNode(true);
  const deleteHeader = tableClone.querySelector('.delete-header');
  deleteHeader.parentNode.removeChild(deleteHeader);
  const deleteCells = tableClone.querySelectorAll('.delete-cell');
  deleteCells.forEach(function(cell) {
    cell.parentNode.removeChild(cell);
  });

  // Create a new div for the cloned table
  const tableContainer = document.createElement('div');
  tableContainer.style.fontFamily = "Segoe UI";
  tableContainer.style.display = "flex";
  tableContainer.appendChild(tableClone);
  document.body.appendChild(tableContainer);

  // Use html2canvas to convert the table to an image
  const table_name = pokemon_name + "-attack-table.png";
  html2canvas(tableContainer, {
    useCORS: true,
    allowTaint: true,
    scrollY: -window.scrollY,
  }).then(function(canvas) {
    // Create a link to download the image
    const link = document.createElement('a');
    link.download = table_name;
    link.href = canvas.toDataURL('image/png');

    // Click the link to download the image
    link.click();

    // Remove the wrapper element from the document body
    document.body.removeChild(tableContainer);
  });
}

sayHello();