const defaultLabels = {
	"phone": "Enter your phone number:",
	"email": "Email Address",
	"dateWithoutTime": "Choose a date:",
	"dateWithTime": "Choose a date & time:",
	"dropdown": "Select an option:",
	"radioGroup": "Select an option:",
	"number": "Enter a number",
	"multiDate": "Add dates:",
	"multiTime": "Add times:",
	"currency": "Enter an amount:",
	"paragraph": "Type some text here.",
	"divider": `<hr style="width: 100%; display: block; border-color: black;">`,
	"shortText": "Type Question Here:",
	"longText": "Ask a question:",
	"title": "Add a title.",
	"heading": "Add a heading.",
	"time": "Choose a time:",
	"checkboxGroup": "Select choices:",
	"fileUpload": "Upload File:",
	"payment": "Complete Payment to Finish This Form"
};

const defaultPlaceholders = {
	"phone": "(###) ###-####",
	"email": "email@example.com",
	"dateWithoutTime": "",
	"dateWithTime": "",
	"dropdown": "",
	"radioGroup": "",
	"number": "#",
	"multiDate": "",
	"multiTime": "",
	"currency": "$",
	"paragraph": "",
	"divider": "",
	"shortText": "",
	"longText": "Enter your response here.",
	"title": "",
	"heading": "",
	"time": "",
	"checkboxGroup": "",
	"fileUpload": "",
	"payment": ""
};

const fileUploadWidget = `<div id="upload-container">
<span style="font-color: grey; font-size: small; font-style: italic;">First click the Choose File button, select your file to upload, and then click the green <b>Upload</b> button below. Make sure you see the phrase 'Upload Successful' before continuing. You must click the Upload button before submitting this form.</span>
<input type="file" id="file-input">
<button id="submit-btn">UPLOAD</button>
<div id="uploading" style="display: none;"><img src="https://iili.io/JCCz287.gif" border="0" style="width: 20%; display:block; align-self: center; margin: 0 auto;">Uploading... Please wait a moment.</div>
<div id="error" style="display: none;">Oh no! An error occurred. Would you mind trying again?</div>
<div id="success" style="display: none;">Upload Successful!</div>
</div>`;


function addFieldTop() {
	const fieldType = document.getElementById("fieldType").value;
	if (fieldType != "none") {
		const fieldId = Date.now().toString();
		const label = defaultLabels[fieldType]; // Using the default label based on fieldType
		const placeholder = defaultPlaceholders[fieldType]; // Using the default placeholder based on fieldType

		let field = {
			fieldType,
			fieldId,
			label,
			position: fields.length,
			isRequired: false,
			placeholder
		};


		if (fieldType === "checkboxGroup" || fieldType === "radioGroup" || fieldType === "dropdown") {
			const options = []; // Set default options if needed
			field.options = options;
		}

		if (fieldType === "payment") {
			let options = [];
			options.push({
				amount: 0.00,
				productName: "Name of Product",
				productDescription: "Description goes here."
			});

			field.options = options;
		}

		// Inserting as the second field in the list, since the first field is usually the title.
		if (fields.length > 0) {
			if (["paragraph", "heading", "title"].includes(fields[0].fieldType)) {
				fields = [fields[0], field, ...fields.slice(1)];
			} else {
				fields = [field, ...fields];
			}
		} else {
			fields.push(field);
		}

		updatePreview();
	}
}

function addFieldBottom() {
	const fieldType = document.getElementById("fieldType").value;
	if (fieldType != "none") {
		const fieldId = Date.now().toString();
		const label = defaultLabels[fieldType]; // Using the default label based on fieldType
		const placeholder = defaultPlaceholders[fieldType]; // Using the default placeholder based on fieldType


		let field = {
			fieldType,
			fieldId,
			label,
			position: fields.length,
			isRequired: false,
			placeholder
		};


		if (fieldType === "checkboxGroup" || fieldType === "radioGroup" || fieldType === "dropdown") {
			const options = []; // Set default options if needed
			field.options = options;
		}

		if (fieldType === "payment") {
			let options = [];
			options.push({
				amount: 0.00,
				productName: "Name of Product",
				productDescription: "Description goes here."
			});

			field.options = options;
		}

		fields.push(field);
		updatePreview();
	}
}

function addProduct(event, fieldId) {
	event.preventDefault();
	event.stopPropagation();
	let field = fields.find(field => field.fieldId === fieldId);
	const index = document.querySelector(".selected")?.id?.split("-")[document?.querySelector(".selected")?.id?.split("-")?.length - 1] || 0;
	field.options.push({
		"amount": 1,
		"frequency": "",
		"installments": 0,
		"productName": field?.options[index]?.productName || "New Product",
		"productDescription": "———",
		"id": Date.now()
	});
	field.options = field.options.sort((a, b) => b.amount - a.amount);
	updatePreview();
	selectPaymentOption(id);
}

function deleteProduct(event, fieldId) {
	event.preventDefault();
	event.stopPropagation();
	let field = fields.find(field => field.fieldId === fieldId);
	const index = document.querySelector(".selected").id.split("-")[document.querySelector(".selected").id.split("-").length - 1] || 0;
	const selectedProductId = field.options[index].id;
	field.options = field.options.filter(product => product.id !== selectedProductId);
	field.options = field.options.sort((a, b) => b.amount - a.amount);
	updatePreview();
	selectPaymentOption(id);
}

function editProductName(event, fieldId) {
	event.preventDefault();
	event.stopPropagation();
	let field = fields.find(field => field.fieldId === fieldId);
	const index = document.querySelector(".selected").id.split("-")[document.querySelector(".selected").id.split("-").length - 1] || 0;
	customPrompt(`<h1>Enter Product Name:</h1> `, field.options[index].productName).then((value) => {
		if (value) {
			console.log(value); // This will log the input value or null	
			field.options[index].productName = value.trim();
			updatePreview();
			selectPaymentOption(index);
		}
	});

}

function editProductDescription(event, fieldId) {
	event.preventDefault();
	event.stopPropagation();
	let field = fields.find(field => field.fieldId === fieldId);
	const index = document.querySelector(".selected").id.split("-")[document.querySelector(".selected").id.split("-").length - 1] || 0;
	customPrompt("Enter Product Description: ", field.options[index].productDescription).then((value) => {
		console.log(value); // This will log the input value or null
		field.options[index].productDescription = value.trim();
		updatePreview();
		selectPaymentOption(index);

	});
}


function editPrice(event, fieldId) {
	event.preventDefault();
	event.stopPropagation();
	const index = document.querySelector(".selected").id.split("-")[document.querySelector(".selected").id.split("-").length - 1] || 0;
	let field = fields.find(field => field.fieldId === fieldId);
	customPrompt('<h2>Enter a price for this payment option.</h2>', field.options[index]["amount"]).then((value) => {
		console.log(value); // This will log the input value or null
		if (value !== null && !isNaN(Number.parseFloat(value))) {
			field.options[index]["amount"] = Number.parseFloat(Number.parseFloat(value).toFixed(2));
			updatePreview();
			selectPaymentOption(index);
		}
	});
}

function editInstallments(event, fieldId) {
	event.preventDefault();
	event.stopPropagation();
	const index = document.querySelector(".selected").id.split("-")[document.querySelector(".selected").id.split("-").length - 1] || 0;
	let field = fields.find(field => field.fieldId === fieldId);
	customPrompt('<h2>Enter the total number of installments that the customer will pay.</h2>', field.options[index]["installments"]).then((value) => {
		console.log(value); // This will log the input value or null
		if (value !== null && !isNaN(Number.parseInt(value))) {
			let cleanedValue = Number.parseInt(value)
			field.options[index]["installments"] = cleanedValue;
			if (cleanedValue <= 1) {
				field.options[index].installments = "";
				field.options[index].frequency = "";
			}
			else if (cleanedValue <= 1 && (!field.options[index].frequency || ['month', 'year', 'day', 'week'].includes(field.options.index.frequency))) {
				field.options[index].frequency = "";
			}
			updatePreview();
			selectPaymentOption(index);
		}
	});
}

function editPaymentPlan(event, fieldId) {
	event.preventDefault();
	event.stopPropagation();
	let field = fields.find(field => field.fieldId === fieldId);
	const index = document.querySelector(".selected").id.split("-")[document.querySelector(".selected").id.split("-").length - 1] || 0;
	customPrompt(`
	<h1>Choose Payment Plan Type</h1> 
	<p>Enter any of the following options in the box below:</p> 
	<table width="100%" style="text-align: center">
	<thead>
	<th>Option to Type:</th>
	<th>Definition:</th>
	</thead>
	<tr>
		<td><code style="font-size: 18px; font-weight: bold;">Once</code></td>
		<td>For a single payment only.</td>
	</tr>
	<tr>
		<td><code style="font-size: 18px; font-weight: bold;">Day</code></td>
		<td>For daily payments.</td>
	</tr>
	<tr>
		<td><code style="font-size: 18px; font-weight: bold;">Week</code></td>
		<td>For weekly payments.</td>
	</tr>
	<tr>
		<td><code style="font-size: 18px; font-weight: bold;">Month</code></td>
		<td>For a monthly payments.</td>
	</tr>
	<tr>
		<td><code style="font-size: 18px; font-weight: bold;">Year</code></td>
		<td>For yearly payments.</td>
	</tr>
	</table>`, field?.options[index]?.frequency || "One-Time").then((value) => {
		if (value) {
			console.log(value); // This will log the input value or null
			let cleanedValue = value.trim().toLowerCase();
			if (!cleanedValue || cleanedValue === "once") {
				cleanedValue = ""
			}
			field.options[index].frequency = cleanedValue;
			updatePreview();
			selectPaymentOption(index);
		}
	});

}


function setupRemoveField() {
	var buttons = document.querySelectorAll('.deleteFieldButton');

	buttons.forEach(button => {
		var clicks = 0;
		var timer = null;

		button.addEventListener('click', function (event) {
			var fieldId = this.getAttribute('data-fieldId');
			clicks++;

			if (clicks === 1) {
				timer = setTimeout(function () {
					clicks = 0;
				}, 300);
			} else if (clicks === 2) {
				clearTimeout(timer);
				clicks = 0;

				fields = fields.filter(field => field.fieldId !== fieldId);

				setTimeout(() => {
					updatePreview();
				}, 400);

				console.log('Button double clicked!');
			}

			event.preventDefault();
		});
	});
}

// Run the setup function after updating the DOM
setupRemoveField();

function addOption(fieldId) {

	const field = fields.find(field => field.fieldId === fieldId);

	if (field.fieldType === 'dropdown') {
		const optionsString = prompt("Enter all options with each option separated by a comma.", field.options.join(","));
		let allOptions = optionsString.split(",");
		allOptions.forEach(option => {
			option = option.trim();
		});
		field.options = allOptions;
	} else {
		const option = prompt("Enter a new option:");
		if (field.fieldType === 'radioGroup') {
			// Ensure all radio buttons in this group have the same name
			field.options.push({
				label: option.trim(),
				name: field.fieldId
			});
		} else {
			field.options.push(option.trim());
		}
	}

	updatePreview();
}

function moveField(fieldId, direction) {
	const index = fields.findIndex(field => field.fieldId === fieldId);
	if ((index === 0 && direction === -1) || (index === fields.length - 1 && direction === 1)) {
		return;
	}
	const temp = fields[index];
	fields[index] = fields[index + direction];
	fields[index].position = index;
	fields[index + direction] = temp;
	fields[index + direction].position = index + direction;
	updatePreview();
}

function requireField(fieldId) {
	let field = fields.find(field => field.fieldId === fieldId);
	if (field.isRequired == false) {
		field["isRequired"] = true;
	} else {
		field["isRequired"] = false;
	}
	updatePreview();
}

function removeOption(fieldId, index) {
	const field = fields.find(field => field.fieldId === fieldId);
	field.options.splice(index, 1);
	updatePreview();
}

function moveOption(fieldId, index, direction) {
	const field = fields.find(field => field.fieldId === fieldId);
	const option = field.options[index];

	if ((index === 0 && direction === -1) || (index === field.options.length - 1 && direction === 1)) {
		return;
	}

	field.options[index] = field.options[index + direction];
	field.options[index + direction] = option;
	updatePreview();
}

function updatePreview() {
	const formPreview = document.getElementById("formPreview");
	formPreview.innerHTML = "";

	fields.forEach((field, index) => {
		let fieldElement = "";
		let actions = `
<div class="action-buttons sleek-entrance">
<button id="moveFieldUpButton-${field.fieldId}" class="action-button-item sleek-entrance tooltip" onclick="moveField('${field.fieldId}', -1)" title="Move Field Up">&#8593;</button>
<button id="moveFieldDownButton-${field.fieldId}" class="action-button-item sleek-entrance tooltip" onclick="moveField('${field.fieldId}', 1)" title="Move Field Down">&#8595</button>`;
		if (!["title", "heading", "paragraph", "divider"].includes(field.fieldType)) {
			actions += `<button id="requireFieldButton" class="action-button-item sleek-entrance tooltip" onclick="requireField('${field.fieldId}')" title="Require/Unrequire">*</button>`;
		}
		actions += `<button id="deleteFieldButton" data-fieldId="${field.fieldId}" style="background-color: red;" class="action-button-item sleek-entrance tooltip deleteFieldButton"><span class="tooltip">&times;</span></button>
</div>
`;

		// Make all labels or text content editable, including title, heading, and paragraph.
		const editableContent = ["title", "heading", "paragraph"].includes(field.fieldType) ? "" : `<label class="sleek-entrance"><span class="editable-content sleek-entrance" contenteditable="true" oninput="updateContent('${field.fieldId}', this.innerHTML)">${field.label || field.content}</span></label>${field.isRequired ? "<span class='asterisk'>*</span>" : ""}`;


		switch (field.fieldType) {
			case 'title':
				fieldElement = `<h1 class="sleek-entrance" contenteditable="true" oninput="updatePlaceholder('${field.fieldId}', this.value)" onblur="updateField(${index}, 'label', this.innerHTML)">${field.label}</h1>`;
				break;
			case 'heading':
				fieldElement = `<h2 class="sleek-entrance" contenteditable="true" oninput="updatePlaceholder('${field.fieldId}', this.value)" onblur="updateField(${index}, 'label', this.innerHTML)">${field.label}</h2>`;
				break;
			case 'paragraph':
				fieldElement = `<p class="sleek-entrance" contenteditable="true" oninput="updatePlaceholder('${field.fieldId}', this.value)" onblur="updateField(${index}, 'label', this.innerHTML)">${field.label}</p>`;
				break;
			case 'divider':
				fieldElement = `<hr class="sleek-entrance">`;
				break;
			case 'shortText':
				fieldElement = `<input class="sleek-entrance" type="text" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder || ''}" name="${field.label}" oninput="updatePlaceholder('${field.fieldId}', this.value)"/>`;
				break;
			case 'longText':
				fieldElement = `<textarea name="${field.label}" class="sleek-entrance" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder || ''}" oninput="updatePlaceholder('${field.fieldId}', this.value)"></textarea>`;
				break;
			case 'phone':
				fieldElement = `<input name="${field.label}" class="sleek-entrance" type="tel" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder || ''}" inputmode="numeric" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" oninput="updatePlaceholder('${field.fieldId}', this.value)" />`;
				break;
			case 'email':
				fieldElement = `<input name="${field.label}" class="sleek-entrance" type="email" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder || ''}" oninput="updatePlaceholder('${field.fieldId}', this.value)" />`;
				break;
			case 'number':
				fieldElement = `<input name="${field.label}" class="sleek-entrance" type="number" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder || ''}" oninput="updatePlaceholder('${field.fieldId}', this.value)" />`;
				break;
			case 'fileUpload':
				fieldElement = `<div class="upload-container">
<p><span style=\'font-size: small; color: darkgrey;\'>First click the <b>Choose File</b> button, select your file to upload. Make sure you see the phrase \'<b>Upload Successful</b>\' before continuing.</span></p>
    <input type="file" id="uploader_${field.fieldId}" onchange="uploadFile('${field.fieldId}')" >
    <input type="hidden" id="fileUrl_${field.fieldId}" name="${field.label}" ${field.isRequired ? "required" : ""}>
    <div id="uploading_${field.fieldId}" style="display: none;"><img src="https://iili.io/JCCz287.gif" border="0" style="width: 40%; display:block; align-self: center; margin: 0 auto;">Uploading... Please wait a moment.</div>
    <div id="error_${field.fieldId}" style="display: none;">Oh no! An error occurred. Would you mind trying again?</div>
    <div id="success_${field.fieldId}" style="display: none;">Upload Successful!</div>
		<div class="file-preview" id="preview_${field.fieldId}"></div>
  </div>`;
				break;
			case 'currency':
				fieldElement = `<input name="${field.label}" class="sleek-entrance" type="text" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder}" pattern="^\d*(\.\d{0,2})?$" oninput="updatePlaceholder('${field.fieldId}', this.value)" />`;
				break;
			case 'dateWithoutTime':
				fieldElement = `<input name="${field.label}" class="sleek-entrance" type="date" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder}" />`;
				break;
			case 'dateWithTime':
				fieldElement = `<input name="${field.label}" class="sleek-entrance" type="datetime-local" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder}" />`;
				break;
			case 'dropdown':
				fieldElement = `<select name="${field.label}" class="sleek-entrance" ${field.isRequired ? "required" : ""} name="${field.label}">`;
				fieldElement += `<label for="${field.label}">${field.label}</label>`
				fieldElement += `<option value="">Choose an option...</option>`;
				field.options.forEach((option, i) => {
					fieldElement += `<option value="${option}">${option}</option>`;
				});
				fieldElement += `</select>`;
				actions += `<button class="add-option" onclick="addOption('${field.fieldId}')">Edit Options</button>`;
				break;
			case 'time':
				fieldElement = `<input class="sleek-entrance" type="time" ${field.isRequired ? "required" : ""} placeholder="${field.label}" name="${field.label}" />`;
				break;
			case 'checkboxGroup':
				field.options.forEach((option, i) => {
					const inputType = field.fieldType === 'checkboxGroup' ? 'checkbox' : 'radio';
					fieldElement += `
    <div class="checkbox-group">
      <input type="${inputType}" name="${field.label} - ${option}" value="✅" ${field.isRequired ? "required" : ""} id="${field.fieldId}-${i}" />
      <label for="${field.fieldId}-${i}">${option}</label>
<div class="nested-buttons">
      <button onclick="removeOption('${field.fieldId}', ${i})">×</button>
      <button onclick="moveOption('${field.fieldId}', ${i}, -1)">↑</button>
      <button onclick="moveOption('${field.fieldId}', ${i}, 1)">↓</button>
    </div>
</div>
  `;
				});
				actions += `<button class="add-option" onclick="addOption('${field.fieldId}')">Add Options Here</button>`;
				break;
			case 'radioGroup':
				field.options.forEach((option, i) => {
					const inputType = field.fieldType === 'checkboxGroup' ? 'checkbox' : 'radio';
					fieldElement += `
<div class="radio-group">    
      <input type="${inputType}" name="${field.label}" id="${option.label}" value="${option.label}" />
      <label for="${option.label}">${option.label}</label>
<div class="nested-buttons">
      <button onclick="removeOption('${field.fieldId}', ${i})">×</button>
      <button onclick="moveOption('${field.fieldId}', ${i}, -1)">↑</button>
      <button onclick="moveOption('${field.fieldId}', ${i}, 1)">↓</button>
    </div>
</div>
  `;
				});
				actions += `<button class="add-option" onclick="addOption('${field.fieldId}')">Add Options Here</button>`;
				break;
			case 'multiDate':
				fieldElement = `<br><br>
					<div id="multidate-${field.fieldId}" class="sleek-entrance">
			<div class="input-container f${field.fieldId}">
				<!-- Date entries will be added here -->
			</div>
			
			<button type="button" class="multi-date-add-more-times-button" id="addDate-${field.fieldId}" onclick="addDateInput('${field.fieldId}')"> + Add Dates & Times</button>
			<div id="userDateOutput-${field.fieldId}" class="user-date-output f${field.fieldId}"></div>
		</div>
		<br>
		<br>
		<br>
		<textarea hidden name="${field.label}" ${field.isRequired ? "required" : ""} style="width: 100%; height: 200px;" id="aggregatedDates-${field.fieldId}"></textarea>`;

				break;
			case 'multiTime':
				fieldElement = `<input name="${field.label}" type="time" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder}" /><button>Add More</button>`;
				break;
			case 'payment':

				fieldElement = `<div id="payment-container""><br>`;

				field.options.sort((a, b) => b.amount - a.amount).forEach((option, index) => {

					let amount = `$${(Number.parseFloat(Number.parseFloat(field.options[index].amount).toFixed(2))).toLocaleString("en-US", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
					let todayWords = new Date(Date.now() + 0).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })
					let today = new Date();
					let installments = option.installments || 0;

					let endDate = (function () {
						if (option.frequency === "week") {
							return new Date(today.setDate(today.getDate() + (installments * 7 - 1))).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })
						}
						else if (option.frequency === "month") {
							return new Date(today.setMonth(today.getMonth() + installments - 1)).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })
						}
						else if (option.frequency === "year") {
							return new Date(today.setFullYear(today.getFullYear() + installments - 1)).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })
						}
						else if (option.frequency === "day") {
							return new Date(today.setDate(today.getDate() + installments - 1)).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })
						}
						else {
							return null;
						}
					})();

					let thePaymentMessage = `<br>Pay <b>${amount} now (${todayWords})</b>, and your card will be auto-charged <b>${amount} each ${option.frequency}</b> until <b>${endDate}</b>.`;
					if (!installments || !option?.frequency) {
						thePaymentMessage = `<br>Pay ${amount} now in full.`;
					}

					fieldElement += `
					<div id="payment-option-index-${index}" class="payment-plan-container" onclick="selectPaymentOption(${index})">
						<table border-collapse="collapse" align="center" style="text-align: center;">
  							<tr>
								<td colspan=2 class="label" style="border-top-right-radius: 10px; border-top-left-radius: 10px; font-weight: bold;">
									${option.productName.trim()}
								</td>
							</tr>
							<tr>  
							<td class="value" colspan=2 style="font-size: small; font-style: italic;">
								${option.productDescription.trim()}
							</td>
							</tr>
							<tr>
							<td class="value" colspan=2 style="border-bottom-right-radius: 10px; border-bottom-left-radius: 10px;">
								<b>
								${amount}
								${option?.frequency && !option?.frequency.includes("one") && !option?.frequency.includes("once") && ['week', 'month', 'year', 'day'].includes(option?.frequency?.trim()) ? "/ " + option?.frequency : "One-Time"}
								</b>
								
								${option.installments > 1 && "<br>" + option.installments + " Installments" || ""}
								
								<div style="font-size: smaller">${thePaymentMessage}</div>
							</td>
							</tr>
						</table>
					</div>
				
`;
				})

				fieldElement += `</div>



<input type="hidden" id="payment-status" name="Payment Status" value="NOT PAID">
<input type="hidden" id="payment-amount" name="Payment Amount" value="$${(Number.parseFloat(Number.parseFloat(field.options[0].amount).toFixed(2))).toLocaleString("en-US", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}">
<textarea style="display: none" ${field.isRequired ? "required" : ""} id="selected-payment-option" name="Payment Option Selected" value=""></textarea>
<br>
<button onclick="handleSubmit()" id="pay-button" style="cursor: pointer; text-align: center; height: 50px; border: 0; border-radius: 15px; font-weight: bolder; color: white; font-size: large; background: linear-gradient(-5deg, #009e60, #009e6080); width: 100%;">FINISH & PAY &rarr;</button>
<div style="display: flex; flex-direction: row; align-items: center; align-content: center; justify-items: center; justify-content: center;">
<img class="card" src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/VISA@2x.png">
<img class="card" src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/MASTERCARD@2x.png">
<img class="card" src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/AMEX@2x.png">
<img class="card" src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/DISCOVER@2x.png">
<img class="card" src="https://cdn.freebiesupply.com/logos/large/2x/apple-pay-payment-mark-logo-black-and-white.png">
<img class="card" style="max-width: 43px;" src="https://lh3.googleusercontent.com/YD4iH-kP9NPKvJ5_4zJ86mCE2tX-7kIPgYmgMBKEX2Vm7tzOIShpUIerJNxbcfWTlCpoveuyYhHt0D4D5g_d7_5OKREsB2bkqvPGgw=s0"><br>
</div><br>
<p style="text-align: center;" id="selectedPaymentMessage"></p>
</div>
<style>
submit-button {
display: none !important;
}
</style>
`;
				actions += `
	
	<div class="add-product-section payment-option-buttons" style="opacity: 1; width: 100%; display: flex;">
		<button style="width: 50%; background-color: teal; color: white;" href="#" onclick="addProduct(event, '${field.fieldId}')">+ Add Product Option</span></button>
		<button style="width: 50%; background-color: #cc1331; color: white;" href="#" onclick="deleteProduct(event, '${field.fieldId}')">× Delete Selected Product</span></button>
	</div>
	

    <div class="payment-option-buttons" style="opacity: 1;">
	
      <button href="#" onclick="editProductName(event, '${field.fieldId}')">Edit Product Name<br><span id="selectedPaymentTitle" style="font-size: smaller; font-style: italic; font-weight: lighter;">${getSelectedPaymentOption().productName}</span></button>
      <button href="#" onclick="editProductDescription(event, '${field.fieldId}')">Edit Product Description<br><span id="selectedPaymentDescription" style="font-size: smaller; font-style: italic; font-weight: lighter;">${getSelectedPaymentOption().productDescription}</span></button>
      <button href="#" onclick="editPrice(event, '${field.fieldId}')">Edit Price<br><span id="selectedPaymentPrice" style="font-size: smaller; font-style: italic; font-weight: lighter;">$${getSelectedPaymentOption().amount}</span></button>
	  <button href="#" onclick="editPaymentPlan(event, '${field.fieldId}')">Edit Payment Plan<br><span id="selectedPaymentPlan" style="font-size: smaller; font-style: italic; font-weight: lighter;">${getSelectedPaymentOption()?.frequency || "One-Time"}</span></button>
	  <button href="#" onclick="editInstallments(event, '${field.fieldId}')">Edit Installment Count<br><span id="selectedPaymentInstallments" style="font-size: smaller; font-style: italic; font-weight: lighter;">${getSelectedPaymentOption()?.installments || ""}</span></button>
    </div>
  `;
				break;
		}


		formPreview.innerHTML += `
<div class="sleek-entrance" id="${field.fieldId}">
${editableContent}
${fieldElement}
${actions}
</div>
`;

	});

	setTimeout(() => {
		document.querySelectorAll('.sleek-entrance').forEach(elem => {
			elem.classList.add('visible');
		});
	}, 0);

	formPreview.innerHTML += `
<button style="display: none;" id="submit-button" onclick="handleSubmit()">Submit</button>
`;
	setupRemoveField();
	handlePhoneInputs();
	console.log(fields);
	disableMoveButtonsOnEnds();
	// selectPaymentOption(0);
}

function updatePlaceholder(fieldId, newPlaceholder) {
	const field = fields.find(f => f.fieldId === fieldId);
	if (field) {
		field.placeholder = newPlaceholder;
	}
}

function updateContent(fieldId, newContent) {
	const field = fields.find(f => f.fieldId === fieldId);
	if (field) {
		if (['title', 'heading', 'paragraph'].includes(field.fieldType)) {
			field.content = newContent;
		} else {
			field.label = newContent;
		}
	}
}

function updateField(index, attribute, value) {
	fields[index][attribute] = value;
	// Optionally: Regenerate JSON and/or update UI here
}

function updateLabel(fieldId, newLabel) {
	const field = fields.find(f => f.fieldId === fieldId);
	field.label = newLabel;
}

function createForm() {
	// Sort fields based on position property before generating JSON
	fields.sort((a, b) => a.position - b.position);
	const formTemplateJSON = JSON.stringify(fields);

	// Send the formTemplateJSON to the parent window or save it
	window.parent.postMessage({
		formTemplate: formTemplateJSON
	}, '*');
	console.log(formTemplateJSON)
}


// Select all buttons on the page
const buttons = document.querySelectorAll("button");

// Loop through all buttons and attach click event listener
buttons.forEach((button) => {
	button.addEventListener("click", function () {
		// Add the animation class
		this.classList.add("button-clicked");

		// Remove the class after the animation duration (300ms in this example)
		setTimeout(() => {
			this.classList.remove("button-clicked");
		}, 300);
	});
});


//scripts for file upload

const getFileExtension = (file) => {
	if (!file) return null;
	const extension = file.split(".")[file.split(".").length - 1];
	console.log(extension)
	return extension;
}

const uploadFile = async (fieldId) => {
	try {
		let fileInput = document.getElementById("uploader_" + fieldId);

		let files = fileInput.files;
		if (files.length === 0) {
			alert("Please select a file to upload.");
			return;
		}

		document.getElementById("uploading_" + String(fieldId)).style.display = "block";

		let fileToUpload = files[0];

		if (getFileExtension(files[0].name).toLowerCase() === "heic") {
			console.log("Converting HEIC to JPEG");
			try {
				fileToUpload = await convertHeicToJpeg(files[0], 0.6); // You can adjust the quality here
			} catch (error) {
				console.error("Error converting HEIC to JPEG:", error);
				document.getElementById("error_" + String(fieldId)).style.display = "block";
				document.getElementById("uploading_" + String(fieldId)).style.display = "none";
				return;
			}
		}

		// Step 1: Get the best server
		const server = await getBestServer();
		// Step 2: Upload the file to the server
		const uploadResponse = await uploadFileToServer(server, fileToUpload);
		console.log("Upload Response:", uploadResponse); // Logging upload response

		// Step 3: Enable CDN access using fileId as contentId
		const cdnAccessResponse = await setCDNAccess(uploadResponse.id);
		console.log("CDN Access Response:", cdnAccessResponse); // Logging CDN access response

		// Send the postMessage to the parent window with CDN access response
		window.parent.postMessage({
			type: 'file-upload',
			fileData: cdnAccessResponse,
			contentId: uploadResponse.id
		}, '*'); // Replace '*' with your domain for security

		fileUrl = cdnAccessResponse.directLink;
		const fileType = fileUrl?.split(".")?.[fileUrl?.split(".").length - 1];

		console.log("File URL:", encodeURI(fileUrl)); // Logging file URL

		// Handle images
		if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'tif'].includes(fileType)) {
			document.getElementById("preview_" + String(fieldId)).innerHTML = `<img src="${fileUrl}">`;
		}
		if (['mov', 'mp4', 'webm', 'm4v'].includes(fileType)) {
			document.getElementById("preview_" + String(fieldId)).innerHTML = `<video controls src="${fileUrl}">`;
		}
		if (['mp3', 'wav', 'm4a', 'caf', 'mpeg'].includes(fileType)) {
			document.getElementById("preview_" + String(fieldId)).innerHTML = `<audio controls src="${fileUrl}"></audio>`;
		}
		if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'csv', 'xls', 'xlsx'].includes(fileType)) {
			document.getElementById("preview_" + String(fieldId)).innerHTML = `<embed src="https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(fileUrl)}" width="100%">`
		}
		document.getElementById("uploading_" + String(fieldId)).style.display = "none";
		document.getElementById("success_" + String(fieldId)).style.display = "block";
	} catch (error) {
		console.error(error)
		document.getElementById("error_" + String(fieldId)).style.display = "block";
		document.getElementById("uploading_" + String(fieldId)).style.display = "none";
	}
}

async function getBestServer() {
	const response = await fetch('https://api.gofile.io/servers?zone=na');
	const data = await response.json();
	console.log("Best Server:", data); // Logging server response
	if (data.status === 'ok') {
		return data.data.servers[0].name;
	} else {
		throw new Error('Failed to get the best server');
	}
}

async function uploadFileToServer(server, file) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('token', 'Sj3WyTQQbyScaUddzzi2fBO3uWyrpV2S'); // Adding token to formData
	formData.append("folderId", "4aa1aeeb-f13a-415c-85f8-427442868137");

	const response = await fetch(`https://${server}.gofile.io/uploadfile`, {
		method: 'POST',
		body: formData,
	});
	const data = await response.json();
	if (data.status === 'ok') {
		console.log(data.data)
		return data.data;
	} else {
		throw new Error('Failed to upload file');
	}
}

async function setCDNAccess(contentId) {
	const response = await fetch(`https://api.gofile.io/contents/${contentId}/directLinks`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer Sj3WyTQQbyScaUddzzi2fBO3uWyrpV2S'
		},
		body: JSON.stringify({
			contentId: contentId,
			token: 'Sj3WyTQQbyScaUddzzi2fBO3uWyrpV2S',
			// option: 'directLink',
			// value: 'true',
		}),
	});
	const data = await response.json();
	if (data.status === 'ok') {
		console.log(data.data)
		return data.data;
	} else {
		throw new Error('Failed to set CDN access');
	}
}

async function convertHeicToJpeg(heicFile, quality = 0.6) {
	const { HeifDecoder } = await window.libheif();

	const readFile = (file) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => resolve(new Uint8Array(e.target.result));
		reader.onerror = (error) => reject(error);
		reader.readAsArrayBuffer(file);
	});

	const displayFile = async (buffer) => {
		const decoder = new HeifDecoder();
		const data = decoder.decode(buffer);
		const image = data[0];
		const width = image.get_width();
		const height = image.get_height();

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const context = canvas.getContext("2d");
		const imageData = context.createImageData(width, height);
		await new Promise((resolve, reject) => {
			image.display(imageData, (displayData) => {
				if (!displayData) {
					return reject(new Error("HEIF processing error"));
				}
				resolve();
			});
		});

		context.putImageData(imageData, 0, 0);
		return canvas;
	};

	const getCanvasImageBlob = (canvas, quality) => new Promise((resolve, reject) => {
		canvas.toBlob(blob => {
			if (blob) {
				return resolve(blob);
			}
			return reject(new Error('Failed to convert the image'));
		}, 'image/jpeg', quality);
	});

	try {
		const buffer = await readFile(heicFile);
		console.time("Conversion time");
		const canvas = await displayFile(buffer);
		const blob = await getCanvasImageBlob(canvas, quality);
		console.timeEnd("Conversion time");
		return new File([blob], heicFile.name.replace('.heic', '.jpg'), { type: 'image/jpeg' });
	} catch (error) {
		console.error("Failed to convert image:", error);
		throw error;
	}
}


function handlePhoneInputs() {

	var phoneInputs = document.querySelectorAll('input[type="tel"]');
	phoneInputs.forEach(phoneInput => {
		phoneInput.addEventListener('input', function (e) {
			var x = e.target.value;
			if (x[0] == "1") {
				x = x.slice(1)
			}
			x = x.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
			e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
		});
	});

}

function disableMoveButtonsOnEnds() {

	if (fields && fields.length > 0) {

		const firstField = fields[0];
		const lastField = fields[fields.length - 1];

		document.getElementById(`moveFieldDownButton-${lastField.fieldId}`).style.display = "none";

		document.getElementById(`moveFieldUpButton-${firstField.fieldId}`).style.display = "none";
	}
}

function validateForm() {
	const requiredFields = form.querySelectorAll('[required]');
	let isFormValid = true;

	requiredFields.forEach(field => {
		if (field.value.trim() === '') {
			isFormValid = false;
		}
	});

	return isFormValid;
}

function handleSubmit() {
	// Prevent the default form submission
	event.preventDefault();
	console.log("Submit button clicked");

	// Assuming your form has an ID 'formPreview'
	var form = document.getElementById('formPreview');

	// Collect form data
	let formData = {};
	new FormData(form).forEach((value, key) => formData[key] = value);

	// Log and post the message
	console.log(JSON.stringify(formData));

	if (validateForm() == true) {
		window.parent.postMessage({ type: "form_submit", data: formData }, '*');
		console.log("Form Submit Successful!");
	} else {
		alert("One or more required fields haven't been filled out yet.");
	}

}

// This function finds all elements with the contenteditable="true" attribute and removes the attribute
function removeContentEditable() {
	// Find all elements with the contenteditable attribute set to true
	var editableElements = document.querySelectorAll('[contenteditable="true"]');

	// Iterate over each element and remove the contenteditable attribute
	for (var i = 0; i < editableElements.length; i++) {
		editableElements[i].removeAttribute('contenteditable');
	}
}



function togglePreviewMode(admin = false) {

	const actionButtons = document.querySelectorAll(".action-buttons");
	const nestedButtons = document.querySelectorAll(".nested-buttons");
	const submitButton = document.getElementById("submit-button");
	const adminPanel = document.getElementById("adminPanel");
	const bottomPanel = document.getElementById("bottom-panel");
	const formPreview = document.getElementById("formPreview");
	const paymentButtons = document.querySelectorAll(".payment-option-buttons");
	const optionButtons = document.querySelectorAll(".add-option");

	removeContentEditable();
	if (fields.map(field => field.fieldType).includes("payment")) {
		submitButton.style.display = "none";
	} else {
		submitButton.style.display = "block";
	}

	adminPanel.style.display = "none";
	bottomPanel.style.display = "none";
	formPreview.style.marginTop = "0";


	nestedButtons.forEach(button => {
		button.style.display = "none";
	});

	actionButtons.forEach(button => {
		button.style.display = "none";
	});

	paymentButtons.forEach(element => {
		element.style.display = "none";
	});

	optionButtons.forEach(element => {
		element.style.display = "none";
	});

	let cssAdjustments = document.createElement("style");

	cssAdjustments.innerHTML = `div.sleek-entrance.visible:hover {background: transparent;}`;
	cssAdjustments.setAttribute("id", "cssAdjustments");
	document.body.appendChild(cssAdjustments);

	if (admin == true) {
		let escapeBanner = document.createElement("div");
		escapeBanner.innerHTML = `<a id="exitPreview" onclick="updatePreview()" style="background-color: #0a2342; cursor: pointer; position: fixed; width: 100%; top: 0; color: white; text-decoration: none; font-weight: bold; padding: 15px; text-align: center;">YOU ARE IN PREVIEW MODE — CLICK HERE TO EXIT.</a>`;
		document.body.appendChild(escapeBanner);
		formPreview.style.marginTop = "40px";

		escapeBanner.addEventListener('click', () => {
			submitButton.style.display = "none";
			adminPanel.style.display = "";
			bottomPanel.style.display = "";
			formPreview.style.marginTop = "";
			nestedButtons.forEach(button => {
				button.style.display = "";
			});
			actionButtons.forEach(button => {
				button.style.display = "";
			});

			paymentButtons.forEach(element => {
				element.style.display = "";
			});

			optionButtons.forEach(element => {
				element.style.display = "";
			});

			document.getElementById("cssAdjustments").innerHTML = "";

		});
	}
}

// Functions for Multi-Date Widget
function formatDateWithDay(dateString) {
	var date = new Date(toUTC(dateString, "00:00"));
	if (!isNaN(date.getTime())) {
		// Options to include day of the week in the format
		var options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: "America/New_York"
		};
		return date.toLocaleString('en-US', options);
	}
	return dateString;
}

function convertToStandardFormat(longFormDateString) {
	return moment(longFormDateString, "dddd, MMMM D, YYYY").format('YYYY-MM-DD');
}

function toUTC(dateInput, timeInput) {
	// Combine date and time in 'YYYY-MM-DD HH:mm' format
	var dateTimeString = dateInput + ' ' + timeInput;

	// Create a moment object with the specified time in Eastern Time
	var momentET = moment.tz(dateTimeString, "YYYY-MM-DD HH:mm", "America/New_York");

	// Convert the moment object to UTC
	return momentET.utc().format();
}


function updateAggregatedDates(fieldId) {
	var dateEntries = document.querySelectorAll(`.date-entry.f${fieldId}`);
	var dateArray = [];

	dateEntries.forEach(function (entry) {
		var dateInput = entry.querySelector('.dateInput').value;
		var startTime = entry.querySelector('.startTime').value;
		var endTime = entry.querySelector('.endTime').value;
		var allDay = entry.querySelector('.allDay').checked;

		console.log("Date Input:", dateInput); // Debug
		console.log("Start Time:", startTime); // Debug
		console.log("End Time:", endTime); // Debug
		console.log("All Day:", allDay); // Debug

		if (dateInput) {
			var standardDate = convertToStandardFormat(dateInput);
			var startTimeFormatted = allDay ? '00:00' : startTime || "00:00";
			var endTimeFormatted = allDay ? '23:59' : endTime || "23:59";

			var startDateTimeUTC = toUTC(standardDate, startTimeFormatted);
			var endDateTimeUTC = toUTC(standardDate, endTimeFormatted);

			dateArray.push({
				startDateTime: startDateTimeUTC,
				endDateTime: endDateTimeUTC
			});

			dateArray = dateArray.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
		}
	});

	console.log("Date Array:", dateArray); // Final array debug
	document.getElementById(`aggregatedDates-${fieldId}`).value = JSON.stringify(dateArray, null, 2);
	var userOutput = `<b>You have selected the following dates:</b><br><br><table class="multi-date-output-table" style="text-align: left;">` + dateArray.map((date, index) => `<tr><td>${index + 1}.</td><td style="font-weight: bold;">${new Date(date.startDateTime).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" })}</td><td style="font-style: italic;">${new Date(date.startDateTime).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" }) + " to " + new Date(date.endDateTime).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" }) == "12:00 AM to 11:59 PM" ? "All Day" : new Date(date.startDateTime).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" }) + " to " + new Date(date.endDateTime).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" })}</td>`).join(`</tr>`) + `</table>`;
	var userDateOutput = document.getElementById(`userDateOutput-${fieldId}`);
	userDateOutput.innerHTML = userOutput;
}


function addDateInput(fieldId) {
	var container = document.querySelector(`.input-container.f${fieldId}`);
	var dateEntryDiv = document.createElement('div');
	dateEntryDiv.classList.add("date-entry");
	dateEntryDiv.classList.add(`f${fieldId}`);
	dateEntryDiv.setAttribute("id", `dateEntryDiv-${fieldId}`);

	//	dateEntryDiv.className = `date-entry f${fieldId}`;

	var dateInput = document.createElement('input');
	dateInput.type = 'text';
	dateInput.className = 'dateInput';
	dateInput.placeholder = 'Select a date';
	dateInput.setAttribute('oninput', `updateAggregatedDates("${fieldId}")`);
	dateInput.setAttribute('onchange', `updateAggregatedDates("${fieldId}")`);

	var datePicker = new Pikaday({
		field: dateInput,
		format: 'YYYY-MM-DD',
		onSelect: function () {
			if (this.getMoment()) {
				dateInput.value = formatDateWithDay(this.getMoment().format('YYYY-MM-DD'));
				updateAggregatedDates(fieldId);
			}
		}
	});

	var dateTimes = document.createElement('div');
	dateTimes.setAttribute("id", `dateTimes-${fieldId}`);

	var timeInputs = document.createElement('div');
	timeInputs.setAttribute("id", `timeInputs-${fieldId}`);

	var startTimeLabel = document.createElement('label');
	startTimeLabel.className = 'startTimeLabel';
	startTimeLabel.innerHTML = `Start Time`;
	var startTime = document.createElement('input');
	startTime.type = 'time';
	startTime.className = 'startTime';
	startTime.setAttribute("value", '00:00');
	startTime.setAttribute("onchange", `updateAggregatedDates("${fieldId}")`);

	var endTimeLabel = document.createElement('label');
	endTimeLabel.className = 'endTimeLabel';
	endTimeLabel.innerHTML = `End Time`;
	var endTime = document.createElement('input');
	endTime.type = 'time';
	endTime.className = 'endTime';
	endTime.setAttribute("value", '23:59');
	endTime.setAttribute("onchange", `updateAggregatedDates("${fieldId}")`);


	var checkboxLabel = document.createElement('label');
	checkboxLabel.classList.add("checkbox-label");
	checkboxLabel.innerHTML = `<span>All Day <span style="font-weight: normal;">(Uncheck For Specific Time)</span></span>`;
	var allDayCheckbox = document.createElement('input');
	allDayCheckbox.setAttribute("checked", "");
	allDayCheckbox.type = 'checkbox';
	allDayCheckbox.className = 'allDay';
	allDayCheckbox.setAttribute("onchange", `updateAggregatedDates("${fieldId}")`);

	startTime.disabled = endTime.disabled = allDayCheckbox.checked;
	startTime.style.display = startTime.disabled ? "none" : "block";
	endTime.style.display = startTime.disabled ? "none" : "block";
	startTimeLabel.style.display = startTime.disabled ? "none" : "block";
	endTimeLabel.style.display = startTime.disabled ? "none" : "block";


	allDayCheckbox.onchange = function () {
		startTime.disabled = endTime.disabled = allDayCheckbox.checked;
		startTime.style.display = startTime.disabled ? "none" : "block";
		endTime.style.display = startTime.disabled ? "none" : "block";
		startTimeLabel.style.display = startTime.disabled ? "none" : "block";
		endTimeLabel.style.display = startTime.disabled ? "none" : "block";

	};


	var removeButtonDiv = document.createElement('div');
	removeButtonDiv.className = "multi-date-remove-button-container";
	var removeButton = document.createElement('button');
	removeButton.type = 'button';
	removeButton.className = "multi-date-remove-button";
	removeButton.textContent = 'Remove';
	//	removeButton.onclick = function () {
	//		dateEntryDiv.remove();
	//		updateAggregatedDates(fieldId);
	//	};
	removeButton.setAttribute("onclick", `document.getElementById("dateEntryDiv-${fieldId}").remove(); updateAggregatedDates("${fieldId}")`);
	removeButtonDiv.appendChild(removeButton);

	dateEntryDiv.appendChild(dateInput);
	checkboxLabel.appendChild(allDayCheckbox);
	dateTimes.appendChild(checkboxLabel);
	timeInputs.appendChild(startTimeLabel);
	timeInputs.appendChild(startTime);
	timeInputs.appendChild(endTimeLabel);
	timeInputs.appendChild(endTime);
	dateEntryDiv.appendChild(dateTimes);
	dateEntryDiv.appendChild(timeInputs);

	dateEntryDiv.appendChild(removeButtonDiv);
	container.appendChild(dateEntryDiv);

	//	dateInput.addEventListener('change', updateAggregatedDates);
	//	startTime.addEventListener('change', updateAggregatedDates);
	//	endTime.addEventListener('change', updateAggregatedDates);
	//	allDayCheckbox.addEventListener('change', updateAggregatedDates);
}

//document.getElementById('addDate').addEventListener('click', addDateInput);

// Initial date entry setup
//addDateInput();

function getSelectedPaymentOption() {
	let index = 0;
	if (document.querySelector(".selected")) {
		index = document.querySelector(".selected").id.split("-")[document.querySelector(".selected").id.split("-").length - 1] || 0;
	}

	const paymentOptions = fields.find(field => field.fieldType === "payment").options.sort((a, b) => b.amount - a.amount);
	return paymentOptions[index] || paymentOptions[0];
}

function selectPaymentOption(index = 0) {

	const paymentOptions = fields.find(field => field.fieldType === "payment").options.sort((a, b) => b.amount - a.amount);
	const selectedOption = paymentOptions[index];
	const selectedAmount = (Number.parseFloat(Number.parseFloat(selectedOption.amount).toFixed(2))).toLocaleString("en-US", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })
	document.getElementById("selected-payment-option").value = JSON.stringify(selectedOption);
	document.querySelectorAll(".payment-plan-container").forEach(element => {
		element.classList.remove("selected");
	})
	document.getElementById(`payment-option-index-${index}`).classList.add("selected");

	document.getElementById("selectedPaymentMessage").innerHTML = `Click FINISH & PAY to finalize payment for <b>$${(!selectedOption?.installments || !selectedOption.frequency) ? selectedAmount : selectedAmount + "/" + selectedOption.frequency + "</b> (" + selectedOption.installments + " total installments)"}.`;
	document.getElementById("selectedPaymentPrice").textContent = `($${selectedAmount})`;
	document.getElementById("selectedPaymentDescription").textContent = `(${selectedOption?.productDescription})`;
	document.getElementById("selectedPaymentTitle").textContent = `(${selectedOption?.productName})`;
	document.getElementById("selectedPaymentPlan").textContent = `(${!selectedOption?.frequency ? "One-Time" : selectedOption?.frequency === "day" ? "daily" : selectedOption?.frequency + "ly"})`;
	document.getElementById("selectedPaymentInstallments").textContent = `(${!selectedOption?.installments ? "None" : selectedOption?.installments})`;

	return index;

}


function customPrompt(question, defaultValue = '') {
	return new Promise((resolve) => {
		// Create modal elements
		const modal = document.createElement('div');
		const modalContent = document.createElement('div');
		const questionText = document.createElement('p');
		const inputField = document.createElement('input');
		inputField.setAttribute("id", "inputField");
		const okButton = document.createElement('button');
		okButton.setAttribute("id", "okButton");
		const cancelButton = document.createElement('button');

		// Set attributes and text
		modal.setAttribute('id', 'customModal');
		modalContent.setAttribute('class', 'modal-content');
		questionText.innerHTML = question;
		inputField.value = defaultValue;
		okButton.textContent = 'OK';
		cancelButton.textContent = 'Cancel';

		// Append elements
		modalContent.appendChild(questionText);
		modalContent.appendChild(inputField);
		modalContent.appendChild(okButton);
		modalContent.appendChild(cancelButton);
		modal.appendChild(modalContent);
		document.body.appendChild(modal);

		// Style the modal (you can move this to an external CSS file)
		modal.style.display = 'block';
		modal.style.position = 'fixed';
		modal.style.zIndex = '1';
		modal.style.left = '0';
		modal.style.top = '0';
		modal.style.width = '100%';
		modal.style.height = '100%';
		modal.style.backgroundColor = 'rgba(0,0,0,0.4)';
		modalContent.style.backgroundColor = '#fefefe';
		modalContent.style.margin = '175px auto';
		modalContent.style.padding = '20px';
		modalContent.style.border = '1px solid #888';
		modalContent.style.width = '80%';
		modalContent.style.borderRadius = '15px';
		modalContent.style.boxShadow = '0px 6px 25px rgba(0,0,0,0.2)';

		document.getElementById("inputField").addEventListener("keyup", function (event) {
			event.preventDefault();
			if (event.keyCode === 13) {
				document.getElementById("okButton").click();
			}
		})

		// Event listeners
		okButton.onclick = () => {
			resolve(inputField.value.trim());
			document.body.removeChild(modal);
		};

		cancelButton.onclick = () => {
			resolve(null);
			document.body.removeChild(modal);
		};
	});
}


