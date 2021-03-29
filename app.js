"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
let criteriaList = ["gender", "dob", "height", "weight", "eyeColor", "occupation", "age", "spouce", "parent"];
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = searchByCriteria(people, criteriaList);
      if (searchResults === null) {
        alert("Exiting search application");
        return;
      }
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(person.length === 0){
    alert("Could not find that individual.");
    return app(people); // restart
  } else if (person.length > 1) {
    alert("Multiple individuals that match the search criteria");
    displayPeople(person);
    return app(people);
  }
  let singlePerson = person[0];

  let displayOption = prompt("Found " + singlePerson.firstName + " " + singlePerson.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
    // TODO: get person's info
      displayPerson(singlePerson);
      break;
    case "family":
      familySearch(singlePerson, people);
    break;
    case "descendants":
    // TODO: get person's descendants
      descendantsSearch(singlePerson, people);
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person using the name they entered
  // TODO: Need to figure out how to handle if multiple matches are found
  return foundPerson;
}

function searchByCriteria(people, fullCriteria, soFar = []){
  let currentOptions = fullCriteria.filter(c => !soFar.includes(c));
  let displayText = `The search has been narrowed down by ${soFar.length} criterias so far:\n`;
  for (let i = 0; i < soFar.length; i++) {
	  displayText += (i == 0 ? "" : ", ") + soFar[i];
  }
  displayText += "\n";
  displayText += "Enter a number or 'exit' to quit\n";

  for (let i = 0; i < currentOptions.length; i++) {
	  displayText += `Press ${i + 1} for ${currentOptions[i]}.\n`
  }

  let criteriaNum = promptFor(displayText, checkCriteria(currentOptions));
  if (criteriaNum === 'exit') {
	  return null;
  }

  let criteria = currentOptions[criteriaNum - 1];

  // Display available options here
  let availableValues = [];
  people.forEach( p =>
    {
      if (!availableValues.includes(p[criteria])) {
        availableValues.push(p[criteria]);
      }
    }
  );

  let askForCriteriaValueString = `Please enter a value for ${criteria}.\n`;
  askForCriteriaValueString += "The remaining matches have these values:\n";
  availableValues.forEach(option => askForCriteriaValueString += `${option} `);
  askForCriteriaValueString += "\n";
  
  if (criteria === 'dob') {
	  askForCriteriaValueString += "\nDate of birth should be in m/dd/yyyy format";
  }

  let criteriaValue = promptFor(askForCriteriaValueString, validateCriteriaValue(criteria));
  if (criteria == "weight" || criteria == "height") {
    criteriaValue = parseInt(criteriaValue);
	  if (isNaN(criteriaValue)) {
		  return searchByCriteria(people, fullCriteria, soFar);
	  }
  }
  
  let foundPerson = people.filter(function(person){
    if(person[criteria] === criteriaValue){
      return true;
    }
    else{
      return false;
    }
  });
  
  // check if list is empty
  if (foundPerson.length == 0) {
	  // Ask if user wants to go back
	  return searchByCriteria(people, fullCriteria, soFar);
  }
  soFar.push(criteria);
  // TODO: find the person using the name they entered
  // TODO: Need to figure out how to handle if multiple matches are found
  //user input yes or no to stop
  if (foundPerson.length > 1) {
    displayPeople(foundPerson);
  }
  //Prompt user;

  if(foundPerson.length > 1 && soFar.length < 5){
  var continueSearching = promptFor(`After ${soFar.length} criterias, there are still ${foundPerson.length} maches, would you like to continue searching?  yes or no.`, chars).toLowerCase();
    if (continueSearching == "yes") {
      foundPerson = searchByCriteria(foundPerson, fullCriteria, soFar);
    }
  }
  return foundPerson;
}

// alerts a list of people
function displayPeople(people){
  var firstPart = "There are " + people.length + " match" + (people.length == 1 ? "" : "es") + " so far:\n";
  firstPart += people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n");
  alert(firstPart);
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Age: " + convertToAge(person.dob) + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "EyeColor: " + person.eyeColor + "\n";
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}

function descendantsSearch(person, people) {
	let result = [];
	recursiveDescendantSearch(person, people, result);
	if (result.length > 0) {
		let fullResult = person.firstName + " " + person.lastName + "'s descendants:\n";
		for (let i = 0; i < result.length; i++) {
			fullResult += result[i].firstName + " " + result[i].lastName + "\n";
		}
		alert(fullResult);
	} else {
		alert("Unable to find " + person.firstName + " " + person.lastName + "'s descendants in database");
	}
}
function recursiveDescendantSearch(person, people, result) {
  let filteredList = people.filter(p => p.parents.includes(person.id));
	for (let i = 0; i < filteredList.length; i++) {
		result.push(filteredList[i]);
		recursiveDescendantSearch(filteredList[i], people, result);
	}
}

function familySearch(person, people){
  let result = `Person: ${person.firstName} ${person.lastName} \n`;

    //Get current spouse.
  let currentSpouseId = person.currentSpouse;
  if(currentSpouseId !== null){
    let currentSpouse = people.find(p => p.id === currentSpouseId);
    result += `Current spouse: ${currentSpouse.firstName} ${currentSpouse.lastName} \n`;
  }

  //Get parents and siblings.
  let siblings = [];
  if(person.parents.length > 0){
    person.parents.forEach(id =>{
      
      //Get parent
      let currentParent = people.find(p => p.id === id);
      result += `Parent: ${currentParent.firstName} ${currentParent.lastName} \n`;
      
      //Get siblings of parent
      let currentSiblings = people.filter(p => p.parents.includes(currentParent.id) && p !== person);
      if(currentSiblings.length > 0){
        currentSiblings.forEach(sibling =>{
          if(!siblings.includes(sibling)){
            siblings.push(sibling);
          }
        });
      }
    });
  }
  siblings.forEach(sibling =>{
    result += `Sibling: ${sibling.firstName} ${sibling.lastName} \n`;
  });
  alert(result);
}

function checkCriteria(optionsList){
  return inputVal => {
	  if (inputVal === "exit") {
		return true;
	  } else {
		  let tryParse = parseInt(inputVal);
		  if (isNaN(tryParse)) {
			return false;
		  } else {
			if (tryParse > 0 && tryParse <= optionsList.length) {
			  return true;
			} else {
			  return false;
			}
		  }
	  }
  };
}

function validateCriteriaValue(criteria) {
	return inputVal => {
	  if (criteria === "height" || criteria === "weight") {
		  let tryParse = parseInt(inputVal);
		  if (isNaN(tryParse)) {
			return false;
		  } else {
			  return tryParse > -1;
		  }
	  } else {
		  return true;
	  }
	}
}

//Format for string will look like: "dob": "10/7/1953"
function convertToAge(string){
  //Convert string dob into three separate integers by day, month, year.
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  let dobValues = string.split('/').map(s=> parseInt(s));
    let age = year - dobValues[2];
    if(dobValues[0] === month){
      if(dobValues[1] > day){
        age -= 1;
      }
    }else if(dobValues[0] > month){
      age -= 1;
  }
  return age;
}



