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

function editProductName(fieldId) {
	let field = fields.find(field => field.fieldId === fieldId);
	let name = prompt("Enter Product Name: ", field.options[0].productName);
	if (name) {
		field.options[0].productName = name.trim();
		updatePreview();
	}
}

function editProductDescription(fieldId) {
	let field = fields.find(field => field.fieldId === fieldId);
	let description = prompt("Enter Product Description: ", field.options[0].productDescription);
	if (description) {
		field.options[0].productDescription = description.trim();
		updatePreview();
	}
}

function editPrice(fieldId) {
	let field = fields.find(field => field.fieldId === fieldId);
	let amount = prompt("Enter Price: ", field.options[0].amount);
	if (amount && !isNaN(Number.parseFloat(amount))) {
		field.options[0]["amount"] = Number.parseFloat(Number.parseFloat(amount).toFixed(2));
		updatePreview();
	}
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
<p><span style=\'font-size: small; color: darkgrey;\'>First click the <b>Choose File</b> button, select your file to upload, and then click the green <span style=\'color: #009e60; font-weight: 800;\'>Upload</span> button. Make sure you see the phrase \'<b>Upload Successful</b>\' before continuing.</span></p>
    <input type="file" id="uploader_${field.fieldId}" >
    <button id="submit-btn" onclick="event.preventDefault(); uploadFile('${field.fieldId}');">UPLOAD</button>
    <input type="hidden" id="fileUrl_${field.fieldId}" name="${field.label}" ${field.isRequired ? "required" : ""}>
    <div id="uploading_${field.fieldId}" style="display: none;"><img src="https://iili.io/JCCz287.gif" border="0" style="width: 40%; display:block; align-self: center; margin: 0 auto;">Uploading... Please wait a moment.</div>
    <div id="error_${field.fieldId}" style="display: none;">Oh no! An error occurred. Would you mind trying again?</div>
    <div id="success_${field.fieldId}" style="display: none;">Upload Successful!</div>
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
				fieldElement = `<input name="${field.label}" class="sleek-entrance" ${field.isRequired ? "required" : ""} type="date" placeholder="${field.placeholder}" /><button>Add More</button>`;
				break;
			case 'multiTime':
				fieldElement = `<input name="${field.label}" type="time" ${field.isRequired ? "required" : ""} placeholder="${field.placeholder}" /><button>Add More</button>`;
				break;
			case 'payment':
				fieldElement = `
<div id="payment-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
<br>
<table width="100%" border="0">
  <tr>
  <td class="label" style="border-top-left-radius: 10px;">
    Name:
  </td>
  <td class="value" style="border-top-right-radius: 10px; font-weight: bold;">
    ${field.options[0].productName.trim()}
  </td>
</tr>
<tr>
  <td class="label">
    Description:
  </td>
  <td class="value" style="font-size: small; font-style: italic;">
    ${field.options[0].productDescription.trim()}
  </td>
</tr>
<tr>
  <td class="label" style="border-bottom-left-radius: 10px;">
    Amount Due:
  </td>
  <td class="value" style="border-bottom-right-radius: 10px;">
    <b>
      $${(Number.parseFloat(Number.parseFloat(field.options[0].amount).toFixed(2))).toLocaleString("en-US",{style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}
    </b>
  </td>
</tr>
</table>
<input type="hidden" id="payment-status" name="Payment Status" value="NOT PAID">
<input type="hidden" id="payment-amount" name="Payment Amount" value="$${(Number.parseFloat(Number.parseFloat(field.options[0].amount).toFixed(2))).toLocaleString("en-US",{style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2})}">
<br>
<button onclick="handleSubmit()" id="pay-button" style="cursor: pointer; text-align: center; height: 50px; border: 0; border-radius: 15px; font-weight: bolder; color: white; font-size: large; background: linear-gradient(-5deg, #009e60, #009e6080); width: 100%;">FINISH & PAY &rarr;</button>
<div style="display: flex; flex-direction: row;">
<img class="card" src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/VISA@2x.png">
<img class="card" src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/MASTERCARD@2x.png">
<img class="card" src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/AMEX@2x.png">
<img class="card" src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/DISCOVER@2x.png">
<img class="card" src="https://cdn.freebiesupply.com/logos/large/2x/apple-pay-payment-mark-logo-black-and-white.png">
<img class="card" style="max-width: 43px;" src="https://lh3.googleusercontent.com/YD4iH-kP9NPKvJ5_4zJ86mCE2tX-7kIPgYmgMBKEX2Vm7tzOIShpUIerJNxbcfWTlCpoveuyYhHt0D4D5g_d7_5OKREsB2bkqvPGgw=s0"><br>
</div><br>
</div>
<style>
submit-button {
display: none !important;
}
</style>
`;
				actions += `
    <div class="payment-option-buttons">
      <button onclick="editProductName('${field.fieldId}')">Edit Product Name</button>
      <button onclick="editProductDescription('${field.fieldId}')">Edit Product Description</button>
      <button onclick="editPrice('${field.fieldId}')">Edit Price</button>
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

function uploadFile(fieldId) {
	let fileInput = document.getElementById("uploader_" + fieldId);
	let files = fileInput.files;
	if (files.length === 0) {
		alert("Please select a file to upload.");
		return;
	}

	document.getElementById("uploading_" + String(fieldId)).style.display = "block";
	document.getElementById("success_" + String(fieldId)).style.display = "none";
	document.getElementById("error_" + String(fieldId)).style.display = "none";

	// Step 1: Get the best server
	getBestServer().then(server => {
		// Step 2: Upload the file to the server
		uploadFileToServer(server, fileInput.files[0]).then(uploadResponse => {
			console.log("Upload Response:", uploadResponse); // Logging upload response

			// Step 3: Enable CDN access using fileId as contentId
			setCDNAccess(uploadResponse.fileId, fieldId).then(cdnAccessResponse => {
				console.log("CDN Access Response:", cdnAccessResponse); // Logging CDN access response
			});
		});
	}).catch(error => console.error(error));
}

function getBestServer() {
	return fetch('https://api.gofile.io/getServer')
		.then(response => response.json())
		.then(data => {
			console.log("Best Server:", data); // Logging server response
			if (data.status === 'ok') {
				return data.data.server;
			} else {
				throw new Error('Failed to get the best server');
			}
		});
}

function uploadFileToServer(server, file) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('token', 'Sj3WyTQQbyScaUddzzi2fBO3uWyrpV2S'); // Adding token to formData

	return fetch(`https://${server}.gofile.io/uploadFile`, {
			method: 'POST',
			body: formData,
		})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'ok') {
				return data.data;
			} else {
				throw new Error('Failed to upload file');
			}
		});
}

function setCDNAccess(contentId, fieldId) {
	return fetch('https://api.gofile.io/setOption', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contentId: contentId,
				token: 'Sj3WyTQQbyScaUddzzi2fBO3uWyrpV2S',
				option: 'directLink',
				value: 'true',
			}),
		})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'ok') {
				document.getElementById("fileUrl_" + String(fieldId)).value = data.data;
				document.getElementById("uploading_" + String(fieldId)).style.display = "none";
				document.getElementById("success_" + String(fieldId)).style.display = "block";
				return data.data;
			} else {
				document.getElementById(`"error_${fieldId}"`).style.display = "block";
				document.getElementById(`"success_${fieldId}"`).style.display = "none";
				document.getElementById(`"uploading_${fieldId}"`).style.display = "none";
				throw new Error('Failed to set CDN access');
			}
		});
}


function handlePhoneInputs() {

	var phoneInputs = document.querySelectorAll('input[type="tel"]');
	phoneInputs.forEach(phoneInput => {
		phoneInput.addEventListener('input', function (e) {
			var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
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
		window.parent.postMessage(formData, '*');
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
	cssAdjustments.setAttribute("id","cssAdjustments");
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
